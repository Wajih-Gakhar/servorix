'use client'

import { useEffect, useState, useRef } from 'react'
import { getPusherClient } from '@/lib/pusherClient'
import { getMessages, markMessagesAsSeen, deleteConversation, getConversationById } from '@/app/actions/matrixActions'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

export default function ChatWindow({ conversationId, currentUser }: { conversationId: string, currentUser: any }) {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isReport, setIsReport] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [typingUsers, setTypingUsers] = useState<string[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Fetch historical payload
        const fetchPayload = async () => {
            const [msgRes, convRes] = await Promise.all([
                getMessages(conversationId),
                getConversationById(conversationId)
            ])

            if (msgRes.success && msgRes.messages) {
                setMessages(msgRes.messages)
            }
            if (convRes.success && convRes.conversation) {
                setIsReport(convRes.conversation.type === 'REPORT')
            }
            setLoading(false)
            markMessagesAsSeen(conversationId)
        }
        fetchPayload()

        // Pusher real-time bindings (Presence Channel)
        const pusher = getPusherClient()
        if (pusher) {
            const channelName = `presence-conversation_${conversationId}`
            const channel = pusher.subscribe(channelName)
            
            // Online status tracking
            channel.bind('pusher:subscription_succeeded', (members: any) => {
                const ids: string[] = []
                members.each((member: any) => ids.push(member.id))
                setOnlineUsers(ids)
            })

            channel.bind('pusher:member_added', (member: any) => {
                setOnlineUsers((prev) => [...prev, member.id])
            })

            channel.bind('pusher:member_removed', (member: any) => {
                setOnlineUsers((prev) => prev.filter(id => id !== member.id))
            })

            // Typing indicators
            channel.bind('client-typing', (data: { isTyping: boolean }, metadata: any) => {
                const userId = metadata.user_id
                if (data.isTyping) {
                    setTypingUsers((prev) => prev.includes(userId) ? prev : [...prev, userId])
                } else {
                    setTypingUsers((prev) => prev.filter(id => id !== userId))
                }
            })

            // New messages
            channel.bind('new_message', (newMessage: any) => {
                setMessages((prev) => {
                    if (prev.find((m) => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage]
                })
                markMessagesAsSeen(conversationId)
            })

            // Message deletion
            channel.bind('message_deleted', (data: { messageId: string }) => {
                setMessages((prev) => prev.filter((m) => m.id !== data.messageId))
            })

            // Conversation deletion
            channel.bind('conversation_deleted', () => {
                window.location.assign('/messages')
            })

            return () => {
                pusher.unsubscribe(channelName)
            }
        }
    }, [conversationId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Synchronizing streams...</div>

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'transparent', overflow: 'hidden' }}>
            
            {/* Header / Actions Area */}
            {!isReport && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem 0', background: 'transparent' }}>
                    <button 
                        onClick={async () => {
                            if (confirm('Are you sure you want to permanently delete this entire conversation?')) {
                                const res = await deleteConversation(conversationId)
                                if (res.error) alert(res.error)
                            }
                        }}
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.15)', 
                            color: 'var(--color-error)', 
                            border: '1px solid rgba(239, 68, 68, 0.3)', 
                            padding: '0.4rem 0.8rem', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        🗑️ Delete Conversation
                    </button>
                </div>
            )}

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative' }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: 0.5, margin: 'auto' }}>No messages in this matrix yet.</div>
                ) : (
                    messages.map((m) => (
                        <MessageBubble 
                            key={m.id} 
                            message={m} 
                            isOwn={m.senderId === currentUser.userId} 
                            isOnline={onlineUsers.includes(m.senderId)}
                        />
                    ))
                )}

                {/* Typing Indicator UI */}
                {typingUsers.length > 0 && typingUsers.some(id => id !== currentUser.id) && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', padding: '0.5rem', fontStyle: 'italic' }}>
                        Someone is typing...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Handler */}
            <MessageInput conversationId={conversationId} />
        </div>
    )
}
