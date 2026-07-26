'use client'

interface Props {
    title: string
    value: string | number
    subtitle?: string
    icon: string
    trend?: number // % change
    color?: string
    loading?: boolean
}

export default function AnalyticsCard({ title, value, subtitle, icon, trend, color = 'var(--color-primary)', loading }: Props) {
    if (loading) {
        return (
            <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
            }}>
                <div style={{ height: 14, width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: 36, width: '40%', background: 'rgba(255,255,255,0.08)', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: 12, width: '50%', background: 'rgba(255,255,255,0.04)', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
        )
    }

    const trendPositive = (trend ?? 0) >= 0

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
            boxShadow: 'var(--shadow-sm)',
        }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = color
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px -5px ${color}30`
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-color)'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'
            }}
        >
            {/* Extremely faint unified glow accent */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${color}20 0%, transparent 60%)`, borderRadius: '0 var(--radius-lg) 0 0', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
                <span style={{ fontSize: '1.25rem', lineHeight: 1, filter: `drop-shadow(0 0 8px ${color}40)` }}>{icon}</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
                {value}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {trend !== undefined && (
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: trendPositive ? 'var(--color-success)' : 'var(--color-error)',
                        background: trendPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-pill)',
                    }}>
                        {trendPositive ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
                {subtitle && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{subtitle}</span>
                )}
            </div>
        </div>
    )
}
