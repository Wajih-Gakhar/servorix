'use client'

import React from 'react'
import Link from 'next/link'
import StatusBadge from './StatusBadge'

interface Report {
  id: string
  businessName: string
  businessId?: string
  reporterName: string
  reporterEmail: string
  reason: string | null
  status: string | null
  lastMessage: string
  createdAt: Date
  updatedAt: Date
}

interface AdminReportsListProps {
  reports: Report[]
}

export default function AdminReportsList({ reports }: AdminReportsListProps) {
  if (reports.length === 0) {
    return (
      <div className="glass-card-bg" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No enforcement incidents currently logged in the registry.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {reports.map((report) => (
        <div 
          key={report.id} 
          className="glass-card-bg"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(150px, 1fr) 2fr 1fr 100px', 
            gap: '1.5rem', 
            alignItems: 'center', 
            padding: '1.5rem', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)',
            transition: 'border-color 0.2s ease'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{report.businessName}</h3>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontFamily: 'monospace', marginTop: '0.25rem' }}>
              ENTRY_ID: {report.id.slice(0, 8).toUpperCase()}
            </div>
          </div>

          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Reason:</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{report.reason || 'SOP_VIOLATION'}</span>
                <StatusBadge status={report.status} />
             </div>
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                "{report.lastMessage}"
             </p>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>{report.reporterName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(report.createdAt).toLocaleDateString()}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link 
              href={`/dashboard/admin/reports/${report.id}`}
              className="btn btn-secondary shadow-glow"
              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
            >
              AUDIT
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
