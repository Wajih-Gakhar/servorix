'use client'

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts'

interface DataPoint { date: string; label: string; gross: number; net: number }

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: 'rgba(10, 16, 28, 0.97)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            fontSize: '0.82rem',
            minWidth: '150px',
        }}>
            <p style={{ margin: '0 0 0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
            {payload.map((e: any) => (
                <div key={e.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.2rem' }}>
                    <span style={{ color: e.color, fontWeight: 500 }}>{e.dataKey === 'gross' ? 'Gross Revenue' : 'Your Earnings'}</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 700 }}>Rs {e.value.toFixed(2)}</span>
                </div>
            ))}
        </div>
    )
}

export default function RevenueChart({ data, loading }: { data: DataPoint[]; loading?: boolean }) {
    if (loading) {
        return <div style={{ height: 280, background: 'rgba(255,255,255,0.03)', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
    }
    if (!data.length) {
        return <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.85rem' }}>No revenue data for this period</div>
    }

    const max = Math.max(...data.map(d => d.gross), 1)
    const step = Math.ceil(max / 4 / 10) * 10 || 1

    return (
        <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gGross" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} width={40}
                        ticks={[0, step, step * 2, step * 3, step * 4]}
                        tickFormatter={v => `Rs ${v}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(34,197,94,0.15)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="gross" stroke="#22c55e" strokeWidth={2.5} fill="url(#gGross)"
                        dot={{ r: 4, fill: '#22c55e', stroke: '#0a101c', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#22c55e', stroke: '#0a101c', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="net" stroke="#f59e0b" strokeWidth={2} fill="url(#gNet)"
                        dot={{ r: 3, fill: '#f59e0b', stroke: '#0a101c', strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: '#f59e0b', stroke: '#0a101c', strokeWidth: 2 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
