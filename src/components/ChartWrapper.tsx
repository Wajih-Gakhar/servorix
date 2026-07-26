'use client'

import dynamic from 'next/dynamic'

const ClientChart = dynamic(() => import('./ClientChart'), { 
    ssr: false, 
    loading: () => (
        <div style={{ 
            height: '320px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--text-secondary)',
            background: 'linear-gradient(145deg, #0d1520, #0f1a2e)',
            borderRadius: '16px',
            fontSize: '0.85rem',
            letterSpacing: '0.05em'
        }}>
            Rendering Analytics...
        </div>
    )
})

export default function ChartWrapper({ data }: { data: { label: string; bookings: number; revenue: number }[] }) {
    return <ClientChart data={data} />
}
