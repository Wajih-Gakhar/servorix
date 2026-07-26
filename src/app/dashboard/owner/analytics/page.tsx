import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
    getAnalyticsOverview,
    getBookingTrends,
    getRevenueTrends,
    getServiceBookings,
} from '@/app/actions/analyticsActions'
import AnalyticsDashboard from './AnalyticsDashboard'

export const metadata = {
    title: 'Analytics | Owner Dashboard',
    description: 'View your business performance, booking trends and revenue insights.',
}

export default async function AnalyticsPage() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') redirect('/login')

    const [overviewRes, bookingsRes, revenueRes, servicesRes] = await Promise.all([
        getAnalyticsOverview(),
        getBookingTrends(7),
        getRevenueTrends(7),
        getServiceBookings(),
    ])

    if ('error' in overviewRes && overviewRes.error) {
        return <p style={{ color: 'var(--color-error)' }}>{overviewRes.error}</p>
    }

    if (!overviewRes.data) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No data yet</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Register a business and start accepting bookings to see your analytics.</p>
            </div>
        )
    }

    return (
        <div>
            {/* ── Header ── */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>📈 Analytics</h1>
                <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Track your business performance and growth metrics.
                </p>
            </div>

            <AnalyticsDashboard
                overview={overviewRes.data}
                initialBookings={bookingsRes.data ?? []}
                initialRevenue={revenueRes.data ?? []}
                services={servicesRes.data ?? []}
            />
        </div>
    )
}
