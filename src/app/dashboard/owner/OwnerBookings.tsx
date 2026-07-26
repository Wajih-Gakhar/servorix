'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getOwnerBookings, updateBookingStatus } from '@/app/actions/booking'

export default function OwnerBookings({ activeBusinessId }: { activeBusinessId?: string }) {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getOwnerBookings()
      if (res.success) {
        setBookings(res.bookings || [])
      }
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const handleStatusChange = async (id: string, status: any) => {
    await updateBookingStatus(id, status)
    
    // Update local state to immediately show change
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    router.refresh()
  }

  if (loading) return <p>Loading bookings...</p>

  if (bookings.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No bookings received yet.</p>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'badge-success'
      case 'COMPLETED': return 'badge-success'
      case 'PENDING': return 'badge-warning'
      case 'REJECTED': 
      case 'CANCELLED': return 'badge-error'
      default: return ''
    }
  }

  const filteredBookings = activeBusinessId ? bookings.filter(b => b.businessId === activeBusinessId) : bookings

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {filteredBookings.map((b) => (
        <div key={b.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0 }}>{b.service.name}</h4>
            <span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            📅 {new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at {b.startTime}
            <br />
            👤 {b.customer.name} ({b.customer.email})
            <br />
            📞 {b.customer.phone || 'No phone'}
          </p>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            {b.status === 'PENDING' && (
              <>
                <button onClick={() => handleStatusChange(b.id, 'APPROVED')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Approve</button>
                <button onClick={() => handleStatusChange(b.id, 'REJECTED')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>Reject</button>
              </>
            )}
            {b.status === 'APPROVED' && (
              <button onClick={() => handleStatusChange(b.id, 'COMPLETED')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Mark Completed</button>
            )}
            {(b.status === 'APPROVED' || b.status === 'PENDING') && (
              <button onClick={() => handleStatusChange(b.id, 'CANCELLED')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
