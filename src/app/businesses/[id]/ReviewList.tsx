'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createReview } from '@/app/actions/review'

export default function ReviewList({ reviews, businessId, session }: { reviews: any[], businessId: string, session: any }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('businessId', businessId)
    
    const res = await createReview(formData)

    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setShowForm(false)
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Reviews ({reviews.length})</h2>
        {session?.role === 'CUSTOMER' && !showForm && (
          <button className="btn btn-secondary" onClick={() => setShowForm(true)}>Write a Review</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          {error && <div className="badge badge-error" style={{ marginBottom: '1rem', width: '100%' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Rating (1-5)</label>
            <input type="number" name="rating" min="1" max="5" required className="form-input" defaultValue="5" />
          </div>
          <div className="form-group">
            <label className="form-label">Comment (Optional)</label>
            <textarea name="comment" className="form-input" rows={3} placeholder="Share your experience..."></textarea>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No reviews yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {reviews.map((r: any) => (
            <div key={r.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              
              {/* Profile Picture */}
              <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-main)',
                  backgroundImage: `url(${r.customer?.profileImage || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0
              }}></div>
              
              {/* Review Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>@{r.customer.name.replace(/\s+/g, '').toLowerCase()}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <div style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', gap: '0.2rem' }}>
                    {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ opacity: i < r.rating ? 1 : 0.3 }}>⭐</span>
                    ))}
                </div>
                
                {r.comment && <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-main)' }}>{r.comment}</p>}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
