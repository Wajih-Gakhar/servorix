'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBusiness } from '@/app/actions/business';
import { Building, Tag, MapPin, Phone, Clock, FileText, Rocket, AlertCircle } from 'lucide-react';

export default function CreateBusinessForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createBusiness(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && (
        <div
          className="badge badge-error"
          style={{
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
          placeholder="e.g. Elite Gym Center"
          style={{ width: '100%' }}
        />
      </div>

      {/* Type & Category */}
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
            Sector Type
          </label>
          <select name="type" className="form-input" defaultValue="SALON" style={{ width: '100%' }}>
            <option value="SALON">Beauty &amp; Barbershop</option>
            <option value="GYM">Gym &amp; Fitness Center</option>
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
          <select name="category" className="form-input" defaultValue="Barbershop" style={{ width: '100%' }}>
            <option value="Barbershop">Barbershop</option>
            <option value="Hair Salon">Hair Salon</option>
            <option value="Spa">Spa</option>
            <option value="Gym">Gym</option>
            <option value="Fitness Studio">Fitness Studio</option>
            <option value="Personal Training">Personal Training</option>
          </select>
        </div>
      </div>

      {/* Address & City */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
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
            Street Address
          </label>
          <input
            type="text"
            name="address"
            required
            className="form-input"
            placeholder="123 Main St"
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
            <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
            City
          </label>
          <input
            type="text"
            name="city"
            required
            className="form-input"
            placeholder="New York"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Phone */}
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
          required
          className="form-input"
          placeholder="(555) 123-4567"
          style={{ width: '100%' }}
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
            className="form-input"
            defaultValue="09:00"
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
            className="form-input"
            defaultValue="20:00"
            style={{ width: '100%' }}
          />
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
        <textarea name="description" className="form-input" rows={3} style={{ width: '100%' }}></textarea>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ alignSelf: 'flex-start', marginTop: '0.5rem', gap: '0.5rem' }}
      >
        <Rocket size={16} />
        {loading ? 'Registering...' : 'Register Business'}
      </button>
    </form>
  );
}
