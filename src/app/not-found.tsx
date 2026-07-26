import Link from 'next/link';

export default function NotFound() {
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
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Animated Brand Icon Badge */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(0, 119, 182, 0.25))',
            border: '2px solid rgba(0, 180, 216, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: 'var(--color-primary)',
            boxShadow: '0 0 25px rgba(0, 180, 216, 0.3)',
          }}
        >
          🔍
        </div>

        {/* 404 Title & Subtitle */}
        <div>
          <h1
            style={{
              fontSize: '4.5rem',
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}
          >
            404
          </h1>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Page Not Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
            The page or resource you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/"
          className="btn btn-primary"
          style={{
            padding: '0.85rem 2rem',
            fontSize: '1rem',
            marginTop: '1rem',
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
  );
}
