'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import NotificationBell from './NotificationBell'
import MessageBell from './chat/MessageBell'

type NavbarProps = {
  session: any | null
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(10, 15, 23, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0, 180, 216, 0.15)' : '1px solid transparent',
      padding: scrolled ? '0.55rem 0' : '1.1rem 0',
      transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-primary)', textDecoration: 'none' }}>
          <img key={`nav-logo-${pathname}`} src="/servorixLogoAnimated.svg" alt="Servorix" style={{ height: scrolled ? '54px' : '64px', width: 'auto', objectFit: 'contain', marginLeft: '-22px', transition: 'height 0.3s ease' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/businesses" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            Explore
          </Link>
          {session ? (
            <>
              {session.role === 'CUSTOMER' && <Link href="/dashboard/customer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>My Dashboard</Link>}
              {session.role === 'OWNER' && <Link href="/dashboard/owner" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>Business Dashboard</Link>}
              {session.role === 'ADMIN' && (
                <>
                  <Link href="/dashboard/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>Admin Panel</Link>
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', gap: '1rem' }}>
                 <MessageBell userId={session.userId} />
                 <NotificationBell role={session.role} userId={session.userId} />
                 <div>
                   <button onClick={handleLogout} style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '0.4rem',
                     padding: '0.5rem 1rem',
                     borderRadius: '0.375rem',
                     backgroundColor: 'var(--primary-color)',
                     color: 'white',
                     border: 'none',
                     cursor: 'pointer',
                     fontSize: '1rem',
                     fontWeight: 600,
                     transition: 'background-color 0.2s ease-in-out'
                   }}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                     Logout
                   </button>
                 </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/login" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                Login
              </Link>
              <Link href="/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
