'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import '@/assets/CSS/payment-cancel.css';

// Maps Stripe's decline/error codes to a plain-language reason.
// Extend this as you encounter more codes in production.
const REASON_MAP: Record<string, string> = {
  card_declined: 'Your card was declined by your bank.',
  insufficient_funds: 'Your card has insufficient funds.',
  expired_card: 'Your card has expired.',
  incorrect_cvc: 'The security code entered was incorrect.',
  processing_error: 'A processing error occurred. No charge was made.',
  authentication_required: 'Your bank requires additional authentication for this payment.',
};

const PaymentFailedPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get('error_code') ?? '';
  const reason =
    REASON_MAP[errorCode] ?? 'The payment could not be completed. No charge was made to your card.';

  return (
    <div className="pf-page">
      <div className="pf-glow" aria-hidden="true" />

      <div className="pf-card-wrap">
        <div className="pf-stamp" aria-hidden="true">
          <div className="pf-stamp-inner">Declined</div>
        </div>

        <div className="pf-card" role="alert">
          <p className="pf-eyebrow">Payment not completed</p>
          <h1 className="pf-title">The kitchen didn&apos;t fire</h1>
          <p className="pf-sub">Your order wasn&apos;t placed — the payment didn&apos;t go through.</p>

          <div className="pf-reason">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="pf-reason-text">
              <strong>What happened</strong>
              {reason}
            </span>
          </div>

          <div className="pf-actions">
            <button
              type="button"
              className="pf-btn pf-btn-primary"
              onClick={() => router.push('/checkout')}
            >
              Try payment again
            </button>
            <button
              type="button"
              className="pf-btn pf-btn-ghost"
              onClick={() => router.push('/menu')}
            >
              Back to menu
            </button>
          </div>

          <p className="pf-footnote">
            Charged but seeing this page? <a href="/contact">Contact the front desk</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;