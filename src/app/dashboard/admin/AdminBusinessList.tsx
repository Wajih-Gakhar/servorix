'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBusinessStatus, softDeleteBusiness, restoreBusiness } from '@/app/actions/adminActions'

export default function AdminBusinessList({ businesses }: { businesses: any[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'DELETED') => {
    setLoadingId(id)
    await updateBusinessStatus(id, status)
    setLoadingId(null)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    setLoadingId(id)
    await softDeleteBusiness(id)
    setLoadingId(null)
    router.refresh()
  }

  const handleRestore = async (id: string) => {
    setLoadingId(id)
    await restoreBusiness(id)
    setLoadingId(null)
    router.refresh()
  }

  if (businesses.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No businesses registered yet.</p>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'badge-success'
      case 'PENDING': return 'badge-warning'
      case 'REJECTED': return 'badge-error'
      case 'SUSPENDED': return 'badge-warning'
      case 'DELETED': return 'badge-error'
      case 'CLOSURE_REQUESTED': return 'badge-error'
      default: return ''
    }
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {businesses.map((b) => (
        <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{b.name}</h3>
            <span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong>Type:</strong> {b.type} <br/>
              <strong>Location:</strong> {b.city} - {b.address} <br/>
              <strong>Owner:</strong> {b.owner.name} ({b.owner.email})
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            {b.status === 'CLOSURE_REQUESTED' && (
              <>
                <button 
                  onClick={() => handleDelete(b.id)} 
                  className="btn btn-primary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)', marginBottom: '0.5rem' }}
                >
                  Execute Closure
                </button>
                <button 
                  onClick={() => handleStatusChange(b.id, 'APPROVED')} 
                  className="btn btn-secondary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px' }}
                >
                  Reject Request
                </button>
              </>
            )}
            {b.status === 'PENDING' && (
              <>
                <button 
                  onClick={() => handleStatusChange(b.id, 'APPROVED')} 
                  className="btn btn-primary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px' }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleStatusChange(b.id, 'REJECTED')} 
                  className="btn btn-secondary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                >
                  Reject
                </button>
              </>
            )}
            {b.status === 'REJECTED' && (
              <>
                <button 
                  onClick={() => handleStatusChange(b.id, 'APPROVED')} 
                  className="btn btn-secondary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', marginBottom: '0.5rem' }}
                >
                  Re-evaluate
                </button>
                <button 
                  onClick={() => handleDelete(b.id)} 
                  className="btn btn-secondary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', color: 'var(--color-error)' }}
                >
                  Delete
                </button>
              </>
            )}
            {b.status === 'APPROVED' && (
              <>
                <button 
                  onClick={() => handleStatusChange(b.id, 'SUSPENDED')} 
                  className="btn btn-secondary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', color: 'var(--color-warning)', borderColor: 'var(--color-warning)', marginBottom: '0.5rem' }}
                >
                  Suspend
                </button>
                <button 
                  onClick={() => handleDelete(b.id)} 
                  className="btn btn-secondary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                >
                  Delete
                </button>
              </>
            )}
            {b.status === 'SUSPENDED' && (
              <>
                <button 
                  onClick={() => handleRestore(b.id)} 
                  className="btn btn-primary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', marginBottom: '0.5rem' }}
                >
                  Restore
                </button>
                <button 
                  onClick={() => handleDelete(b.id)} 
                  className="btn btn-secondary" 
                  disabled={loadingId === b.id}
                  style={{ width: '100%', maxWidth: '140px', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                >
                  Delete
                </button>
              </>
            )}
            {b.status === 'DELETED' && (
              <button 
                onClick={() => handleRestore(b.id)} 
                className="btn btn-primary" 
                disabled={loadingId === b.id}
                style={{ width: '100%', maxWidth: '140px' }}
              >
                Restore
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
