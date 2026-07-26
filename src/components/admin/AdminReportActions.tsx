'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminArchiveReport, deleteConversation } from '@/app/actions/matrixActions'

interface AdminReportActionsProps {
    reportId: string
}

export default function AdminReportActions({ reportId }: AdminReportActionsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleArchive = async () => {
        if (!confirm('Are you sure you want to resolve and archive this report? The customer will be notified and the chat will be hidden from their active list.')) return
        
        setLoading(true)
        const res = await adminArchiveReport(reportId)
        if (res.success) {
            router.push('/dashboard/admin?tab=reports')
            router.refresh()
        } else {
            alert(res.error || 'Archive failed')
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!confirm('CRITICAL ACTION: This will PERMANENTLY delete all record of this report from the database. This cannot be undone. Proceed?')) return
        
        setLoading(true)
        const res = await deleteConversation(reportId)
        if (res.success) {
            router.push('/dashboard/admin?tab=reports')
            router.refresh()
        } else {
            alert(res.error || 'Deletion failed')
        }
        setLoading(false)
    }

    return (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
            <button 
                onClick={handleArchive}
                disabled={loading}
                className="btn btn-secondary glass-card-bg"
                style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(0, 180, 216, 0.3)'
                }}
            >
                {loading ? 'Processing...' : '✔ Resolve & Archive'}
            </button>
            <button 
                onClick={handleDelete}
                disabled={loading}
                className="btn btn-secondary glass-card-bg"
                style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: 'var(--color-error)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
            >
                {loading ? 'Processing...' : '🗑 Permanent Delete'}
            </button>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.6 }}>
                Records management protocol v1.4
            </p>
        </div>
    )
}
