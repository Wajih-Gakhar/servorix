'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateConversation } from '@/app/actions/matrixActions'

interface MessageOwnerButtonProps {
    ownerId: string
    businessId: string
    currentUserId?: string
}

export default function MessageOwnerButton({ ownerId, businessId, currentUserId }: MessageOwnerButtonProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleMessageOwner = async () => {
        if (!currentUserId) {
            router.push('/login')
            return
        }

        if (currentUserId === ownerId) {
            setError("You cannot message your own business.")
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await getOrCreateConversation('CUSTOMER_OWNER', [currentUserId, ownerId], businessId)
            if (res.success && res.conversation) {
                router.push(`/messages/${res.conversation.id}`)
            } else {
                const errMsg = res.error || 'Failed to start conversation.'
                setError(errMsg)
                alert(errMsg) // Direct feedback for the user
            }
        } catch (err) {
            const errMsg = 'An error occurred. Please try again.'
            setError(errMsg)
            alert(errMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <button 
                onClick={handleMessageOwner}
                disabled={loading}
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
            >
                {loading ? 'Initializing...' : '💬 Message Owner'}
            </button>
            {error && <p style={{ color: 'var(--color-error)', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>}
        </div>
    )
}
