'use client';

import { useState } from 'react';
import { changePassword } from '@/app/actions/auth';
import { Eye, EyeOff, Lock, KeyRound, ShieldCheck } from 'lucide-react';

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    const res = await changePassword(formData);

    if (res.error) {
      setError(res.error);
    } else {
      setMessage('Password successfully changed.');
      e.currentTarget.reset(); // Clear passwords on success
    }

    setLoading(false);
  };

  return (
    <div className="card glass-card" style={{ padding: '2rem', marginTop: '1.5rem', maxWidth: '700px', margin: '1.5rem auto 0 auto' }}>
      <h2
        style={{
          fontSize: '1.3rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: 'var(--text-primary)',
        }}
      >
        <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
        Security &amp; Password Settings
      </h2>

      {error && (
        <div className="badge badge-error" style={{ marginBottom: '1.25rem', width: '100%', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {message && (
        <div
          className="badge badge-success"
          style={{
            marginBottom: '1.25rem',
            width: '100%',
            padding: '0.85rem 1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>✅</span> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Current Password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <KeyRound size={15} style={{ color: 'var(--color-primary)' }} />
            Current Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              required
              className="form-input"
              placeholder="••••••••"
              style={{ width: '100%', paddingRight: '2.75rem' }}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.2rem',
              }}
              title={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <Lock size={15} style={{ color: 'var(--color-primary)' }} />
            New Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              required
              minLength={8}
              className="form-input"
              placeholder="At least 8 characters"
              style={{ width: '100%', paddingRight: '2.75rem' }}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.2rem',
              }}
              title={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', marginBottom: 0 }}>
            Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <Lock size={15} style={{ color: 'var(--color-primary)' }} />
            Confirm New Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              required
              minLength={8}
              className="form-input"
              placeholder="Re-enter new password"
              style={{ width: '100%', paddingRight: '2.75rem' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.2rem',
              }}
              title={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', marginTop: '0.5rem', gap: '0.5rem' }}>
          <ShieldCheck size={16} />
          {loading ? 'Verifying...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
