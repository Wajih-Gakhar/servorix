import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminBusinessList from './AdminBusinessList'
import AdminReportsList from '@/components/admin/AdminReportsList'
import Link from 'next/link'
import { StaggerContainer, StaggerItem, AnimatedSection } from '@/components/AnimatedStagger'
import { getAdminReports } from '@/app/actions/matrixActions'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const activeTab = params.tab || 'businesses'

  const allBusinesses = await prisma.business.findMany({
    orderBy: { createdAt: 'desc' },
    include: { owner: { select: { name: true, email: true } } }
  })

  // Fetch reports if on reports tab or for summary
  const reportsData = await getAdminReports(undefined, 1)
  const reportsList = reportsData?.success ? reportsData.reports : []
  
  const reports = (reportsList || []).map((r: any) => ({
      ...r,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
  }))

  // Basic analytics
  const totalUsers = await prisma.user.count()
  const totalBookings = await prisma.appointment.count()
  const openReportsCount = reports.filter((r: any) => r.status === 'OPEN').length

  return (
    <StaggerContainer style={{ display: 'grid', gap: '3rem' }}>
      <StaggerItem directional="up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                  <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '-1px', fontWeight: 900 }}>🛡️ Admin Dashboard</h1>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Global telemetry and operational control across the platform.</p>
              </div>
              <div style={{ background: 'rgba(0,180,216,0.1)', padding: '0.6rem 1.2rem', borderRadius: '50px', border: '1px solid rgba(0,180,216,0.3)', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 15px var(--color-primary)', animation: 'pulse 2s infinite' }}></span>
                  System Online
              </div>
          </div>
      </StaggerItem>
      
      <StaggerItem directional="up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', fontSize: '140px', opacity: 0.03, filter: 'grayscale(100%)' }}>👥</div>
          <div>
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 900 }}>Total Users</p>
              <h2 style={{ fontSize: '4rem', margin: 0, color: 'var(--color-primary)', lineHeight: 1, fontWeight: 900 }}>{totalUsers}</h2>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', fontSize: '140px', opacity: 0.03, filter: 'grayscale(100%)' }}>📅</div>
          <div>
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 900 }}>Total Bookings</p>
              <h2 style={{ fontSize: '4rem', margin: 0, color: 'var(--color-success)', lineHeight: 1, fontWeight: 900 }}>{totalBookings}</h2>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', fontSize: '140px', opacity: 0.03, filter: 'grayscale(100%)' }}>🏢</div>
          <div>
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 900 }}>Pending Businesses</p>
              <h2 style={{ fontSize: '4rem', margin: 0, color: 'var(--color-warning)', lineHeight: 1, fontWeight: 900 }}>{allBusinesses.filter((b: any) => b.status === 'PENDING').length}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', fontSize: '140px', opacity: 0.03, filter: 'grayscale(100%)' }}>🛡️</div>
          <div>
              <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 900 }}>Active Reports</p>
              <h2 style={{ fontSize: '4rem', margin: 0, color: 'var(--color-error)', lineHeight: 1, fontWeight: 900 }}>{openReportsCount}</h2>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem directional="up">
        <div className="glass-card shadow-glow" style={{ borderTop: '3px solid var(--color-primary)' }}>
            {/* TABS HEADER */}
            <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', background: 'rgba(0,0,0,0.2)' }}>
                <Link 
                    href="/dashboard/admin?tab=businesses" 
                    style={{ 
                        padding: '1.5rem 2.5rem', 
                        color: activeTab === 'businesses' ? 'var(--color-primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'businesses' ? '2px solid var(--color-primary)' : 'none',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        background: activeTab === 'businesses' ? 'rgba(0,180,216,0.05)' : 'transparent'
                    }}
                >
                    🏢 Businesses
                </Link>
                <Link 
                    href="/dashboard/admin?tab=reports" 
                    style={{ 
                        padding: '1.5rem 2.5rem', 
                        color: activeTab === 'reports' ? 'var(--color-error)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'reports' ? '2px solid var(--color-error)' : 'none',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        background: activeTab === 'reports' ? 'rgba(239,68,68,0.05)' : 'transparent'
                    }}
                >
                    🛡️ Reports
                </Link>
            </div>

            {/* TAB CONTENT */}
            <div style={{ padding: '2.5rem' }}>
                {activeTab === 'businesses' ? (
                    <>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Business Registry</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px' }}>Manage and approve all business deployments across the platform.</p>
                        <AdminBusinessList businesses={allBusinesses} />
                    </>
                ) : (
                    <>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Enforcement Registry</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px' }}>Review user complaints, manage performance incidents, and enforce platform safety violations.</p>
                        <AdminReportsList reports={reports} />
                    </>
                )}
            </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}
