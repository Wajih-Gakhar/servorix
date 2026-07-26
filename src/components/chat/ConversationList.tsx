'use client'

import { useEffect, useState } from 'react'
import { getUserConversations } from '@/app/actions/matrixActions'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ConversationList({ currentUser }: { currentUser: any }) {
    const [conversations, setConversations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        const fetchConvs = async () => {
            const res = await getUserConversations()
            if (res.success && res.conversations) {
                setConversations(res.conversations)
            }
            setLoading(false)
        }
        fetchConvs()
    }, [])

    if (loading) return <div style={{ padding: '1rem', opacity: 0.5 }}>Loading network...</div>

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {conversations.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No active streams found.</div>
            ) : (
                conversations.map((c) => {
                    const otherParticipants = c.participants.filter((p: any) => p.userId !== currentUser.id)
                    
                    let title = otherParticipants.map((p: any) => p.user.name).join(', ')
                    
                    if (c.type === 'REPORT') {
                        const businessName = c.business?.name || 'Business'
                        title = `Report: ${businessName} (${c.reportReason || 'General'})`
                    }
                    
                    const lastMessage = c.messages?.[0]
                    const isUnread = lastMessage && lastMessage.senderId !== currentUser.id && (!lastMessage.seenBy || !lastMessage.seenBy.some((s: any) => s.userId === currentUser.id))
                    
                    const isActive = pathname === `/messages/${c.id}`

                    return (
                        <Link key={c.id} href={`/messages/${c.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: isActive ? 'var(--color-primary-light)' : 'transparent',
                                border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {c.type === 'REPORT' && <span style={{ color: 'var(--color-error)' }}>🚩</span>}
                                        {c.type === 'OWNER_ADMIN' && <span style={{ color: 'var(--color-accent)' }}>🛡️</span>}
                                        {title}
                                    </h4>
                                    {isUnread && (
                                        <div style={{ 
                                            background: 'var(--color-error)', 
                                            color: 'white', 
                                            borderRadius: '12px', 
                                            padding: '0.1rem 0.6rem', 
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}>
                                            {c.messages?.[0].seenBy?.length === 0 ? 'New' : 'Unread'}
                                        </div>
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {isActive ? '💬 Active now' : (lastMessage?.content || 'System: Channel created')}
                                </p>
                            </div>
                        </Link>
                    )
                })
            )}
        </div>
    )
}
