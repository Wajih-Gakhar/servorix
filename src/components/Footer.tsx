'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'rgba(6, 9, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '3rem 1.5rem 2rem 1.5rem',
        marginTop: 'auto',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          {/* Brand & Developer Information */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Servorix
              </span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(0, 180, 216, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(0, 180, 216, 0.25)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
                SaaS Suite
              </span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Developed by <strong style={{ color: 'var(--text-primary)' }}>Muhammad Wajih Ul Hassan</strong> &bull; Founder &amp; Full Stack Developer
            </p>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* GitHub */}
            <a
              href="https://github.com/Wajih-Gakhar"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              aria-label="GitHub Profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
              className="footer-social-icon"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/wajih2206"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
              className="footer-social-icon"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:wajihgakhar2006@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Email Contact"
              aria-label="Email Contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
              className="footer-social-icon"
            >
              <Mail size={18} />
            </a>

            {/* Portfolio Placeholder */}
            <a
              href="https://v0-wajih-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              title="Portfolio Profile"
              aria-label="Portfolio Profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              className="footer-social-icon"
            >
              <Globe size={18} />
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            &copy; 2026 Servorix. Built with <span style={{ color: '#EF4444' }}>❤️</span> by <strong>Muhammad Wajih Ul Hassan</strong>.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
            <Link href="/businesses" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Explore</Link>
            <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
