import { generateToken } from "../../utils/generateJWT.js";
import prisma from "../../utils/prismaClient.js";
import argon2 from "argon2";
import { redis } from "../config/redisClient.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await argon2.hash(password);

    const emailInDB = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailInDB) {
      return res.status(400).json({
        message: " Email Already Exist , Try to Login",
      });
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: `User Registered with name ${firstName} ${lastName} .`,
      success: "true",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};
// *******************************************************************
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }

    const isPasswordMatched = await argon2.verify(user.password, password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }

      const token = generateToken(user.id);
      
      
    return  res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:'/',
        maxAge: 60*60*1000,
    }).status(200).json({
      message: `User ${user.lastName} has logged in successfully`,
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// **********************************************************

export const getLoginUser = async (req, res) => {

    const loginUser = await prisma.user.findUnique({
        where: {
            id: req.loginUser.userId
      },
      omit: {
        password:true
      }
    });
  if (loginUser) {
    loginUser.role = 'user';
    
        return res.status(200).json({
            message: "user validated successfully",
            loginUser
         })
    }

}
// *********************************************************

export const logoutUser = async (req, res) => {
  try {
    return res.clearCookies("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (err) {
    res.status(500).json({
      message: 'unable to logout user' && err?.message
    })
  }
}

// ********************************************************************

export const saveOrderSummary = async(req , res)=>{
  try {
    const {orderSummary} = req.body;

    console.log({ orderSummary });
    if(orderSummary){
      const cacheKey = 'cacheOrder'
      await redis.set(cacheKey, JSON.stringify(orderSummary), {
        EX: 600,
      });
    }

    return res.status(201).json({
      message: 'Order cached succesfully valid for 10Mints'
    })
    
  } catch (error) {
    return res.status(500).json({
      message: error.message || "server error"
    })
  }
}

//********************************************************************** */
export const getOrderSummary = async (req, res) => {
  try {
    const cacheKey = 'cacheOrder';

    const cachedOrderSummary = await redis.get(cacheKey);
   if(!cachedOrderSummary){
    return res.status(404).json({
      message: "order summary not found"
    });
    }
    return res.status(200).json({
      message: "order summary fetched successfully",
      orderSummary: JSON.parse(cachedOrderSummary)
    })

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error?.message || "server error"
    })
    
  }
}
// *****************************************************************

export const checkoutOrderSaved = async (req, res) => {
  try {
    const { payload } = req.body;
    const userId = req.loginUser.id; // ⚠️ assumes you already have the logged-in user's id (from auth middleware/session/JWT)

    const { order, customer } = payload;
  

    const newOrder = await prisma.checkoutOrder.create({
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
          connect: { id: userId , email: customer.email }, // connect to the existing user by id
        },
      
        items: {
          create: order.items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            itemId: item.id, // direct foreign key to existing Item
          })),
        },
      },
      include: { items: true  , user: true},
    });
   
   

const lineItems = order.items.map((item) => {
      // Extract first secure_url from itemImages array safely
      const imageUrl = item.itemImages?.[0]?.secure_url;

      // Pass image array only if a valid HTTPS string URL exists
      const images = imageUrl && imageUrl.startsWith("https://") ? [imageUrl] : [];

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(images.length > 0 && { images }), // Stripe expects an array of HTTPS strings
          },
          unit_amount: Math.round(item.price * 100), // Convert amount to cents
        },
        quantity: item.quantity,
      };
    });

    // 3. Append Delivery Fee if applicable
    if (order.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(order.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customer.email,
      metadata: {
        orderId: newOrder.id.toString(), // Store DB order ID for webhook processing
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder.id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel?canceled=true`,
    });

    res.status(201).json({
      order: newOrder,
      stripeUrl: session.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};