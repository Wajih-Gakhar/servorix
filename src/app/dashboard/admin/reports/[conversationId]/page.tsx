import { getSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { getAdminReportById } from '@/app/actions/matrixActions'
import Link from 'next/link'
import ReportChatView from '@/components/admin/ReportChatView'
import StatusBadge from '@/components/admin/StatusBadge'
import AdminReportActions from '@/components/admin/AdminReportActions'
import { AnimatedSection } from '@/components/AnimatedStagger'

export default async function AdminReportDetailPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const res = await getAdminReportById(conversationId)
  if (res.error || !res.report) {
    notFound()
  }

  const report = res.report as any

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <AnimatedSection directional="left" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link 
            href="/dashboard/admin?tab=reports" 
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            ← Back to Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Report Case: {report.business?.name || 'Standard Incident'}</h1>
              <StatusBadge status={report.reportStatus} />
          </div>
      </AnimatedSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', alignItems: 'start' }}>
        {/* CHAT INTERFACE */}
        <AnimatedSection directional="up" className="glass-card" style={{ height: '750px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,180,216,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Official Communication Log</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Secure administrative channel for incident enforcement.</p>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--color-success)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Audit Ready
                </div>
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <ReportChatView reportId={conversationId} initialMessages={report.messages || []} />
            </div>
        </AnimatedSection>

        {/* METADATA SIDEBAR */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
            <AnimatedSection directional="right" className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Protocol Info</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Reason</label>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{report.reportReason || 'GENERAL'}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            {report.reportDesc || 'No manual log found.'}
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            <AnimatedSection directional="right" delay={0.1} className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Subject Business</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{report.business?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        ID: <span style={{ fontFamily: 'monospace' }}>{report.businessId}</span>
                    </div>
                </div>
            </AnimatedSection>

            <AnimatedSection directional="right" delay={0.2} className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reporter Detail</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{report.reporter?.name || 'Anonymous User'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{report.reporter?.email}</div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Administrative Actions</h3>
                    <AdminReportActions reportId={conversationId} />
                </div>
            </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
