import Link from 'next/link'
import { getBusinesses } from '@/app/actions/business'
import { getCategories } from '@/app/actions/categoryActions'
import SmoothScroll from '@/components/SmoothScroll'
import { StaggerContainer, StaggerItem, AnimatedSection } from '@/components/AnimatedStagger'
import Footer from '@/components/Footer'


export default async function BusinessesPage({ searchParams }: { searchParams: Promise<{ city?: string; type?: string; category?: string; query?: string; minPrice?: string; maxPrice?: string; sortBy?: string; minRating?: string }> }) {
  const params = await searchParams;
  
  const minPriceNum = params.minPrice ? parseInt(params.minPrice) : undefined;
  const maxPriceNum = params.maxPrice ? parseInt(params.maxPrice) : undefined;
  const minRatingNum = params.minRating ? parseFloat(params.minRating) : undefined;
  
  const [bRes, cRes] = await Promise.all([
      getBusinesses({ 
          city: params.city, 
          type: params.type, 
          category: params.category,
          query: params.query,
          minPrice: isNaN(minPriceNum as number) ? undefined : minPriceNum,
          maxPrice: isNaN(maxPriceNum as number) ? undefined : maxPriceNum,
          minRating: isNaN(minRatingNum as number) ? undefined : minRatingNum,
          sortBy: params.sortBy as any
      }),
      getCategories()
  ])
  
  const businesses = bRes.businesses || []
  
  // Merge dynamic DB categories with predefined ones, avoiding duplicates by name
  const dbCategories = (cRes.categories || []).map((c: any) => ({
      name: c.name,
      icon: c.icon || '📌',
      desc: c.description || 'General services'
  }))
  
  // If we have categories in DB, use them primarily. 
  // If DB is empty, we can show a subset or just a message.
  // But the Admin now has power to seed them.
  const combinedCategories = dbCategories.length > 0 ? dbCategories : [
    { name: 'Barbershop', icon: '💈', desc: 'Precision cuts' },
    { name: 'Hair Salon', icon: '✂️', desc: 'Styling & color' },
    { name: 'Spa & Massage', icon: '💆‍♀️', desc: 'Relaxation' },
    { name: 'Nail Studio', icon: '💅', desc: 'Manicures & Pedicures' },
  ]

  const hasSearchConstraints = params.city || params.query || params.category || params.minPrice || params.maxPrice || params.minRating;

  return (
    <SmoothScroll>
      <div className="container" style={{ padding: '9rem 1rem 4rem 1rem', maxWidth: '1200px' }}>
        <AnimatedSection directional="left" style={{ marginBottom: '4rem' }}>
            {params.category && (
               <Link href="/businesses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 600 }}>
                  &larr; <span style={{ color: 'var(--text-secondary)' }}>View All Categories</span>
               </Link>
            )}
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 500px' }}>
                    <h1 style={{ margin: 0, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1 }}>
                        {params.category ? `${params.category} Services` : 'Find Local Professionals'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px' }}>
                        Discover the best local professionals and book your appointment easily.
                    </p>
                </div>
                
                {/* Search Form */}
                <form style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', flex: '1 1 500px', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} method="GET" action="/businesses">
                    {params.category && <input type="hidden" name="category" value={params.category} />}
                    
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', opacity: 0.8, marginRight: '0.75rem' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </span>
                            <input 
                                type="text" 
                                name="query" 
                                defaultValue={params.query} 
                                placeholder="Search salons, services, or keywords..." 
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontSize: '1.05rem', padding: '1rem 0' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', opacity: 0.8, marginRight: '0.75rem' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </span>
                            <input 
                                type="text" 
                                name="city" 
                                defaultValue={params.city} 
                                placeholder="City or location..." 
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontSize: '1.05rem', padding: '1rem 0' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: '40px', padding: '1rem 2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          Search
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                         <select name="sortBy" defaultValue={params.sortBy || 'rank'} className="form-input" style={{ width: 'auto', padding: '0.6rem 1rem', borderRadius: '20px', fontSize: '0.9rem', flex: 1, background: 'rgba(255,255,255,0.04)' }}>
                             <option value="rank">Highest Ranked</option>
                             <option value="newest">Recently Added</option>
                             <option value="price_low">Price: Low to High</option>
                             <option value="price_high">Price: High to Low</option>
                         </select>
                         
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                             <input type="number" name="minPrice" placeholder="Min Rs" defaultValue={params.minPrice} className="form-input" style={{ padding: '0.6rem', borderRadius: '20px', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }} />
                             <span style={{ color: 'var(--text-secondary)' }}>-</span>
                             <input type="number" name="maxPrice" placeholder="Max Rs" defaultValue={params.maxPrice} className="form-input" style={{ padding: '0.6rem', borderRadius: '20px', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }} />
                         </div>
                         
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                             <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '0.5rem' }}>Rating:</span>
                             <select name="minRating" defaultValue={params.minRating || ''} className="form-input" style={{ padding: '0.6rem 1rem', borderRadius: '20px', fontSize: '0.9rem', flex: 1, background: 'rgba(255,255,255,0.04)' }}>
                                 <option value="">Any</option>
                                 <option value="4">4.0+ Stars</option>
                                 <option value="4.5">4.5+ Stars</option>
                                 <option value="4.8">4.8+ Stars</option>
                             </select>
                         </div>
                         
                        {hasSearchConstraints && (
                            <Link href="/businesses" style={{ padding: '0.5rem 1rem', color: 'var(--color-error)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '20px' }}>Clear Filters</Link>
                        )}
                    </div>
                </form>
            </div>
        </AnimatedSection>

      {!hasSearchConstraints && (
          <AnimatedSection directional="up" style={{ marginBottom: '4rem' }}>
             <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Browse by Category</h2>
             <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                {combinedCategories.map((cat, i) => (
                    <StaggerItem key={i} directional="up">
                        <Link href={`/businesses?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                            <div className="glass-card glass-card-scale" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0px 10px 15px rgba(0, 180, 216, 0.2))' }}>{cat.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 800 }}>{cat.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>{cat.desc}</p>
                            </div>
                        </Link>
                    </StaggerItem>
                ))}
            </StaggerContainer>
            <h2 style={{ fontSize: '1.5rem', marginTop: '4rem', marginBottom: '1.5rem', fontWeight: 800 }}>New & Popular</h2>
          </AnimatedSection>
      )}

      {businesses.length === 0 ? (
        <AnimatedSection directional="up" className="glass-card" style={{ padding: '6rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🏢</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No businesses found</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No venues match your current search criteria. Try modifying your filters.</p>
        </AnimatedSection>
      ) : (
        <StaggerContainer className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem', padding: 0 }}>
          {businesses.map((b) => (
            <StaggerItem key={b.id} directional="up">
              <Link href={`/businesses/${b.id}`} className="glass-card glass-card-scale" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Visual Header */}
                <div style={{ height: '220px', background: 'radial-gradient(circle at top right, rgba(0, 180, 216, 0.2), transparent 70%), linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(10, 15, 23, 1))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                   <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                       <span className="badge badge-success" style={{ backdropFilter: 'blur(12px)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>{b.status}</span>
                   </div>
                   {combinedCategories.find(c => c.name === b.category)?.icon || (b.type === 'GYM' ? '🏋️‍♂️' : '💈')}
                   
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, var(--bg-glass), transparent)' }} />
                </div>
                
                {/* Content Body */}
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-glass)' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(0,180,216,0.1)', padding: '0.35rem 0.85rem', borderRadius: '6px' }}>
                              {b.category || b.type}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                              <span style={{ color: '#FFD700', fontSize: '0.9rem' }}>★</span>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{b.reviews && b.reviews.length > 0 ? (b.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / b.reviews.length).toFixed(1) : 'New'}</span>
                          </div>
                      </div>
                      <h3 style={{ margin: '0.5rem 0', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>{b.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          {b.city} — {b.address}
                      </p>
                  </div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      {b.services && b.services.length > 0 ? (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Featured Service</span>
                                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{b.services[0].name}</span>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.25rem' }}>Starting At</span>
                                  <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.25rem' }}>Rs {Math.min(...b.services.map((s: any) => s.price))}</span>
                              </div>
                          </div>
                      ) : (
                          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
                              No services listed yet
                          </div>
                      )}
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {b.services ? b.services.length : 0} Services
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      View Profile <span style={{ color: 'var(--color-primary)' }}>&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
      <div style={{ marginTop: '4rem' }}>
        <Footer />
      </div>
    </div>
    </SmoothScroll>
  )
}
