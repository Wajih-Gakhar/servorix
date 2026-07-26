import OwnerBookings from '../OwnerBookings'

export default async function OwnerBookingsPage() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>📅 Manage Bookings</h1>
      <div className="card" style={{ padding: '2rem' }}>
        <OwnerBookings />
      </div>
    </div>
  )
}
