'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { executePasswordReset } from '@/app/actions/auth'
import Link from 'next/link'

function ResetForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    if (!token) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Invalid or missing recovery token.</div>

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
          setError('Passwords do not match.')
          setLoading(false)
          return
        }
    
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.')
          setLoading(false)
          return
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
          setError('Password must contain upper and lower case letters, and at least one number.')
          setLoading(false)
          return
        }

        formData.append('token', token)

        const res = await executePasswordReset(formData)
        if (res.error) {
            setError(res.error)
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    if (success) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
                <h3 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>Vault Secured!</h3>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Your password has been successfully reset via cryptography.</p>
                <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 2rem' }}>Proceed to Login</Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="badge badge-error" style={{ marginBottom: '1rem', width: '100%', padding: '1rem' }}>{error}</div>}
            
            <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        name="password" 
                        required 
                        minLength={8}
                        className="form-input" 
                        placeholder="••••••••" 
                        style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '2.5rem' }} 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>At least 8 chars, 1 uppercase, 1 lowercase, 1 number.</p>
            </div>

            <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        name="confirmPassword" 
                        required 
                        className="form-input" 
                        placeholder="••••••••" 
                        minLength={8} 
                        style={{ width: '100%', paddingLeft: '2.5rem' }} 
                    />
                </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
                {loading ? (
                   <>
                     <svg style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                     Encrypting...
                   </>
                ) : (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                     Reset Password
                   </>
                )}
            </button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div style={{ maxWidth: '400px', margin: '8rem auto 4rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-primary)'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Create New Password
                </h2>
                <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Decrypting Node...</div>}>
                    <ResetForm />
                </Suspense>
            </div>
        </div>
    )
}
