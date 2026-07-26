'use client'

import { useState } from 'react'
import { requestPasswordReset } from '@/app/actions/auth'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [mockTokenLink, setMockTokenLink] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setMockTokenLink('')
        setLoading(true)

        const res = await requestPasswordReset(new FormData(e.currentTarget))
        if (res.error) setError(res.error)
        
        // Render Sandbox Mock Link!
        if (res.success) {
            if (res.mockToken) {
                setMockTokenLink(`${window.location.origin}/reset-password?token=${res.mockToken}`)
            } else {
                setError('If that email exists in our system, a password reset link has been dispatched.')
            }
        }
        setLoading(false)
    }

    return (
        <div style={{ maxWidth: '500px', margin: '8rem auto 4rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-primary)'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Password Recovery
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enter your account email to receive a password reset link.</p>

                {error && <div className="badge badge-error" style={{ marginBottom: '1rem', width: '100%', padding: '1rem' }}>{error}</div>}
                
                {mockTokenLink ? (
                    <div style={{ padding: '1.5rem', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                        <h4 style={{ color: 'var(--color-success)', margin: '0 0 1rem 0' }}>Sandbox Mock Email Received!</h4>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>In a production environment, this link would be emailed to you via SMTP. For local testing, click the secure link below to proceed:</p>
                        <Link href={mockTokenLink} style={{ color: 'var(--color-primary)', wordBreak: 'break-all', fontWeight: 'bold' }}>
                            {mockTokenLink}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                              <input type="email" name="email" required className="form-input" placeholder="you@example.com" style={{ paddingLeft: '2.5rem' }} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
                            {loading ? (
                               <>
                                 <svg style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                                 Transmitting...
                               </>
                            ) : (
                               <>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                 Send Reset Link
                               </>
                            )}
                        </button>
                    </form>
                )}
                
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link href="/login" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    )
}
