import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAdminReports } from '@/app/actions/matrixActions'
import ReportPanel from './ReportPanel'

export default async function AdminReportsPage() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        redirect('/login')
    }

    const res = await getAdminReports()
    const reports = res.reports || []

    return (
        <div className="animate-fade-in-up">
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '-1px' }}>Enforcement Registry</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Manage incident reports and maintain platform integrity.</p>
            </div>

            <ReportPanel initialReports={reports || []} />
        </div>
    )
}
