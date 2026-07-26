import { getCustomerBookings } from '@/app/actions/booking'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CustomerDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'CUSTOMER') {
    redirect('/login')
  }

  const res = await getCustomerBookings()
  const bookings = res.bookings || []

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>🏠 My Dashboard</h1>
      
      <div className="card" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Select a section from the side menu to view your bookings and notifications.</p>
      </div>
        
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>My Rewards</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>View the loyalty points you've accumulated and redeem discounts.</p>
            <Link href="/dashboard/customer/rewards" className="btn btn-secondary" style={{ width: '100%' }}>
            View Points
            </Link>
        </div>

        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Messages</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>View your conversations with business owners and support.</p>
            <Link href="/messages" className="btn btn-primary" style={{ width: '100%' }}>
            Open Chat
            </Link>
        </div>
      </div>
    </div>
  )
}
