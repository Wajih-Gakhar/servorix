'use client'

import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '@/app/actions/matrixActions'
import { getPusherClient } from '@/lib/pusherClient'

export default function MessageInput({ conversationId }: { conversationId: string }) {
    const [content, setContent] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [preview, setPreview] = useState<{ src: string, type: string } | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Handle typing events
    const handleTyping = () => {
        const pusher = getPusherClient()
        if (!pusher) return

        const channelName = `presence-conversation_${conversationId}`
        pusher.channel(channelName)?.trigger('client-typing', { isTyping: true })

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
            pusher.channel(channelName)?.trigger('client-typing', { isTyping: false })
        }, 3000)
    }

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        }
    }, [])

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview({ src: reader.result as string, type: file.type })
        }
        reader.readAsDataURL(file)
    }

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if ((!content.trim() && !preview) || isSending) return

        setIsSending(true)
        const payloadStr = preview?.src || undefined
        
        // Optimistic UI could be implemented here natively
        await sendMessage(conversationId, content, payloadStr)
        
        setContent('')
        setPreview(null)
        setIsSending(false)
        if (fileRef.current) fileRef.current.value = ''
    }

    return (
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-main)', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
            {preview && (
                <div style={{ position: 'relative', display: 'inline-block', padding: '0.5rem', background: 'var(--bg-card)', borderRadius: '8px', maxWidth: 'max-content' }}>
                   {preview.type.startsWith('image/') ? (
                      <img src={preview.src} alt="Upload preview" style={{ height: '80px', borderRadius: '4px' }} />
                   ) : (
                      <div style={{ padding: '1rem', color: 'var(--color-primary)' }}>📄 Document Ready</div>
                   )}
                   <button type="button" onClick={() => setPreview(null)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
                </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="file" ref={fileRef} onChange={handleFile} accept="image/*,application/pdf" style={{ display: 'none' }} />
                <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-secondary" style={{ padding: '0.75rem', borderRadius: '50%' }}>
                    📎
                </button>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value)
                        handleTyping()
                    }}
                    placeholder="Type encrypted message..."
                    className="form-input"
                    style={{ flex: 1, borderRadius: '20px' }}
                />
                <button type="submit" disabled={isSending} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '20px' }}>
                    {isSending ? '...' : 'Send'}
                </button>
            </div>
        </form>
    )
}
