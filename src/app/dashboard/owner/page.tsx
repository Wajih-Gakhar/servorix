import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrCreateConversation } from '@/app/actions/matrixActions'
import OwnerBookings from './OwnerBookings'
import ServiceManagement from './ServiceManagement'
import CreateBusinessForm from './CreateBusinessForm'
import WorkingHoursManager from './WorkingHoursManager'
import BusinessSwitcher from './BusinessSwitcher'
import ClosureRequestButton from './ClosureRequestButton'

export default async function OwnerDashboard({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
  const { businessId } = await searchParams
  const session = await getSession()
  if (!session || session.role !== 'OWNER') {
    redirect('/login')
  }

  // Fetch ALL owner's businesses
  const allBusinesses = await prisma.business.findMany({
    where: { ownerId: session.userId, status: { not: 'DELETED' } },
    include: { services: true }
  })

  // Determine active business
  let business = allBusinesses.find(b => b.id === businessId)
  if (!business && allBusinesses.length > 0) {
      business = allBusinesses[0]
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>🏪 Business Dashboard</h1>

      {!business ? (
        <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h2>Register Your Business</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Before you can start receiving bookings, please register your salon or gym.
          </p>
          <CreateBusinessForm />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h2 style={{ margin: 0 }}>{business.name}</h2>
                  {allBusinesses.length > 1 && (
                      <BusinessSwitcher businesses={allBusinesses.map(b => ({ id: b.id, name: b.name }))} activeId={business.id} />
                  )}
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Status: <span className={`badge ${business.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>{business.status}</span>
              </p>
            </div>
            {business.status === 'PENDING' && (
              <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Waiting for Administrator approval.
              </div>
            )}
            <div style={{ marginLeft: '1rem' }}>
                <ClosureRequestButton businessId={business.id} currentStatus={business.status} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '2rem', alignItems: 'start' }}>
            {/* Services Management */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Manage Services</h3>
              <ServiceManagement businessId={business.id} services={business.services} disabled={business.status !== 'APPROVED'} />
            </div>

            {/* Bookings Management & Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>Messages</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Communicate with your customers and handle reports.</p>
                  <Link href="/messages" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                    Open Message Center
                  </Link>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>Recent Bookings</h3>
                  <OwnerBookings activeBusinessId={business.id} />
                </div>
                
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>Manage Working Hours</h3>
                  <WorkingHoursManager 
                      businessId={business.id} 
                      defaultOpen={business.openingTime} 
                      defaultClose={business.closingTime} 
                  />
                </div>
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>Support & Administrative</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Need help? Message our support team directly for assistance with your account or business.</p>
                  
                  <form action={async () => {
                    'use server'
                    const res = await getOrCreateConversation('OWNER_ADMIN', [session.userId]);
                    if (res.success && res.conversation) {
                      redirect(`/messages/${res.conversation.id}`);
                    }
                  }}>
                    <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                      🛡️ Chat with Admin
                    </button>
                  </form>
                </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
