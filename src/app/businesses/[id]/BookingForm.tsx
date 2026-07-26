'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBooking, getAvailableSlots } from '@/app/actions/booking'
import { io } from 'socket.io-client'

export default function BookingForm({ business, session }: { business: any, session: any }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<{ time: string, isBooked: boolean }[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedTime, setSelectedTime] = useState('')
  const [paymentType, setPaymentType] = useState('FULL')

  useEffect(() => {
     // Join business broadcast room
     const socket = io(window.location.origin)
     socket.emit('join', `business_${business.id}`)
     
     socket.on('notification', (payload) => {
         if (payload.type === 'SLOT_BOOKED') {
             // If someone else booked a slot for the natively selected date, visually disable it instantly
             setAvailableSlots(prev => prev.map(s => {
                 if (s.time === payload.startTime && payload.date === selectedDate) { // ensure date matches
                     return { ...s, isBooked: true }
                 }
                 return s
             }))
         }
     })

     return () => {
         socket.disconnect()
     }
  }, [business.id, selectedDate])

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedService || !selectedDate) {
         setAvailableSlots([])
         return
      }
      setLoadingSlots(true)
      const res = await getAvailableSlots(business.id, selectedService, selectedDate)
      if (res.success) {
        setAvailableSlots(res.slots || [])
      } else {
        setAvailableSlots([])
      }
      setLoadingSlots(false)
    }

    fetchSlots()
  }, [selectedService, selectedDate, business.id])

  if (!session) {
    return <p>Please <a href="/login" style={{ color: 'var(--color-accent)' }}>log in</a> to book an appointment.</p>
  }

  if (session.role === 'ADMIN' || session.role === 'OWNER') {
    return <p>Only customers can book appointments.</p>
  }

  if (business.services.length === 0) {
    return <p>This business has no services available yet.</p>
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('businessId', business.id)

    if (!selectedTime) {
      setError('Please select an available time slot.')
      setLoading(false)
      return
    }
    formData.append('startTime', selectedTime)

    const res = await createBooking(formData)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess('Appointment booked successfully! Waiting for owner approval.')
      form.reset()
    }
    setLoading(false)
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value)
    setSelectedTime('') // reset time on service change
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    setSelectedTime('') // reset time on date change
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="badge badge-error" style={{ marginBottom: '1rem', display: 'block' }}>{error}</div>}
      {success && <div className="badge badge-success" style={{ marginBottom: '1rem', display: 'block' }}>{success}</div>}

      <div className="form-group">
        <label className="form-label">Select Service</label>
        <select name="serviceId" required className="form-input" style={{ width: '100%' }} value={selectedService} onChange={handleServiceChange}>
          <option value="">-- Choose a service --</option>
          {business.services.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name} - Rs {s.price} ({s.duration} mins)</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Date</label>
        <input type="date" name="date" required className="form-input" min={new Date().toISOString().split('T')[0]} value={selectedDate} onChange={handleDateChange} />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ marginBottom: '0.5rem' }}>Available Time Slots</label>
        {(!selectedService || !selectedDate) ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select a service and date to view slots.</p>
        ) : loadingSlots ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading slots...</p>
        ) : availableSlots.length === 0 ? (
          <p style={{ color: 'var(--color-error)', fontSize: '0.9rem' }}>No slots available for this day. Try another date.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {availableSlots.map(slot => (
               <button
                 key={slot.time}
                 type="button"
                 disabled={slot.isBooked}
                 onClick={() => setSelectedTime(slot.time)}
                 style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedTime === slot.time ? 'var(--color-primary)' : (slot.isBooked ? 'var(--bg-card)' : 'transparent'),
                    color: selectedTime === slot.time ? '#fff' : (slot.isBooked ? 'var(--text-secondary)' : 'var(--color-primary)'),
                    cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                    opacity: slot.isBooked ? 0.6 : 1
                 }}
               >
                 {slot.isBooked ? `${slot.time} - Booked` : slot.time}
               </button>
            ))}
          </div>
        )}
      </div>

      <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
         <label className="form-label">Payment Type</label>
         <select name="paymentType" className="form-input" style={{ width: '100%', marginBottom: '1rem' }} required value={paymentType} onChange={e => setPaymentType(e.target.value)}>
            <option value="FULL">Pay Full Amount Now</option>
            <option value="DEPOSIT">Pay 20% Deposit (Pay rest at venue)</option>
            <option value="PAY_ON_VISIT">Pay On Visit (Cash at venue)</option>
         </select>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <input type="checkbox" name="usePoints" id="usePoints" />
             <label htmlFor="usePoints" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>Redeem 50 Points for Rs 500 off</label>
         </div>

         {paymentType !== 'PAY_ON_VISIT' && (
           <>
             <label className="form-label">Payment Gateway</label>
             <select name="paymentMethod" className="form-input" style={{ width: '100%', marginBottom: '1rem' }} required>
                <option value="CARD">Credit/Debit Card</option>
                <option value="JAZZCASH">JazzCash</option>
                <option value="EASYPAISA">Easypaisa</option>
             </select>
             <label className="form-label">Account/Card Details (Simulation)</label>
             <input type="text" placeholder="Enter details..." className="form-input" required />
           </>
         )}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'Processing...' : 'Request Appointment'}
      </button>
    </form>
  )
}
