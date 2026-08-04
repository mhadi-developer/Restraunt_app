'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/assets/CSS/payment-success.css';
import axiosInstance from '@/libs/axiosInstance';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface OrderSummary {
  id: number;
  orderNumber: string;
  orderType: 'DINE_IN' | 'DELIVERY' | 'TAKEAWAY';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

type FetchState = 'loading' | 'success' | 'error';

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');


  const [state, setState] = useState<FetchState>('loading');
  const [order, setOrder] = useState<OrderSummary | null>(null);

  // Bail out early if the param is missing — no point calling the API.
  useEffect(() => {
    if (!sessionId || !orderId) {
      router.replace('/');
    }
  }, [sessionId, router]);

  // Runs once per sessionId — not on every render.
  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const getOrder = async () => {
      try {
        const response = await axiosInstance.get(`/get/order/${orderId}`);

        if(response.status === 200 || response.status === 201) {  

          setOrder(response.data.order);
           setState('success');
        }

    // sends the auth cookie so the backend knows who's asking
  
      
       
      } catch (err) {
        console.error('Payment verification error:', err);
        if (!cancelled) setState('error');
      }
    };

    getOrder();

    // Prevents a state update on an unmounted component if the user
    // navigates away while the request is still in flight.
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) {
    // Redirect is in-flight via the effect above; render nothing meaningful.
    return null;
  }

  if (state === 'loading') {
    return (
      <div className="ps-page">
        <p className="ps-loading">Confirming your order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="ps-page">
        <p className="ps-error">
          We couldn&apos;t confirm this order. If you were charged, check your email for a
          receipt, or{' '}
          <a href="/contact" style={{ color: 'var(--color-gold)' }}>
            contact us
          </a>
          .
        </p>
      </div>
    );
  }

  const orderTypeLabel: Record<OrderSummary['orderType'], string> = {
    DINE_IN: 'Dine-in',
    DELIVERY: 'Delivery',
    TAKEAWAY: 'Takeaway',
  };

  return (
    <div className="ps-page">
      <div className="ps-glow" aria-hidden="true" />

      {/* steam wisps */}
      {['s1', 's2', 's3'].map((cls) => (
        <span key={cls} className={`ps-steam ${cls}`} aria-hidden="true">
          <svg width="20" height="70" viewBox="0 0 20 70">
            <path
              d="M10 70 C 2 55, 18 45, 10 30 C 2 15, 18 10, 10 0"
              stroke="#f4ede3"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}

      <div className="ps-card-wrap">
        <div className="ps-seal" aria-hidden="true">
          <div className="ps-seal-ring" />
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 C 12 8, 16 9, 16 14 C 16 17.5, 14 20, 12 20 C 10 20, 8 17.5, 8 14 C 8 9, 12 8, 12 2 Z" />
          </svg>
        </div>

        <div className="ps-card" role="status" aria-live="polite">
          <p className="ps-eyebrow">Order confirmed</p>
          <h1 className="ps-title">Your table is set</h1>
          <p className="ps-sub">
            Payment received — the kitchen has your ticket and it&apos;s already moving.
          </p>

          <hr className="ps-divider" />

          <div className="ps-order-meta">
            <span>
              Order <strong>#{order.id}</strong>
            </span>
            <span>{orderTypeLabel[order.orderType]}</span>
          </div>

          <div className="ps-items">
            {order.items.map((item) => (
              <div className="ps-item-row" key={item.id}>
                <span className="ps-item-name">
                  {item.name}
                  <span className="ps-item-qty">× {item.quantity}</span>
                </span>
                <span>${item.lineTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="ps-total-row">
            <span className="ps-total-label">Total paid</span>
            <span className="ps-total-amount">${order.total.toFixed(2)}</span>
          </div>

          <div className="ps-actions">
            <button
              type="button"
              className="ps-btn ps-btn-primary"
              onClick={() => router.push(`/order/${order.id}`)}
            >
              Track your order
            </button>
            <button
              type="button"
              className="ps-btn ps-btn-ghost"
              onClick={() => router.push('/menu')}
            >
              Back to menu
            </button>
          </div>

          <p className="ps-footnote">
            A receipt has been sent to your email. Questions?{' '}
            <a href="/contact">Reach the front desk</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;