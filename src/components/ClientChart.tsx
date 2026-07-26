'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from 'recharts'

interface ChartDataPoint {
    label: string
    bookings: number
    revenue: number
}

// Custom dot — filled circle, styled per series
const BookingDot = (props: any) => {
    const { cx, cy, r } = props
    return <circle cx={cx} cy={cy} r={r + 3} fill="#3dd6f5" stroke="#0f1a2e" strokeWidth={2} />
}

const RevenueDot = (props: any) => {
    const { cx, cy, r } = props
    return <circle cx={cx} cy={cy} r={r + 3} fill="#6b7280" stroke="#0f1a2e" strokeWidth={2} />
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: 'rgba(15, 22, 40, 0.95)',
            border: '1px solid rgba(61, 214, 245, 0.2)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            fontSize: '0.8rem',
            minWidth: '130px',
        }}>
            <p style={{ margin: '0 0 0.5rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.25rem' }}>
                    <span style={{ color: entry.stroke, fontWeight: 500 }}>{entry.dataKey === 'bookings' ? 'Bookings' : 'Revenue'}</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 700 }}>
                        {entry.dataKey === 'revenue' ? `Rs ${entry.value}` : entry.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function ClientChart({ data }: { data: ChartDataPoint[] }) {
    const allValues = data.flatMap(d => [d.bookings, d.revenue])
    const maxVal = Math.max(...allValues, 1)
    // Create clean Y-axis ticks: 0, 1/3 max, 2/3 max, max — rounded
    const step = Math.ceil(maxVal / 3 / 10) * 10 || 1
    const ticks = [0, step, step * 2, step * 3]

    return (
        <div style={{
            background: 'linear-gradient(145deg, #0d1520, #0f1a2e)',
            borderRadius: '16px',
            padding: '1.5rem 1rem 1rem',
            width: '100%',
            height: '320px',
        }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                    {/* Horizontal grid lines only */}
                    <CartesianGrid
                        horizontal={true}
                        vertical={false}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="0"
                    />

                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}
                        dy={10}
                    />

                    <YAxis
                        ticks={ticks}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'inherit' }}
                        width={45}
                        dx={-4}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={false} />

                    {/* Bookings — cyan line */}
                    <Line
                        type="linear"
                        dataKey="bookings"
                        stroke="#3dd6f5"
                        strokeWidth={2.5}
                        dot={<BookingDot />}
                        activeDot={{ r: 7, fill: '#3dd6f5', stroke: '#0d1520', strokeWidth: 2 }}
                        isAnimationActive={true}
                        animationDuration={900}
                        animationEasing="ease-out"
                    />

                    {/* Revenue — gray line */}
                    <Line
                        type="linear"
                        dataKey="revenue"
                        stroke="#6b7280"
                        strokeWidth={2.5}
                        dot={<RevenueDot />}
                        activeDot={{ r: 7, fill: '#9ca3af', stroke: '#0d1520', strokeWidth: 2 }}
                        isAnimationActive={true}
                        animationDuration={1100}
                        animationEasing="ease-out"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
