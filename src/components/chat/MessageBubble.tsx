'use client'

import { deleteMessageSoft } from '@/app/actions/matrixActions'
import { useState } from 'react'

export default function MessageBubble({ message, isOwn, isOnline }: { message: any, isOwn: boolean, isOnline: boolean }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const date = new Date(message.createdAt)
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const isToday = new Date().toDateString() === date.toDateString()
    const displayTime = isToday ? time : `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOwn ? 'flex-end' : 'flex-start',
            alignSelf: isOwn ? 'flex-end' : 'flex-start', // Force side alignment
            margin: '0.25rem 0',
            maxWidth: '100%'
        }}>
            {!isOwn && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.8rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{message.sender?.name}</span>
                    {isOnline && <div style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%', border: '1px solid var(--bg-main)' }} title="Online" />}
                </div>
            )}
            
            <div style={{
                background: isOwn ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                padding: '0.8rem 1.2rem',
                borderRadius: '20px',
                borderTopRightRadius: isOwn ? '4px' : '20px',
                borderTopLeftRadius: isOwn ? '20px' : '4px',
                maxWidth: '650px',
                boxShadow: isOwn ? '0 4px 15px rgba(0, 163, 255, 0.2)' : 'none',
                position: 'relative'
            }}>
                {message.fileUrl && (
                    <div style={{ marginBottom: '0.5rem' }}>
                        {message.fileType?.includes('pdf') || message.fileType?.includes('raw') ? (
                            <a href={message.fileUrl} target="_blank" rel="noreferrer" style={{ color: isOwn ? '#fff' : 'var(--color-primary)', textDecoration: 'underline' }}>
                                📄 View Attachment
                            </a>
                        ) : (
                            <img src={message.fileUrl} alt="Attachment" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                        )}
                    </div>
                )}
                
                {message.content && <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{message.content}</div>}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{displayTime}</span>
                    {isOwn && (
                        <span style={{ fontSize: '0.65rem', color: message.seenBy?.length > 0 ? '#4ADE80' : 'inherit' }}>
                            {message.seenBy?.length > 0 ? '✓✓' : '✓'}
                        </span>
                    )}
                    {isOwn && (
                        <button 
                            onClick={async () => {
                                if (confirm('Delete this message?')) {
                                    setIsDeleting(true)
                                    await deleteMessageSoft(message.id)
                                    setIsDeleting(false)
                                }
                            }}
                            disabled={isDeleting}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                cursor: 'pointer', 
                                fontSize: '0.8rem', 
                                opacity: 0.5,
                                padding: 0,
                                marginLeft: '0.5rem'
                            }}
                            title="Delete message"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
