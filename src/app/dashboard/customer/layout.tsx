import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SmoothScroll from '@/components/SmoothScroll'
import { AnimatedSection } from '@/components/AnimatedStagger'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== 'CUSTOMER') {
    redirect('/login')
  }

  return (
    <SmoothScroll>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, zIndex: -1, pointerEvents: 'none' }}>
        <img src="/servorixIconAnimated.svg" alt="" width="800" height="800" />
      </div>
      <div style={{ paddingTop: '6rem', paddingBottom: '2.5rem', maxWidth: '1400px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, auto) 1fr', gap: '2rem', alignItems: 'start' }}>
          <AnimatedSection directional="left" className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'sticky', top: '6rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-primary)' }}>Customer Menu</h2>
            <Link href="/dashboard/customer" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
              Dashboard
            </Link>
            <Link href="/dashboard/customer/profile" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              My Profile
            </Link>
            <Link href="/dashboard/customer/bookings" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              My Bookings
            </Link>
            <Link href="/dashboard/customer/ai" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.1)' }}>
              <span>🤖</span>
              Servorix AI
            </Link>
            <Link href="/messages" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Messages
            </Link>
            <Link href="/dashboard/customer/notifications" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              Notifications
            </Link>
          </AnimatedSection>
          <AnimatedSection directional="up" style={{ minWidth: 0 }}>
            {children}
          </AnimatedSection>
        </div>
      </div>
    </SmoothScroll>
  )
}
