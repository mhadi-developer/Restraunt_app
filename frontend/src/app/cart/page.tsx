"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { redirect, useRouter } from 'next/navigation';
import Link from "next/link";
import "@/assets/CSS/cart-page.css";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import SpinnerCircle from "@/components/Spinner";
import axiosInstance from "@/libs/axiosInstance";

type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  "DINE_IN": "Dine In",
  "TAKEAWAY": "Takeaway",
  "DELIVERY": "Delivery",
};

const TAX_RATE = 0.08;
const DELIVERY_FEE = 4.5;
const PROMO_CODE = "EMBER10";
const PROMO_DISCOUNT = 0.1;

interface OrderSummaryItem {
  id: number;
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

export default function CartPage() {
  const { loginUser, loading } = useAuth();
  const {
    handleSubmit,
    register,
    setValue,
  } = useForm();

  const { cart, incrementItem, decrementItem, removeFromCart, clearCart } = useCart();

  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");
  const [kitchenNote, setKitchenNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "applied" | "invalid">("idle");
  const [discountRate, setDiscountRate] = useState(0);
  const router = useRouter();

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.itemQuantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0),
    [cart]
  );

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === PROMO_CODE) {
      setDiscountRate(PROMO_DISCOUNT);
      setPromoStatus("applied");
    } else {
      setDiscountRate(0);
      setPromoStatus("invalid");
    }
  };

  const tax = subtotal * TAX_RATE;
  const deliveryFee = orderType === "DELIVERY" ? DELIVERY_FEE : 0;
  const discountAmount = subtotal * discountRate;
  const total = subtotal + tax + deliveryFee - discountAmount;

  // Called on form submit (clicking "Proceed to Checkout")
  const onProceedToCheckout = async () => {
    if (cart.length === 0) return;

    const orderSummary: OrderSummary = {
      orderType,
      kitchenNote,
      items: cart.map((item) => ({
        id: item.id,
        name: item.itemName,
        price: item.itemPrice,
        quantity: item.itemQuantity,
        lineTotal: item.itemPrice * item.itemQuantity,
      })),
      subtotal,
      tax,
      deliveryFee,
      discountRate,
      discountAmount,
      total,
    };


    const response = await axiosInstance.post('/cart/order/summary', {
      orderSummary
    });
    
    if(response.status === 201 || response.status === 200){
      router.push('/checkout');
    }

    
   
    // Clear cart + local form state
    clearCart();
    
  };

  if (!loginUser || !loginUser.email) return redirect('/login');

  if (loading) return <SpinnerCircle size={128} />;

  if (cart.length === 0) {
    return (
      <div className="eh-cart-page eh-cart-empty">
        <span className="eh-empty-mark" aria-hidden="true">✦</span>
        <h1>Your table is set, but empty</h1>
        <p>Nothing&rsquo;s in your order yet. Take a look at tonight&rsquo;s menu and start building your plate.</p>
        <Link href="/menu" className="eh-checkout-btn eh-empty-cta">
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="eh-cart-page">
      <header className="eh-cart-header">
        <p className="eh-eyebrow">Review &amp; Confirm</p>
        <div className="eh-cart-heading-row">
          <h1>Your Order</h1>
          <span className="eh-item-count">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </header>

      <div className="eh-cart-layout">
        <section className="eh-cart-list" aria-label="Cart items">
          {cart.map((item) => (
            <article className="eh-item-row" key={item.id}>
              <div className="eh-item-thumb" aria-hidden="true">
                {item.itemImages && item.itemImages.length > 0 && (
                  <Image
                    src={item.itemImages[0].secure_url}
                    alt={item.itemName}
                    width={50}
                    height={50}
                  />
                )}
              </div>

              <div className="eh-item-main">
                <div className="eh-item-title-line">
                  <h3>{item.itemName}</h3>
                  <span className="eh-leader" aria-hidden="true" />
                  <span className="eh-item-price">
                    ${(item.itemPrice * item.itemQuantity).toFixed(2)}
                  </span>
                </div>

                <p className="eh-item-desc">{item.itemDescription}</p>

                <div className="eh-item-controls">
                  <div className="eh-stepper">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.itemName}`}
                      onClick={() => decrementItem(item.id)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.itemQuantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.itemName}`}
                      onClick={() => incrementItem(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="eh-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}

          <div className="eh-kitchen-note">
            <label htmlFor="kitchen-note">Add a note for the kitchen</label>
            <textarea
              id="kitchen-note"
              placeholder="Allergies, spice level, anything the kitchen should know…"
              value={kitchenNote}
              onChange={(e) => setKitchenNote(e.target.value)}
              rows={3}
            />
          </div>
        </section>

        <form onSubmit={handleSubmit(onProceedToCheckout)}>
          <aside className="eh-ticket" aria-label="Order summary">
            <div className="eh-ticket-inner">
              <div className="eh-ticket-brand">
                <span aria-hidden="true">✦</span>
                <span>EMBERHOUSE</span>
              </div>

              <div className="eh-order-type" role="tablist" aria-label="Order type">
                {(Object.keys(ORDER_TYPE_LABELS) as OrderType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="tab"
                    aria-selected={orderType === type}
                    className={`eh-tab${orderType === type ? " is-active" : ""}`}
                    onClick={() => setOrderType(type)}
                  >
                    {ORDER_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>

              <div className="eh-ticket-divider" aria-hidden="true" />

              <ul className="eh-ticket-items">
                {cart.map((item) => (
                  <li className="eh-ticket-line" key={item.id}>
                    <span className="eh-ticket-line-name">
                      {item.itemName} × {item.itemQuantity}
                    </span>
                    <span className="eh-leader" aria-hidden="true" />
                    <span className="eh-ticket-line-price">
                      ${(item.itemPrice * item.itemQuantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="eh-ticket-divider" aria-hidden="true" />

              <div className="eh-ticket-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="eh-ticket-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {orderType === "DELIVERY" && (
                <div className="eh-ticket-row">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {discountRate > 0 && (
                <div className="eh-ticket-row eh-ticket-discount">
                  <span>Promo ({PROMO_CODE})</span>
                  <span>−${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="eh-promo">
                <input
                  aria-label="Promo code"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="button" onClick={applyPromo}>
                  Apply
                </button>
              </div>
              {promoStatus === "applied" && (
                <p className="eh-promo-msg is-success">
                  {PROMO_CODE} applied — {PROMO_DISCOUNT * 100}% off your order.
                </p>
              )}
              {promoStatus === "invalid" && (
                <p className="eh-promo-msg is-error">That code isn&rsquo;t valid. Check and try again.</p>
              )}

              <div className="eh-ticket-total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button type="submit" className="eh-checkout-btn">
                Proceed to Checkout
                <span aria-hidden="true">→</span>
              </button>

              <p className="eh-ticket-footnote">
                {itemCount} {itemCount === 1 ? "item" : "items"} · Prices include applicable
                service charges where required.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}