'use client'

import { useState, useEffect } from 'react'
import { getAdminReports, updateReportStatus } from '@/app/actions/matrixActions'
import Link from 'next/link'

export default function ReportPanel({ initialReports }: { initialReports: any[] }) {
    const [reports, setReports] = useState(initialReports)
    const [filter, setFilter] = useState('ALL')
    const [loading, setLoading] = useState(false)

    const fetchReports = async (status?: string) => {
        setLoading(true)
        const res = await getAdminReports(status === 'ALL' ? undefined : status)
        if (res.success && res.reports) {
            setReports(res.reports)
        }
        setLoading(false)
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        const res = await updateReportStatus(id, newStatus)
        if (res.success) {
            setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
        } else {
            alert(res.error)
        }
    }

    const filteredReports = filter === 'ALL' 
        ? reports 
        : reports.filter(r => r.status === filter)

    return (
        <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`btn ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    >
                        {s.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Business</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reported By</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Activity</th>
                            <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No reports found matching telemetry signatures.
                                </td>
                            </tr>
                        ) : (
                            filteredReports.map((r) => (
                                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.businessName}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '0.2rem' }}>{r.reason}</div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ color: 'var(--text-primary)' }}>{r.reporterName}</div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span className={`badge ${
                                            r.status === 'OPEN' ? 'badge-error' : 
                                            r.status === 'IN_PROGRESS' ? 'badge-warning' : 
                                            'badge-success'
                                        }`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {r.lastMessage}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>
                                            {new Date(r.updatedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <Link href={`/messages/${r.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                View Thread
                                            </Link>
                                            <select 
                                                defaultValue={r.status}
                                                onChange={(e) => handleStatusChange(r.id, e.target.value)}
                                                className="form-input"
                                                style={{ width: 'auto', padding: '0.4rem', fontSize: '0.8rem', borderRadius: '6px' }}
                                            >
                                                <option value="OPEN">Open</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="RESOLVED">Resolved</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .table-row-hover:hover {
                    background: rgba(0, 180, 216, 0.03);
                }
            `}</style>
        </div>
    )
}
