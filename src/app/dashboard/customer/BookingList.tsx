'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatus } from '@/app/actions/booking'

export default function BookingList({ bookings }: { bookings: any[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleCancel = async (id: string) => {
    setLoadingId(id)
    await updateBookingStatus(id, 'CANCELLED')
    setLoadingId(null)
    router.refresh()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'badge-success'
      case 'PENDING': return 'badge-warning'
      case 'REJECTED': 
      case 'CANCELLED': return 'badge-error'
      default: return ''
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {bookings.map((b) => (
        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{b.service.name} at {b.business.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              📅 {new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at {b.startTime}
              <br />
              📍 {b.business.address}, {b.business.city}
              <br />
              💵 Rs {b.service.price} ({b.service.duration} mins)
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span>
            {(b.status === 'PENDING' || b.status === 'APPROVED') && (
              <button 
                onClick={() => handleCancel(b.id)} 
                className="btn btn-secondary" 
                style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                disabled={loadingId === b.id}
              >
                {loadingId === b.id ? 'Canceling...' : 'Cancel Appointment'}
              </button>
            )}
            {b.status === 'COMPLETED' && (
              <a href={`/businesses/${b.businessId}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Leave Review
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
