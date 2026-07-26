import Link from 'next/link'

export default function MessagesRoot() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)', borderStyle: 'dashed' }}>
            <div style={{ textAlign: 'center', opacity: 0.8, maxWidth: '400px', padding: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📡</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Active Streams</h3>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>You haven't initialized any communication channels yet. Find a business to start a secure conversation.</p>
                <Link href="/businesses" className="btn btn-primary" style={{ padding: '0.75rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
                     Find Businesses
                </Link>
            </div>
        </div>
    )
}
