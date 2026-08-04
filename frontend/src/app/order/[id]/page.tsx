"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// Adjust this import to match your project's axios instance path.
import "@/assets/CSS/order-detail.css";
import axiosInstance from "@/libs/axiosInstance";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface OrderItem {
  id: number;
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  orderId: number;
}

interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}

type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";
type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

interface Order {
  id: number;
  userId: string;
  user: OrderUser;
  orderType: OrderType;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discountAmount: number;
  discountRate: number;
  total: number;
  kitchenNote: string | null;
}

/* ------------------------------------------------------------------ */
/* Static display maps                                                */
/* ------------------------------------------------------------------ */

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  DINE_IN: "Dine In",
  TAKEAWAY: "Takeaway",
  DELIVERY: "Delivery",
};

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

function shortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await axiosInstance.get(`/get/order/${id}`);
        if (isMounted) {
          setOrder(response.data.order ?? response.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage("We couldn't load this order. Please try again.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="eh-order-page">
        <div className="eh-order-page__loading">
          <div className="eh-ember-spinner" aria-hidden="true" />
          <p>Firing up your ticket…</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="eh-order-page">
        <div className="eh-order-page__error">
          <p>{errorMessage ?? "Order not found."}</p>
        </div>
      </div>
    );
  }

  const created = formatDate(order.createdAt);
  const isDelivery = order.orderType === "DELIVERY";
  const hasDiscount = order.discountAmount > 0;
  const customerName = `${order.user.firstName.trim()} ${order.user.lastName.trim()}`.trim();

  return (
    <div className="eh-order-page">
      <div className="eh-ticket">
        {/* Wax-seal style status stamp */}
        <div
          className={`eh-stamp eh-stamp--${order.orderStatus}`}
          aria-label={`Order status: ${STATUS_LABEL[order.orderStatus]}`}
        >
          <span className="eh-stamp__ring" />
          <span className="eh-stamp__label">
            {STATUS_LABEL[order.orderStatus]}
          </span>
        </div>

        {/* Header */}
        <header className="eh-ticket__header">
          <p className="eh-ticket__eyebrow">Emberhouse — Order Ticket</p>
          <h1 className="eh-ticket__order-no">No. {order.id}</h1>
          <div className="eh-ticket__meta">
            <span>{ORDER_TYPE_LABEL[order.orderType]}</span>
            <span className="eh-dot" aria-hidden="true">
              •
            </span>
            <span>{created.date}</span>
            <span className="eh-dot" aria-hidden="true">
              •
            </span>
            <span>{created.time}</span>
          </div>
        </header>

        <div className="eh-tear" role="separator" />

        {/* Customer */}
        <section className="eh-customer" aria-label="Customer details">
          <span className="eh-customer__label">Billed to</span>
          <p className="eh-customer__name">{customerName || "Guest"}</p>
          <div className="eh-customer__row">
            <span>{order.user.email}</span>
          </div>
          <div className="eh-customer__row">
            <span>{order.user.phoneNumber ?? "Not provided"}</span>
            <span className="eh-customer__id" title={order.user.id}>
              #{shortId(order.user.id)}
            </span>
          </div>
        </section>

        <div className="eh-tear" role="separator" />

        {/* Items */}
        <section className="eh-ticket__items" aria-label="Order items">
          <div className="eh-items-head">
            <span>Item</span>
            <span>Qty</span>
            <span>Total</span>
          </div>
          {order.items.map((item) => (
            <div className="eh-item-row" key={item.id}>
              <span className="eh-item-row__name">{item.name}</span>
              <span className="eh-item-row__qty">×{item.quantity}</span>
              <span className="eh-item-row__total">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          ))}
        </section>

        {order.kitchenNote && (
          <div className="eh-kitchen-note">
            <span className="eh-kitchen-note__label">Kitchen note</span>
            <p>{order.kitchenNote}</p>
          </div>
        )}

        <div className="eh-tear" role="separator" />

        {/* Totals */}
        <section className="eh-ticket__totals" aria-label="Order totals">
          <div className="eh-total-row">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          {isDelivery && (
            <div className="eh-total-row">
              <span>Delivery fee</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
          )}

          {hasDiscount && (
            <div className="eh-total-row eh-total-row--discount">
              <span>Discount ({(order.discountRate * 100).toFixed(0)}%)</span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}

          <div className="eh-total-row">
            <span>Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>

          <div className="eh-total-row eh-total-row--grand">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </section>

        <footer className="eh-ticket__footer">
          <p>Order #{order.id} · Thank you for dining with us</p>
        </footer>
      </div>
    </div>
  );
}