'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMyNotifications } from '@/app/actions/notificationActions'
import { io } from 'socket.io-client'

export default function NotificationBell({ role, userId }: { role: string, userId: string }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Initial fetch
    const fetchCount = async () => {
      const res = await getMyNotifications()
      if (res.success && res.notifications) {
        const unread = res.notifications.filter(n => !n.isRead).length
        setUnreadCount(unread)
      }
    }
    fetchCount()

    // Socket.IO real-time connection
    const socket = io()

    // Join personal notification room
    if (userId) {
       socket.emit('join', userId)
    }

    socket.on('notification', (newNotification) => {
       // Increment unread count globally inside navbar instantly
       setUnreadCount(prev => prev + 1)
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])

  let linkPath = '/dashboard/customer/notifications'
  if (role === 'ADMIN') linkPath = '/dashboard/admin/notifications'
  if (role === 'OWNER') linkPath = '/dashboard/owner/notifications'

  return (
    <Link href={linkPath} style={{ position: 'relative', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', padding: '0.5rem', marginRight: '1rem' }} aria-label="Notifications">
      <span style={{ fontSize: '1.4rem' }}>🔔</span>
      {unreadCount > 0 && (
        <span style={{ 
            position: 'absolute', 
            top: '0', 
            right: '0', 
            backgroundColor: 'var(--color-error)', 
            color: 'white', 
            borderRadius: '50%', 
            padding: '0.1rem 0.4rem', 
            fontSize: '0.75rem',
            fontWeight: 'bold',
            transform: 'translate(25%, -25%)'
        }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
