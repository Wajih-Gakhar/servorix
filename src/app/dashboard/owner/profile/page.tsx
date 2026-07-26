'use client';

import { useState, useEffect, Suspense } from 'react';
import { getOwnerProfile, updateOwnerProfile } from '@/app/actions/profileActions';
import BusinessSwitcher from '../BusinessSwitcher';
import { useSearchParams } from 'next/navigation';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { User, Mail, Phone, Upload, Building, Globe, Save, FileText } from 'lucide-react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getOwnerProfile(businessId || undefined).then((res) => {
      if (res.success) {
        setProfile(res);
      }
      setLoading(false);
    });
  }, [businessId]);

  if (loading) return <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading profile...</p>;
  if (!profile || !profile.user) return <p style={{ color: 'var(--color-error)', padding: '2rem 0' }}>Error loading profile.</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateOwnerProfile(new FormData(e.currentTarget));
    if (res.success) {
      alert('Profile updated successfully!');
    } else {
      alert(res.error || 'Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Context Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Executive Profile</h1>
        {profile.businesses && profile.businesses.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Context:</span>
            <BusinessSwitcher
              businesses={profile.businesses}
              activeId={profile.business?.id || profile.businesses[0]?.id}
            />
          </div>
        )}
      </div>

      {/* Glassmorphic Owner Banner */}
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
        <p style={{ margin: 0, marginTop: '0.4rem', opacity: 0.85, fontSize: '0.95rem', fontWeight: 600 }}>
          Business Owner &amp; Executive
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Personal Credentials */}
        <div className="card glass-card" style={{ padding: '2rem' }}>
          <h2
            style={{
              fontSize: '1.3rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <User size={20} style={{ color: 'var(--color-primary)' }} />
            Personal Credentials
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                Executive Avatar Upload
              </label>
              <input
                type="file"
                name="profileImageFile"
                accept="image/*"
                className="form-input"
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <input type="hidden" name="profileImage" value={profile.user.profileImage || ''} />
            </div>
          </div>
        </div>

        {/* Business Assets & Configuration */}
        {profile.business && (
          <div className="card glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.6rem',
              }}
            >
              {profile.business.businessLogo ? (
                <div
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: 'var(--radius-md)',
                    backgroundImage: `url(${profile.business.businessLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--border-color)',
                  }}
                ></div>
              ) : (
                <Building size={20} style={{ color: 'var(--color-primary)' }} />
              )}
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Business Configuration</h2>
            </div>

            <input type="hidden" name="businessId" value={profile.business.id} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  <Building size={15} style={{ color: 'var(--color-primary)' }} />
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  defaultValue={profile.business.name}
                  required
                  className="form-input"
                  style={{ width: '100%' }}
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
                  <FileText size={15} style={{ color: 'var(--color-primary)' }} />
                  Description / Bio
                </label>
                <textarea
                  name="businessDescription"
                  defaultValue={profile.business.description}
                  rows={3}
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                ></textarea>
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
                  <Globe size={15} style={{ color: 'var(--color-primary)' }} />
                  Public Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  defaultValue={profile.business.website || ''}
                  className="form-input"
                  style={{ width: '100%' }}
                  placeholder="https://..."
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
                  Business Logo Upload
                </label>
                <input
                  type="file"
                  name="businessLogoFile"
                  accept="image/*"
                  className="form-input"
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <input type="hidden" name="businessLogo" value={profile.business.businessLogo || ''} />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          style={{ alignSelf: 'flex-start', gap: '0.5rem' }}
        >
          <Save size={16} />
          {saving ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </form>

      {/* Security & Password Settings Form */}
      <ChangePasswordForm />
    </div>
  );
}

export default function OwnerProfilePage() {
  return (
    <Suspense fallback={<p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>Initializing Profile Module...</p>}>
      <ProfileContent />
    </Suspense>
  );
}
