'use client'

import React, { useState, useEffect, useRef } from 'react'
import { adminReplyToReport } from '@/app/actions/matrixActions'
import { getPusherClient } from '@/lib/pusherClient'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string | Date
  sender: {
    name: string
    role: string
    profileImage: string | null
  }
}

interface ReportChatViewProps {
  reportId: string
  initialMessages: any[]
}

export default function ReportChatView({ reportId, initialMessages }: ReportChatViewProps) {
  const [messages, setMessages] = useState<any[]>(initialMessages)
  const [newMsg, setNewMsg] = useState('')
  const [isSending, setIsSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const pusher = getPusherClient()
    if (!pusher) return

    const channel = pusher.subscribe(`presence-conversation_${reportId}`)
    
    channel.bind('new_message', (message: any) => {
        setMessages(prev => {
            if (prev.find(m => m.id === message.id)) return prev
            return [...prev, message]
        })
    })

    return () => {
      pusher.unsubscribe(`presence-conversation_${reportId}`)
    }
  }, [reportId])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMsg.trim() || isSending) return

    setIsSending(true)
    const res = await adminReplyToReport(reportId, newMsg)
    if (res.success) {
      setNewMsg('')
    } else {
      alert(res.error || 'Failed to send message')
    }
    setIsSending(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'transparent', overflow: 'hidden' }}>
      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', scrollbarWidth: 'thin', scrollbarColor: 'var(--border-color) transparent' }}>
        <AnimatePresence initial={false}>
            {messages.map((m, index) => {
            const isAdmin = m.sender.role === 'ADMIN'
            return (
                <motion.div 
                    key={m.id} 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0 }}
                    style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start', width: '100%' }}
                >
                <div style={{ 
                    maxWidth: '85%', 
                    position: 'relative',
                    padding: '1.25rem',
                    borderRadius: '1.25rem',
                    backdropFilter: 'blur(10px)',
                    background: isAdmin ? 'rgba(0, 180, 216, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: isAdmin ? '1px solid rgba(0, 180, 216, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isAdmin ? '0 0 20px rgba(0, 180, 216, 0.1)' : '0 10px 30px rgba(0,0,0,0.2)',
                    borderTopRightRadius: isAdmin ? '0.25rem' : '1.25rem',
                    borderTopLeftRadius: !isAdmin ? '0.25rem' : '1.25rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 900, 
                        color: isAdmin ? 'var(--color-primary)' : 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            background: isAdmin ? 'var(--color-primary)' : 'var(--text-secondary)',
                            boxShadow: isAdmin ? '0 0 10px var(--color-primary)' : 'none'
                        }}></span>
                        {m.sender.name} <span style={{ opacity: 0.5 }}>•</span> {isAdmin ? 'ADMIN' : 'REPORTER'}
                    </div>
                    </div>
                    
                    <p style={{ 
                        margin: 0, 
                        fontSize: '0.9rem', 
                        lineHeight: 1.6, 
                        color: isAdmin ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.9)',
                        whiteSpace: 'pre-wrap' 
                    }}>
                    {m.content}
                    </p>
                    
                    <div style={{ 
                        fontSize: '0.7rem', 
                        marginTop: '0.75rem', 
                        opacity: 0.5, 
                        textAlign: isAdmin ? 'right' : 'left',
                        fontFamily: 'monospace'
                    }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                </motion.div>
            )
            })}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <input 
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type your official response..."
                    style={{ 
                        width: '100%',
                        padding: '1rem 1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.875rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
            </div>
            <button 
                type="submit"
                disabled={isSending}
                className={`btn ${isAdminRole ? 'btn-primary' : 'btn-primary'} shadow-glow`}
                style={{ 
                    padding: '0.875rem 2rem', 
                    fontSize: '0.9rem', 
                    borderRadius: '0.875rem',
                    opacity: isSending || !newMsg.trim() ? 0.5 : 1,
                    pointerEvents: isSending || !newMsg.trim() ? 'none' : 'auto'
                }}
            >
                {isSending ? '...' : 'Reply'}
            </button>
        </form>
        <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.5, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            System Recorded Enforcement Channel
        </p>
      </div>
    </div>
  )
}

// Just a helper to ensure components used in the server action context are safe
const isAdminRole = true; 
