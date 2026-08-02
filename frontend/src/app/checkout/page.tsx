
"use client";

import { useEffect, useMemo, useState } from "react";
import {useRouter} from "next/navigation"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { redirect } from "next/navigation";

import "@/assets/CSS/checkout-page.css";
import { useAuth } from "@/hooks/useAuth";
import SpinnerCircle from "@/components/Spinner";
import axiosInstance from "@/libs/axiosInstance";
import { toast } from "sonner";

type OrderType = "DINE_IN" | "DELIVERY" | "TAKEAWAY";

interface OrderSummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface OrderSummary {
  orderType: OrderType;
  kitchenNote: string;
  items: OrderSummaryItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discountRate: number;
  discountAmount: number;
  total: number;
}

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  "DINE_IN": "Dine In",
  "TAKEAWAY": "Takeaway",
  "DELIVERY": "Delivery",
};

// const ORDER_SUMMARY_KEY = "eh-order-summary";

// ---- Zod schema ----
// Address is conditionally required only when orderType === "delivery".
const checkoutSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(60),
    lastName: z.string().trim().min(1, "Last name is required").max(60),
    email: z.string().trim().email("Enter a valid email address"),
    phoneNumber: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number")
      .max(20, "Phone number looks too long")
      .regex(/^[0-9+\-\s()]+$/, "Only digits, spaces, +, -, ( ) are allowed"),
    address: z.string().trim().max(200).optional(),
    orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  })
  .superRefine((data, ctx) => {
    if (data.orderType === "DELIVERY") {
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery address is required (min 5 characters)",
          path: ["address"],
        });
      }
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;


export default function CheckoutPage () {
  const navigate = useRouter();
  const { loginUser, loading } = useAuth();
  

  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

    
    useEffect(() => {
      const fetchOrderSummary = async () => {
        setSummaryLoaded(true);
        try {
            const response = await axiosInstance.get("/get/order/summary");
            if (response.status === 200 || response.status === 304) {
                setOrderSummary(response.data.orderSummary);
                setSummaryLoaded(false);
            }
        } catch (e) {
            console.log("Error fetching order summary:", e);
        } finally {
            setSummaryLoaded(false);
      }
  }

      fetchOrderSummary()
  },[])
  
   

  const orderType: OrderType = orderSummary?.orderType ?? "DINE_IN";
  const isDelivery = orderType === "DELIVERY";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: loginUser?.firstName || "",
      lastName: loginUser?.lastName || "",
      email: loginUser?.email || "",
      phoneNumber: "",
      address: "",
      orderType: "DINE_IN",
    },
  });

  // Pre-populate email (and name, if available) once auth resolves

  // Keep orderType in sync with the summary once it loads
  useEffect(() => {
    if (summaryLoaded) {
      setValue("orderType", orderType);
    }
  }, [summaryLoaded, orderType, setValue]);

  const itemCount = useMemo(
    () => orderSummary?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
    [orderSummary]
  );

  const onSubmit = async (data: CheckoutFormValues) => {
    setSubmitError(null);

    if (!orderSummary) {
      setSubmitError("Your order summary could not be found. Please return to your cart.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: isDelivery ? data.address : undefined,
        },
        order: orderSummary,
      };

      // Wire this up to your actual checkout/payment endpoint via axiosInstance.
      const response = await axiosInstance.post("/checkout/order", { payload });

      if (response.status === 201 || response.status === 200) {
        toast.success("order saved redirecting to payment page .....");
        const url  = response.data.stripeUrl;
        navigate.push(`${url}`);
      
      }

      console.log("Checkout payload:", payload);

      // On success, your backend should return the generated order number
      // for the confirmation/payment-success screen.
      // router.push(`/order-confirmation`);
    } catch (err) {
      console.error("Checkout submission failed:", err);
      setSubmitError("Something went wrong submitting your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (summaryLoaded && loading) {
    return (
      <div className="eh-checkout-loading-wrap">
        <SpinnerCircle size={128} />
      </div>
    );
  }

  if (!loginUser?.email) {
    return redirect('/login');
   
  }

  if (!orderSummary || orderSummary.items.length === 0) {
    return (
      <div className="eh-checkout-page">
        <div className="eh-checkout-empty">
          <p className="eh-checkout-empty-text">
            No order found. Please go back to your cart to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="eh-checkout-page">
      <div className="eh-checkout-layout">
        {/* ---- Checkout Form ---- */}
        <form className="eh-checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className="eh-checkout-eyebrow">Checkout</p>
          <h1 className="eh-checkout-heading">Your Details</h1>

          <div className="eh-field-row">
            <div className="eh-field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                placeholder="Jane"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="eh-error-text">{errors.firstName.message}</p>
              )}
            </div>

            <div className="eh-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="eh-error-text">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="eh-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" readOnly {...register("email")} />
            {errors.email && <p className="eh-error-text">{errors.email.message}</p>}
          </div>

          <div className="eh-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+92 300 1234567"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="eh-error-text">{errors.phoneNumber.message}</p>
            )}
          </div>

          {isDelivery && (
            <div className="eh-field">
              <label htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                rows={3}
                placeholder="Street, apartment, city, postal code"
                {...register("address")}
              />
              {errors.address && (
                <p className="eh-error-text">{errors.address.message}</p>
              )}
            </div>
          )}

          <input type="hidden" {...register("orderType")} />

          {submitError && <p className="eh-error-banner">{submitError}</p>}

          <button type="submit" className="eh-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Placing Order…" : "Place Order"}
            <span aria-hidden="true" style={{ marginLeft: 8 }}>
              →
            </span>
          </button>
        </form>

        {/* ---- Order Summary ---- */}
        <aside className="eh-checkout-ticket" aria-label="Order summary">
          <div className="eh-checkout-ticket-brand">
            <span aria-hidden="true">✦</span>
            <span>EMBERHOUSE</span>
          </div>

          <div className="eh-order-type-badge">{ORDER_TYPE_LABELS[orderType]}</div>

          <div className="eh-checkout-divider" />

          <ul className="eh-checkout-item-list">
            {orderSummary.items.map((item) => (
              <li key={item.id} className="eh-checkout-item-line">
                <span className="eh-checkout-item-name">
                  {item.name} × {item.quantity}
                </span>
                <span className="eh-checkout-item-price">
                  ${item.lineTotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="eh-checkout-divider" />

          <div className="eh-checkout-ticket-row">
            <span>Subtotal</span>
            <span>${orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="eh-checkout-ticket-row">
            <span>Tax</span>
            <span>${orderSummary.tax.toFixed(2)}</span>
          </div>
          {orderSummary.deliveryFee > 0 && (
            <div className="eh-checkout-ticket-row">
              <span>Delivery</span>
              <span>${orderSummary.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          {orderSummary.discountAmount > 0 && (
            <div className="eh-checkout-ticket-row is-discount">
              <span>Discount</span>
              <span>−${orderSummary.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="eh-checkout-total-row">
            <span>Total</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>

          <p className="eh-checkout-footnote">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </aside>
      </div>
    </div>
  );
};

