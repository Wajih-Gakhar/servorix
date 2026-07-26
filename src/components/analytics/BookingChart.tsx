'use client'

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'

interface DataPoint { date: string; label: string; total: number; completed: number }

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: 'rgba(10, 16, 28, 0.97)',
            border: '1px solid rgba(61,214,245,0.2)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            fontSize: '0.82rem',
            minWidth: '150px',
        }}>
            <p style={{ margin: '0 0 0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
            {payload.map((e: any) => (
                <div key={e.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.2rem' }}>
                    <span style={{ color: e.color, fontWeight: 500 }}>{e.dataKey === 'total' ? 'All Bookings' : 'Completed'}</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{e.value}</span>
                </div>
            ))}
        </div>
    )
}

export default function BookingChart({ data, loading }: { data: DataPoint[]; loading?: boolean }) {
    if (loading) {
        return <div style={{ height: 280, background: 'rgba(255,255,255,0.03)', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
    }
    if (!data.length) {
        return <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.85rem' }}>No booking data for this period</div>
    }

    const max = Math.max(...data.map(d => d.total), 1)
    const step = Math.ceil(max / 4 / 5) * 5 || 1

    return (
        <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3dd6f5" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#3dd6f5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} width={32} ticks={[0, step, step * 2, step * 3, step * 4]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(61,214,245,0.15)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="total" stroke="#3dd6f5" strokeWidth={2.5} fill="url(#gTotal)"
                        dot={{ r: 4, fill: '#3dd6f5', stroke: '#0a101c', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#3dd6f5', stroke: '#0a101c', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="completed" stroke="#818cf8" strokeWidth={2} fill="url(#gCompleted)"
                        dot={{ r: 3, fill: '#818cf8', stroke: '#0a101c', strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: '#818cf8', stroke: '#0a101c', strokeWidth: 2 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
