'use client'

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts'

interface DataPoint { name: string; count: number }

const COLORS = ['#3dd6f5', '#818cf8', '#22c55e', '#f59e0b', '#f97316', '#ec4899', '#a78bfa', '#06b6d4']

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: 'rgba(10, 16, 28, 0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '0.6rem 1rem',
            fontSize: '0.82rem',
        }}>
            <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{payload[0].value} bookings</span>
        </div>
    )
}

export default function ServiceChart({ data, loading }: { data: DataPoint[]; loading?: boolean }) {
    if (loading) {
        return <div style={{ height: 240, background: 'rgba(255,255,255,0.03)', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
    }
    if (!data.length) {
        return <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.85rem' }}>No service data yet</div>
    }

    return (
        <div style={{ width: '100%', height: Math.max(data.length * 44, 220) }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={false} vertical stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }} width={110} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
