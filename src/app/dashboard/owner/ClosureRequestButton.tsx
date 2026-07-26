'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestBusinessClosure, cancelClosureRequest } from '@/app/actions/business'

export default function ClosureRequestButton({ businessId, currentStatus }: { businessId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const isClosureRequested = currentStatus === 'CLOSURE_REQUESTED'

    const handleAction = async () => {
        if (isClosureRequested) {
            if (!confirm('Are you sure you want to cancel your closure request? Your business will remain listed.')) return
            
            setLoading(true)
            const res = await cancelClosureRequest(businessId)
            if (res.success) {
                alert('Closure request successfully cancelled.')
                router.refresh()
            } else {
                alert(res.error || 'Failed to cancel closure request.')
            }
            setLoading(false)

        } else {
            if (!confirm('Are you sure you want to request permanent closure of this business? It will be sent to the Administrator for formal deletion.')) return
            
            setLoading(true)
            const res = await requestBusinessClosure(businessId)
            if (res.success) {
                alert('Closure request sent successfully.')
                router.refresh()
            } else {
                alert(res.error || 'Operation failed')
            }
            setLoading(false)
        }
    }

    if (currentStatus === 'PENDING' || currentStatus === 'SUSPENDED') {
        return null // Don't show closure options if the business isn't actively listed
    }

    return (
        <button 
           onClick={handleAction}
           disabled={loading}
           className="btn btn-secondary" 
           style={{ 
               borderColor: isClosureRequested ? 'var(--color-primary)' : 'var(--color-error)', 
               color: isClosureRequested ? 'var(--color-primary)' : 'var(--color-error)', 
               fontSize: '0.85rem', 
               padding: '0.4rem 0.8rem' 
           }}
        >
            {loading ? 'Processing...' : (isClosureRequested ? 'Cancel Closure Request' : 'Request Closure')}
        </button>
    )
}
