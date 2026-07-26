'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

// Fix for default Leaflet icon paths in Next.js
import L from 'leaflet'
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function MapDisplay({ address, city, defaultLat, defaultLon }: { address: string, city: string, defaultLat?: number | null, defaultLon?: number | null }) {
    const [coords, setCoords] = useState<[number, number] | null>(
        defaultLat && defaultLon ? [defaultLat, defaultLon] : null
    )
    const [loading, setLoading] = useState(!coords)

    useEffect(() => {
        // Fallback geocoding if lat/lon not explicitly provided by DB
        if (!coords) {
            const fetchGeocode = async () => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', ' + city)}`)
                    const data = await res.json()
                    if (data && data.length > 0) {
                        setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
                    }
                } catch (e) {
                    console.error('Failed to geocode address', e)
                } finally {
                    setLoading(false)
                }
            }
            fetchGeocode()
        }
    }, [address, city, coords])

    if (loading) return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
    if (!coords) return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>Map data not found for this location</div>

    return (
        <MapContainer center={coords} zoom={14} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords} icon={icon}>
                <Popup>
                    {address}, {city}
                </Popup>
            </Marker>
        </MapContainer>
    )
}
