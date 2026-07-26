'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createReport } from '@/app/actions/matrixActions'

export default function ReportModal({ businessId, businessName }: { businessId: string, businessName: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [reason, setReason] = useState('SCAM')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('LOADING')
        
        const res = await createReport(businessId, reason, description)
        
        if (res.error) {
            setStatus('ERROR')
            setMessage(res.error)
        } else {
            setStatus('SUCCESS')
            setMessage('Report submitted securely. Thank you for keeping the network safe.')
            setTimeout(() => setIsOpen(false), 3000)
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--color-warning)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity='1'} onMouseOut={e=>e.currentTarget.style.opacity='0.8'}>
                <span style={{ fontSize: '1.2rem' }}>🚩</span> Report Business
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-card" 
                            style={{ padding: '2.5rem', maxWidth: '500px', width: '100%', position: 'relative', background: '#0a0f17' }}
                        >
                            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                            
                            <h2 style={{ marginBottom: '0.5rem', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>⚠️</span> Submit Security Report
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                                You are filing an official report against <strong>{businessName}</strong>. Our Trust & Safety team will review this payload immediately.
                            </p>

                            {status === 'SUCCESS' ? (
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
                                    {message}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {status === 'ERROR' && (
                                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
                                            {message}
                                        </div>
                                    )}

                                    <div>
                                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Primary Violation Category</label>
                                        <select className="form-input" value={reason} onChange={e => setReason(e.target.value)} required>
                                            <option value="SCAM">Fraudulent Activity / Scam</option>
                                            <option value="ABUSE">Abusive Behavior / Harassment</option>
                                            <option value="BAD_SERVICE">Severely Unprofessional Service</option>
                                            <option value="FAKE_REVIEWS">Artificial Metrics / Fake Reviews</option>
                                            <option value="OTHER">Other Vulnerability</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Detailed Telemetry (Optional)</label>
                                        <textarea 
                                            className="form-input" 
                                            rows={4} 
                                            placeholder="Please provide specific details to help our moderation nodes cross-reference the threat..."
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ background: 'transparent' }}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" disabled={status === 'LOADING'} style={{ background: 'var(--color-warning)', color: '#000' }}>
                                            {status === 'LOADING' ? 'Transmitting...' : 'Initiate Lockdown Request'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
