'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Leaflet map with SSR disabled to prevent 'window is not defined' crashes
const DynamicMapDisplay = dynamic(() => import('./MapDisplay'), { 
    ssr: false, 
    loading: () => <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Loading Interactive Map...</div> 
})

export default function MapWrapper(props: { address: string, city: string, defaultLat?: number | null, defaultLon?: number | null }) {
    return <DynamicMapDisplay {...props} />
}
