import { getCustomerBookings } from '@/app/actions/booking'
import BookingList from '../BookingList'

export default async function CustomerBookingsPage() {
  const res = await getCustomerBookings()
  const bookings = res.bookings || []

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>🎟️ My Bookings</h1>
      
      <div className="card" style={{ padding: '2rem' }}>
        
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any appointments yet.</p>
        ) : (
          <BookingList bookings={bookings} />
        )}
      </div>
    </div>
  )
}
