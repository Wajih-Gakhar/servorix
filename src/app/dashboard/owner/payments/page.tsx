import { getOwnerPayments } from '@/app/actions/paymentActions'

export default async function OwnerPaymentsPage() {
  const { payments, error } = await getOwnerPayments()

  if (error) {
    return <p style={{ color: 'var(--color-error)' }}>{error}</p>
  }
  
  if (!payments || payments.length === 0) {
     return (
       <div>
         <h1 style={{ marginBottom: '2rem' }}>Payments & Revenue</h1>
         <p style={{ color: 'var(--text-secondary)' }}>No payments recorded yet.</p>
       </div>
     )
  }

  const totalRevenue = payments.reduce((acc, p) => acc + p.ownerAmount, 0)
  const platformFees = payments.reduce((acc, p) => acc + p.platformFee, 0)
  const pendingPayments = payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.ownerAmount, 0)

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Payments & Revenue</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--color-success)' }}>Rs {totalRevenue.toFixed(2)}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Net Revenue</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--color-warning)' }}>Rs {pendingPayments.toFixed(2)}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Pending Payments</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--color-error)' }}>Rs {platformFees.toFixed(2)}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Platform Fees Paid</p>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>Payment History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Gross Amount</th>
              <th style={{ padding: '1rem' }}>Fee</th>
              <th style={{ padding: '1rem' }}>Net Amount</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.id.substring(0, 8)}...</td>
                <td style={{ padding: '1rem' }}>{p.user?.name}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>Rs {p.amount.toFixed(2)}</td>
                <td style={{ padding: '1rem', color: 'var(--color-error)' }}>-Rs {p.platformFee.toFixed(2)}</td>
                <td style={{ padding: '1rem', color: 'var(--color-success)' }}>Rs {p.ownerAmount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--bg-base)', borderRadius: '4px' }}>
                        {p.paymentType}
                    </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${p.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
