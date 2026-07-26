'use client';

import { useState, useEffect } from 'react';
import { getCustomerProfile, updateCustomerProfile } from '@/app/actions/profileActions';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { User, Mail, Phone, Upload, Save, ShieldCheck } from 'lucide-react';

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCustomerProfile().then((res) => {
      if (res.success) {
        setProfile(res);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading profile...</p>;
  if (!profile || !profile.user) return <p style={{ color: 'var(--color-error)', padding: '2rem 0' }}>Error loading profile.</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateCustomerProfile(new FormData(e.currentTarget));
    if (res.success) {
      alert('Profile updated successfully!');
    } else {
      alert(res.error || 'Failed to update user profile');
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Profile Header Card */}
      <div
        style={{
          position: 'relative',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(0, 119, 182, 0.25))',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 180, 216, 0.3)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '3px solid var(--color-primary)',
            backgroundImage: `url(${profile.user.profileImage || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 20px rgba(0, 180, 216, 0.3)',
          }}
        ></div>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{profile.user.name}</h1>
        <p style={{ margin: 0, marginTop: '0.4rem', opacity: 0.85, fontSize: '0.95rem' }}>{profile.user.email}</p>
      </div>

      {/* Account Details Card */}
      <div className="card glass-card" style={{ padding: '2rem' }}>
        <h2
          style={{
            fontSize: '1.3rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <User size={20} style={{ color: 'var(--color-primary)' }} />
          Account Credentials
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              style={{
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
              }}
            >
              <User size={15} style={{ color: 'var(--color-primary)' }} />
              Full Name
            </label>
            <input
              type="text"
              name="userName"
              defaultValue={profile.user.name}
              required
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0, opacity: 0.7 }}>
            <label
              style={{
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
              }}
            >
              <Mail size={15} style={{ color: 'var(--color-primary)' }} />
              Email Address (Secured)
            </label>
            <input
              type="email"
              defaultValue={profile.user.email}
              disabled
              className="form-input"
              style={{ width: '100%', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              style={{
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
              }}
            >
              <Phone size={15} style={{ color: 'var(--color-primary)' }} />
              Phone Number
            </label>
            <input
              type="tel"
              name="userPhone"
              defaultValue={profile.user.phone || ''}
              className="form-input"
              style={{ width: '100%' }}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              style={{
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
              }}
            >
              <Upload size={15} style={{ color: 'var(--color-primary)' }} />
              Profile Picture Upload
            </label>
            <input
              type="file"
              name="profileImageFile"
              accept="image/*"
              className="form-input"
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', marginBottom: 0 }}>
              Select an image file to update your avatar globally across reviews and bookings.
            </p>
            <input type="hidden" name="profileImage" value={profile.user.profileImage || ''} />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem', gap: '0.5rem' }}
          >
            <Save size={16} />
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Security & Password Settings Form */}
      <ChangePasswordForm />
    </div>
  );
}
