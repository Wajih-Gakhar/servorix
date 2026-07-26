'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { markAsRead } from '@/app/actions/notificationActions'

type Notification = {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: Date
}

export default function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)

  const handleMarkAsRead = async (id: string) => {
    const res = await markAsRead(id)
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      router.refresh()
    }
  }

  if (notifications.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No notifications yet.</p>
  }

  const getNotificationLink = (type: string) => {
    switch (type) {
      case 'BUSINESS_APPROVED':
      case 'BUSINESS_REJECTED':
      case 'BUSINESS_SUSPENDED':
      case 'BUSINESS_RESTORED': 
         return '/dashboard/owner'
      case 'BOOKING_REQUEST': 
      case 'BOOKING_CANCELLED_OWNER':
         return '/dashboard/owner/bookings'
      case 'BOOKING_STATUS':
      case 'BOOKING_CANCELLED_CUSTOMER':
         return '/dashboard/customer/bookings'
      case 'PAYMENT_REMINDER':
         return '/dashboard/owner/payments'
      default:
         return '#'
    }
  }

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) {
       await handleMarkAsRead(n.id)
    }
    const link = getNotificationLink(n.type)
    if (link !== '#') {
       router.push(link)
    }
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {notifications.map((n) => (
        <div key={n.id} 
             onClick={() => handleNotificationClick(n)}
             style={{ 
            padding: '1.5rem', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)',
            backgroundColor: n.isRead ? 'var(--bg-card)' : 'var(--bg-base)',
            borderLeft: n.isRead ? '1px solid var(--border-color)' : '4px solid var(--color-primary)',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            opacity: n.isRead ? 0.8 : 1
        }} className="hover-lift">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontWeight: n.isRead ? 'normal' : 'bold' }}>{n.title}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
          <p style={{ margin: 0, color: 'var(--text)' }}>{n.message}</p>
        </div>
      ))}
    </div>
  )
}
