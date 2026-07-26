'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUnreadCount } from '@/app/actions/matrixActions'
import { getPusherClient } from '@/lib/pusherClient'

export default function MessageBell({ userId }: { userId: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Initial fetch
    const fetchCount = async () => {
      const res = await getUnreadCount()
      setCount(res.count || 0)
    }
    fetchCount()

    // Pusher real-time listening
    const pusher = getPusherClient()
    if (pusher && userId) {
      const channel = pusher.subscribe(`private-user_${userId}`)
      
      channel.bind('unread_count_update', (data: { increment?: boolean, refresh?: boolean }) => {
        if (data.refresh) {
          fetchCount()
        } else if (data.increment) {
          setCount(prev => prev + 1)
        }
      })

      return () => {
        pusher.unsubscribe(`private-user_${userId}`)
      }
    }
  }, [userId])

  return (
    <Link href="/messages" style={{ position: 'relative', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', padding: '0.5rem' }} title="Messages" aria-label="Messages">
      <span style={{ fontSize: '1.4rem' }}>💬</span>
      {count > 0 && (
        <span style={{ 
            position: 'absolute', 
            top: '0', 
            right: '0', 
            backgroundColor: 'var(--color-primary)', 
            color: 'white', 
            borderRadius: '50%', 
            padding: '0.1rem 0.4rem', 
            fontSize: '0.75rem',
            fontWeight: 'bold',
            transform: 'translate(25%, -25%)',
            border: '2px solid var(--bg-main)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
