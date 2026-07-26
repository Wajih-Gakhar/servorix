import { getAdminPayments } from '@/app/actions/paymentActions'
import AdminPaymentActions from './AdminPaymentActions'

export default async function AdminPaymentsPage() {
  const { payments, businesses, error } = await getAdminPayments()

  if (error) {
    return <p style={{ color: 'var(--color-error)' }}>{error}</p>
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>💳 Platform Payments & Fees</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Business Fee Management</h2>
        <AdminPaymentActions businesses={businesses || []} />
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem' }}>Recent Platform Payments</h2>
        {(!payments || payments.length === 0) ? (
          <p style={{ color: 'var(--text-secondary)' }}>No payments found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Business</th>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Gross Amount</th>
                <th style={{ padding: '1rem' }}>Fee</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.id.substring(0, 8)}...</td>
                  <td style={{ padding: '1rem' }}>{p.business.name}</td>
                  <td style={{ padding: '1rem' }}>{p.user.name}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>Rs {p.amount.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-success)' }}>Rs {p.platformFee.toFixed(2)}</td>
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
        )}
      </div>
    </div>
  )
}
