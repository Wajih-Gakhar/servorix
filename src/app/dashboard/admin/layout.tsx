import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SmoothScroll from '@/components/SmoothScroll'
import { AnimatedSection } from '@/components/AnimatedStagger'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <SmoothScroll>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, zIndex: -1, pointerEvents: 'none' }}>
        <img src="/servorixIconAnimated.svg" alt="" width="800" height="800" />
      </div>
      <div style={{ paddingTop: '6rem', paddingBottom: '2.5rem', maxWidth: '1400px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', alignItems: 'start' }}>
          <AnimatedSection directional="left" className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '6rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-primary)' }}>Admin Menu</h2>
            <Link href="/dashboard/admin" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
              Dashboard
            </Link>
            <Link href="/dashboard/admin/payments" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              Payments
            </Link>
            <Link href="/dashboard/admin/ai" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.1)' }}>
              <span>🤖</span>
              Servorix AI
            </Link>
            <Link href="/messages" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Messages
            </Link>
            <Link href="/dashboard/admin?tab=reports" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              Reports
            </Link>
            <Link href="/dashboard/admin/categories" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              Categories
            </Link>
            <Link href="/dashboard/admin/notifications" className="btn btn-secondary glass-card-bg" style={{ textAlign: 'left', width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
