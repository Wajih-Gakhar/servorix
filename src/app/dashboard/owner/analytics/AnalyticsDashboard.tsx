'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import AnalyticsCard from '@/components/analytics/AnalyticsCard'
import { getBookingTrends, getRevenueTrends } from '@/app/actions/analyticsActions'

const BookingChart = dynamic(() => import('@/components/analytics/BookingChart'), { ssr: false })
const RevenueChart = dynamic(() => import('@/components/analytics/RevenueChart'), { ssr: false })
const ServiceChart = dynamic(() => import('@/components/analytics/ServiceChart'), { ssr: false })

interface OverviewData {
    totalBookings: number
    completedBookings: number
    totalRevenue: number
    totalCustomers: number
    avgRating: number
}

interface Props {
    overview: OverviewData
    initialBookings: any[]
    initialRevenue: any[]
    services: any[]
}

const RANGES = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
]

const CHART_BG = {
    background: 'linear-gradient(145deg, rgba(13,21,32,0.95), rgba(10,16,26,0.98))',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.5rem',
}

export default function AnalyticsDashboard({ overview, initialBookings, initialRevenue, services }: Props) {
    const [days, setDays] = useState(7)
    const [bookingData, setBookingData] = useState(initialBookings)
    const [revenueData, setRevenueData] = useState(initialRevenue)
    const [loading, setLoading] = useState(false)

    const handleRangeChange = useCallback(async (d: number) => {
        if (d === days) return
        setDays(d)
        setLoading(true)
        const [bRes, rRes] = await Promise.all([getBookingTrends(d), getRevenueTrends(d)])
        if (bRes.data) setBookingData(bRes.data)
        if (rRes.data) setRevenueData(rRes.data)
        setLoading(false)
    }, [days])

    const completionRate = overview.totalBookings > 0
        ? Math.round((overview.completedBookings / overview.totalBookings) * 100)
        : 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* ── KPI Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <AnalyticsCard title="Total Bookings" value={overview.totalBookings} icon="📅"
                    subtitle={`${overview.completedBookings} completed`} color="#3dd6f5" />
                <AnalyticsCard title="Total Revenue" value={`Rs ${overview.totalRevenue.toFixed(2)}`} icon="💰"
                    subtitle="Your earnings (net)" color="#22c55e" />
                <AnalyticsCard title="Total Customers" value={overview.totalCustomers} icon="👥"
                    subtitle="Unique visitors" color="#818cf8" />
                <AnalyticsCard title="Completion Rate" value={`${completionRate}%`} icon="✅"
                    subtitle="Of all bookings" color="#f59e0b" />
                <AnalyticsCard title="Avg. Rating" value={`${overview.avgRating} / 5`} icon="⭐"
                    subtitle="Customer satisfaction" color="#ec4899" />
            </div>

            {/* ── Time Range Toggle ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500, marginRight: '0.5rem' }}>Period:</span>
                {RANGES.map(r => (
                    <button key={r.value} onClick={() => handleRangeChange(r.value)}
                        style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: '1px solid',
                            transition: 'all 0.2s',
                            background: days === r.value ? '#3dd6f5' : 'transparent',
                            color: days === r.value ? '#0a101c' : '#64748b',
                            borderColor: days === r.value ? '#3dd6f5' : 'rgba(255,255,255,0.1)',
                        }}>
                        {r.label}
                    </button>
                ))}
                {loading && <span style={{ fontSize: '0.78rem', color: '#3dd6f5', marginLeft: '0.5rem', animation: 'pulse 1s infinite' }}>Updating...</span>}
            </div>

            {/* ── Booking + Revenue Charts ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                <div style={CHART_BG}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Booking Trends</h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#475569' }}>All vs Completed</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {[{ c: '#3dd6f5', l: 'All' }, { c: '#818cf8', l: 'Completed' }].map(s => (
                                    <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <div style={{ width: 20, height: 2.5, background: s.c, borderRadius: 2 }} />
                                        <span style={{ fontSize: '0.72rem', color: s.c, fontWeight: 600 }}>{s.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <BookingChart data={bookingData} loading={loading} />
                </div>

                <div style={CHART_BG}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Revenue Trends</h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#475569' }}>Gross vs Your Earnings</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {[{ c: '#22c55e', l: 'Gross' }, { c: '#f59e0b', l: 'Net' }].map(s => (
                                    <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <div style={{ width: 20, height: 2.5, background: s.c, borderRadius: 2 }} />
                                        <span style={{ fontSize: '0.72rem', color: s.c, fontWeight: 600 }}>{s.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <RevenueChart data={revenueData} loading={loading} />
                </div>
            </div>

            {/* ── Service Breakdown ── */}
            {services.length > 0 && (
                <div style={CHART_BG}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Bookings by Service</h3>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#475569' }}>Most popular services</p>
                    </div>
                    <ServiceChart data={services} />
                </div>
            )}

        </div>
    )
}
