'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendPaymentReminder } from '@/app/actions/paymentActions'
import { updateBusinessStatus } from '@/app/actions/adminActions'

type BusinessData = {
  id: string
  name: string
  ownerId: string
  status: string
}

export default function AdminPaymentActions({ businesses }: { businesses: BusinessData[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleReminder = async (id: string) => {
    setLoadingId(`remind-${id}`)
    await sendPaymentReminder(id)
    setLoadingId(null)
    alert('Reminder sent!')
    router.refresh()
  }

  const handleSuspend = async (id: string) => {
    if (!confirm('Are you sure you want to suspend this business?')) return
    setLoadingId(`suspend-${id}`)
    await updateBusinessStatus(id, 'SUSPENDED')
    setLoadingId(null)
    router.refresh()
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {businesses.map((b) => (
        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{b.name}</h3>
            <span className={`badge ${b.status === 'SUSPENDED' ? 'badge-error' : 'badge-success'}`}>{b.status}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => handleReminder(b.id)} 
              disabled={loadingId === `remind-${b.id}`}
              className="btn btn-primary"
            >
              Send Reminder
            </button>
            {b.status !== 'SUSPENDED' && (
              <button 
                onClick={() => handleSuspend(b.id)} 
                disabled={loadingId === `suspend-${b.id}`}
                className="btn btn-secondary"
                style={{ color: 'var(--color-error)' }}
              >
                Suspend
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
