'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception telemetry internally without revealing to user
    console.error('Servorix Global Error Boundary caught exception:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        className="glass-card animate-fade-in-up"
        style={{
          maxWidth: '600px',
          width: '100%',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Error Icon Badge */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: 'var(--color-error)',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.2)',
          }}
        >
          ⚠️
        </div>

        {/* Title & Explanation */}
        <div>
          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            Something Unexpected Happened
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              maxWidth: '440px',
              margin: '0.75rem auto 0 auto',
              lineHeight: 1.6,
            }}
          >
            We encountered a temporary processing issue while loading this resource. Your account and booking data remain safe.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Try Again
          </button>

          <Link
            href="/"
            className="btn btn-secondary"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
