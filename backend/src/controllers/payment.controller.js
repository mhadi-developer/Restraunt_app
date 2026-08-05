import Stripe from 'stripe';
import prisma from "../../utils/prismaClient.js";// adjust to however you export your Prisma client
import { redis } from "../config/redisClient.js";// adjust to however you export your Redis client
import {sendEmail} from "../services/email.service.js";
import { orderStatusEmailTemplate } from "../template/email.template.js";
import {sendOrderStatusWhatsApp} from "../services/whatsapp.message.send.service.js"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─────────────────────────────────────────────
// Creates the order row + Stripe Checkout Session
// ─────────────────────────────────────────────
export const checkoutOrderSaved = async (req, res) => {
  try {
    const { payload } = req.body;
    const userId = req.loginUser.id; // set by requireAuth middleware

    const { order, customer } = payload;

    if (!customer?.phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Keep profile phone in sync + create the order atomically —
    // if either fails, both roll back.
    const [, newOrder] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.loginUser.userId, email: customer?.email },
        data: { phoneNumber: customer.phoneNumber },
      }),
      prisma.checkoutOrder.create({
        data: {
          orderType: order.orderType,
          kitchenNote: order.kitchenNote || null,
          deliveryFee: order.deliveryFee,
          discountAmount: order.discountAmount,
          discountRate: order.discountRate,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total,
          user: {
            connect: { id: req.loginUser.userId, email: customer.email }, // trusted server-side id only
          },
          items: {
            create: order.items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
              itemId: item.id,
            })),
          },
        },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      }),
    ]);

    const lineItems = order.items.map((item) => {
      const imageUrl = item.itemImages?.[0]?.secure_url;
      const images =
        imageUrl && imageUrl.startsWith("https://") ? [imageUrl] : [];

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(images.length > 0 && { images }),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    if (order.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Delivery Fee" },
          unit_amount: Math.round(order.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customer.email,
      metadata: {
        orderId: newOrder.id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${newOrder.id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel?canceled=true`,
    });

    // -------------------------------------------------------------------
    // Sequential Email & WhatsApp Trigger Sequence
    // -------------------------------------------------------------------
    if (newOrder.user.email) {
      const customerFullName =
        `${newOrder.user.firstName || ""} ${newOrder.user.lastName || ""}`.trim();
      const formattedStatus = newOrder.orderStatus
        ? newOrder.orderStatus.toUpperCase()
        : "PENDING";

      const html = orderStatusEmailTemplate({
        customerName: customerFullName,
        customerEmail: newOrder.user.email,
        orderId: newOrder.id,
        orderStatus: formattedStatus,
        orderType: newOrder.orderType,
      });

      // Execute sequential notifications (Email first, then WhatsApp)
      (async () => {
        try {
          // 1. Send Email Notification
          await sendEmail({
            to: newOrder.user.email,
            subject: `Order #${newOrder.id} - ${formattedStatus}`,
            html: html,
          });
          console.log(
            `Email sent to ${newOrder.user.email} for Order #${newOrder.id}`,
          );

          // 2. Send WhatsApp Notification right after email completes
          if (customer.phoneNumber || newOrder.user.phoneNumber) {
            await sendOrderStatusWhatsApp(
              {
                customerName: customerFullName,
                orderId: newOrder.id,
                orderStatus: formattedStatus,
                orderType: newOrder.orderType,
                customerPhone: customer.phoneNumber || newOrder.user.phoneNumber,
              },
            );
            console.log(
              `WhatsApp notification dispatched for Order #${newOrder.id}`,
            );
          }
        } catch (notifyError) {
          console.error("Failed executing order notifications:", notifyError);
        }
      })();
    }

    res.status(201).json({
      order: newOrder,
      stripeUrl: session.url,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// ─────────────────────────────────────────────
// Verifies payment + confirms the requesting user owns the order
// ─────────────────────────────────────────────
export const verifyPayment = async (req, res) => {
  const { session_id } = req.query;
  const requestingUserId = req.loginUser?.id; // set by requireAuth middleware — route must be protected

  if (!requestingUserId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    // orderId comes ONLY from Stripe's server-side metadata — never from the client/URL.
    const orderId = Number(session.metadata.orderId);
    if (!orderId) {
      return res.status(400).json({ error: 'Order reference missing from session' });
    }

    const order = await prisma.checkoutOrder.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ownership check — the actual fix. A valid, paid session_id still
    // can't return someone else's order if it isn't tied to this user.
    if (order.userId !== requestingUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json({
      orderNumber: String(order.id),
      orderType: order.orderType,
      items: order.items.map((i) => ({
        id: i.itemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: order.deliveryFee,
      total: order.total,
    });
  } catch (err) {
    console.error('verifyPayment error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// *********************************************************************


export const getOrder = async (req , res) => {
  try {
    const { id } = req.params; // Access the 'id' parameter from req.params
    console.log(req.loginUser);
    const {userId } = req.loginUser;

    console.log(`getOrder called with id: ${id} for userId: ${userId}`);

    if (!userId || !id) {
      return res.status(401).json({ error: 'Not authenticated or missing order ID' });
    }
     const cacheKey = `order:${userId}:${id}`;
    const cachedOrder = await redis.get(cacheKey);

    if (cachedOrder) {
      return res.status(200).json({
        message: 'Order retrieved successfully from cache',
        order: JSON.parse(cachedOrder),
        success: true,
        source: 'cache'
      })
    }
 
    const foundOrderById = await prisma.checkoutOrder.findUnique({
      where:{
        id: Number.parseInt(id),
        userId: userId
      },
      include: {
        items: true,
        user:{
          omit:{
            password:true
          }
        }
      },
    })

    if (!foundOrderById) {
      return res.status(404).json({ error: 'Order not found or does not belong to user' });
    }

   
    await redis.set(cacheKey, JSON.stringify(foundOrderById), 'EX', 900); 

    return res.status(200).json({
      message: 'Order retrieved successfully',
      order: foundOrderById,
      success: true,
      source: 'database'
    })
  } catch (error) {
    console.error('getOrder error:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
}