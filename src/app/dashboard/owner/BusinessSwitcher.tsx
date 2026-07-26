'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function BusinessSwitcher({ businesses, activeId }: { businesses: { id: string, name: string }[], activeId: string }) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <select 
            className="form-input" 
            style={{ padding: '0.2rem 1rem', fontSize: '0.9rem', height: 'auto' }}
            value={activeId}
            onChange={(e) => {
                // Brute-force override Next.js App Router memoization caching by forcing the native browser to execute a hard contextual DOM reload
                window.location.assign(`${pathname}?businessId=${e.target.value}`)
            }}
        >
            {businesses.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
            ))}
        </select>
    )
}
