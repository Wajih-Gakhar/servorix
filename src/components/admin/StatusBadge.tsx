'use client'

import React from 'react'

interface StatusBadgeProps {
  status: string | null | undefined
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = status?.toUpperCase() || 'UNKNOWN'
  
  let badgeClass = 'badge-secondary'
  if (s === 'OPEN') badgeClass = 'badge-error'
  if (s === 'IN_PROGRESS') badgeClass = 'badge-warning'
  if (s === 'RESOLVED') badgeClass = 'badge-success'
  
  return (
    <span className={`badge ${badgeClass}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
      {s.replace('_', ' ')}
    </span>
  )
}
