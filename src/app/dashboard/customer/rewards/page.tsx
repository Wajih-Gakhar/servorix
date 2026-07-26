import { getCustomerLoyaltyPoints } from '@/app/actions/loyaltyActions'

export default async function RewardsPage() {
    const { totalPoints, history, error } = await getCustomerLoyaltyPoints()

    if (error) {
        return <p style={{ color: 'var(--color-error)' }}>{error}</p>
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>🏆 My Loyalty Rewards</h1>

            <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', color: '#fff' }}>
                <h2 style={{ fontSize: '1.5rem', opacity: 0.9, margin: 0 }}>Total Available Points</h2>
                <div style={{ fontSize: '5rem', fontWeight: 'bold', margin: '1rem 0' }}>{totalPoints || 0}</div>
                <p style={{ opacity: 0.8 }}>Use 50 points to get Rs 500 off your next booking!</p>
            </div>

            <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Points History</h2>
                {(!history || history.length === 0) ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No points earned yet. Complete a booking to start earning!</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {history.map((record: any) => (
                            <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{record.points > 0 ? 'Points Earned' : 'Points Redeemed'}</h3>
                                    <p style={{ margin: 0, marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {new Date(record.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: record.points > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                                    {record.points > 0 ? '+' : ''}{record.points}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
