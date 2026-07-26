'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createService, deleteService } from '@/app/actions/service'

export default function ServiceManagement({ businessId, services, disabled }: { businessId: string, services: any[], disabled: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    await createService(businessId, formData)

    form.reset()
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteService(id)
    setDeletingId(null)
    router.refresh()
  }

  if (disabled) {
    return <p style={{ color: 'var(--text-secondary)' }}>You can manage services once your business is approved.</p>
  }

  return (
    <div>
      <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.2fr 1fr auto', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>Service Name</label>
          <input type="text" name="name" required className="form-input" placeholder="e.g. Haircut" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>Price (Rs)</label>
          <input type="number" name="price" required className="form-input" step="0.01" min="0" placeholder="0.00" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>Mins</label>
          <input type="number" name="duration" required className="form-input" min="5" step="5" placeholder="30" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '+' : 'Add'}
        </button>
      </form>

      {services.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No services added yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {services.map((s) => (
            <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong>{s.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>({s.duration}m)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Rs {s.price}</span>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                >
                  {deletingId === s.id ? '...' : '✕'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
