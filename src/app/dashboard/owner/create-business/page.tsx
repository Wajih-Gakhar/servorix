'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBusiness } from '@/app/actions/business';
import { Building, Tag, FileText, MapPin, Phone, Clock, Rocket, AlertCircle } from 'lucide-react';

export default function CreateBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await createBusiness(new FormData(e.currentTarget));

    if (res.success) {
      window.location.assign('/dashboard/owner/profile');
    } else {
      setError(res.error || 'Failed to create business');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          padding: '2rem 1.75rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(0, 119, 182, 0.25))',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 180, 216, 0.3)',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 180, 216, 0.2)',
            border: '2px solid rgba(0, 180, 216, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            boxShadow: '0 0 15px rgba(0, 180, 216, 0.25)',
          }}
        >
          <Rocket size={26} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Deploy New Business</h1>
          <p style={{ margin: 0, marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Register your enterprise into the Servorix network to enable instant bookings.
          </p>
        </div>
      </div>

      {/* Deploy Form Card */}
      <div className="card glass-card" style={{ padding: '2rem' }}>
        {error && (
          <div
            className="badge badge-error"
            style={{
              marginBottom: '1.25rem',
              width: '100%',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Business Name */}
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
              name="name"
              required
              className="form-input"
              style={{ width: '100%' }}
              placeholder="E.g., Titanium Fitness Center"
            />
          </div>

          {/* Sector & Category Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                <Tag size={15} style={{ color: 'var(--color-primary)' }} />
                Platform Sector
              </label>
              <select name="type" required className="form-input" style={{ width: '100%' }}>
                <option value="SALON">Beauty &amp; Grooming Center</option>
                <option value="GYM">Fitness &amp; Performance</option>
              </select>
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
                <Tag size={15} style={{ color: 'var(--color-primary)' }} />
                Category
              </label>
              <select name="category" required className="form-input" style={{ width: '100%' }}>
                <option value="Barbershop">Barbershop</option>
                <option value="Hair Salon">Hair Salon</option>
                <option value="Spa & Massage">Spa &amp; Massage</option>
                <option value="Nail Studio">Nail Studio</option>
                <option value="Esthetician">Esthetician</option>
                <option value="CrossFit">CrossFit</option>
                <option value="Personal Training">Personal Training</option>
                <option value="Yoga Studio">Yoga Studio</option>
                <option value="Boxing">Boxing &amp; Martial Arts</option>
                <option value="General Gym">General Gym</option>
              </select>
            </div>
          </div>

          {/* Description */}
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
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              className="form-input"
              style={{ width: '100%' }}
              placeholder="Brief description of services and specialized amenities..."
            ></textarea>
          </div>

          {/* City & Phone Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
                City
              </label>
              <input
                type="text"
                name="city"
                required
                className="form-input"
                style={{ width: '100%' }}
                placeholder="E.g., New York"
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
                Contact Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                style={{ width: '100%' }}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Address */}
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
              <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
              Full Street Address
            </label>
            <input
              type="text"
              name="address"
              required
              className="form-input"
              style={{ width: '100%' }}
              placeholder="E.g., 100 Broadway Suite 4"
            />
          </div>

          {/* Opening & Closing Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                <Clock size={15} style={{ color: 'var(--color-primary)' }} />
                Opening Time
              </label>
              <input
                type="time"
                name="openingTime"
                required
                defaultValue="09:00"
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
                <Clock size={15} style={{ color: 'var(--color-primary)' }} />
                Closing Time
              </label>
              <input
                type="time"
                name="closingTime"
                required
                defaultValue="17:00"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem', gap: '0.5rem' }}
          >
            <Rocket size={16} />
            {loading ? 'Deploying Enterprise...' : 'Deploy Business'}
          </button>
        </form>
      </div>
    </div>
  );
}
