"use client";

type SpinnerCircleProps = {
  size?: number;
  className?: string;
};

export default function SpinnerCircle({ size = 28, className = "text-align-center" }: SpinnerCircleProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`spinner ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 50 50" width={size} height={size}>
        <circle
          className="spinner-track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="spinner-arc"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <style jsx>{`
        .spinner {
          display: inline-block;
        }
        .spinner-track {
          stroke: rgba(113, 35, 35, 0.08);
        }
        .spinner-arc {
          stroke: red;
          stroke-dasharray: 90 60;
          transform-origin: center;
          animation: spinner-rotate 0.85s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        @keyframes spinner-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .spinner-arc {
            animation-duration: 1.8s;
          }
        }
      `}</style>
    </div>
  );
}