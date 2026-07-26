'use client'

import { useState, useEffect } from 'react'
import { searchBusinesses, SearchFilters } from '@/app/actions/searchActions'
import Link from 'next/link'

export default function SearchPage() {
    const [businesses, setBusinesses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    // Filters state
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('')
    const [city, setCity] = useState('')
    const [minRating, setMinRating] = useState(0)

    const fetchResults = async () => {
        setLoading(true)
        const filters: SearchFilters = {}
        if (query) filters.query = query
        if (category) filters.category = category
        if (city) filters.city = city
        if (minRating > 0) filters.minRating = minRating

        const res = await searchBusinesses(filters)
        if (res.success) {
            setBusinesses(res.businesses || [])
        }
        setLoading(false)
    }

    // Initial fetch
    useEffect(() => {
        fetchResults()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchResults()
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2rem', alignItems: 'start' }}>
            
            {/* Sidebar Filters */}
            <aside className="card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Filters</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div className="form-group">
                        <label>Search</label>
                        <input 
                           type="text" 
                           placeholder="Business or Service name..." 
                           value={query} 
                           onChange={e => setQuery(e.target.value)} 
                           className="form-input" 
                        />
                    </div>

                    <div className="form-group">
                        <label>City / Location</label>
                        <input 
                           type="text" 
                           placeholder="e.g. New York" 
                           value={city} 
                           onChange={e => setCity(e.target.value)} 
                           className="form-input" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="form-input">
                            <option value="">All Categories</option>
                            <option value="SALON">Salon & Spa</option>
                            <option value="GYM">Gym & Fitness</option>
                            <option value="THERAPY">Therapy</option>
                            <option value="TUTORING">Tutoring</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Minimum Rating</label>
                        <input 
                           type="range" 
                           min="0" max="5" step="0.5" 
                           value={minRating} 
                           onChange={e => setMinRating(parseFloat(e.target.value))} 
                           style={{ width: '100%' }}
                        />
                        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {minRating > 0 ? `${minRating} Stars & Up` : 'Any Rating'}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Apply Filters
                    </button>
                    
                    <button type="button" className="btn btn-secondary" onClick={() => {
                        setQuery(''); setCity(''); setCategory(''); setMinRating(0); 
                    }} style={{ width: '100%' }}>
                        Clear
                    </button>

                </form>
            </aside>

            {/* Results */}
            <div>
                <h1 style={{ marginBottom: '2rem' }}>Search Results</h1>
                
                {loading ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Searching...</p>
                ) : businesses.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--text-secondary)' }}>No businesses found</h2>
                        <p>Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {businesses.map(b => (
                            <Link href={`/businesses/${b.id}`} key={b.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card hover-lift" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    {b.businessLogo ? (
                                        <div style={{ width: '100%', height: '150px', backgroundImage: `url(${b.businessLogo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                    ) : (
                                        <div style={{ width: '100%', height: '150px', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '3rem' }}>🏢</span>
                                        </div>
                                    )}
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0 }}>{b.name}</h3>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>⭐ {b.rating.toFixed(1)}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            📍 {b.city} • <span className="badge badge-success" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>{b.category || b.type}</span>
                                        </p>
                                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {b.services.slice(0, 3).map((s: any) => (
                                                <span key={s.id} style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-base)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                                    {s.name}
                                                </span>
                                            ))}
                                            {b.services.length > 3 && (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+{b.services.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
