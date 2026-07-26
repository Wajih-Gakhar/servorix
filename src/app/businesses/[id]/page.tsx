import { getBusinessById } from '@/app/actions/business'
import { getSession } from '@/lib/auth'
import BookingForm from './BookingForm'
import ReviewList from './ReviewList'
import Link from 'next/link'
import MapWrapper from '@/components/MapWrapper'
import ReportModal from '@/components/ReportModal'
import MessageOwnerButton from '@/components/MessageOwnerButton';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default async function BusinessDetailsPage({ params }: { params: { id: string } }) {
  const unwrappedParams = await params;
  const res = await getBusinessById(unwrappedParams.id)
  const session = await getSession()

  if (res.error || !res.business) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Business Not Found</h2>
        <Link href="/businesses" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Directory</Link>
      </div>
    )
  }

  const { business } = res

  // Sort working hours by dayOfWeek
  const sortedHours = business.workingHours ? [...business.workingHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek) : []

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start', paddingTop: '8rem', paddingBottom: '4rem' }}>
      
      {/* Main Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {business.businessLogo && (
          <div style={{ width: '100%', height: '300px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundImage: `url(${business.businessLogo})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-color)' }}>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{business.name}</h1>
            <span className="badge badge-success" style={{ fontSize: '1rem' }}>{business.type}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
             <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               📍 {business.address}, {business.city}
             </p>
             <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               📞 {business.phone}
             </p>
             {business.website && (
               <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 🔗 <a href={business.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Website</a>
               </p>
             )}
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>About Us</h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{business.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* Services List */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Available Services</h2>
          {business.services.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No services listed yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {business.services.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)', transition: 'transform 0.2s', cursor: 'default' }} className="hover-lift">
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', marginBottom: '0.25rem' }}>{s.name}</h4>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                       ⏱️ {s.duration} mins
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-accent)' }}>
                    Rs {s.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <ReviewList reviews={business.reviews} businessId={business.id} session={session} />
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '100px' }}>
        
        {/* Booking Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📅 Book an Appointment</h3>
          <BookingForm business={business as any} session={session} />
        </div>

        {/* Working Hours */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🕐 Working Hours</h3>
          {sortedHours.length === 0 ? (
             <p style={{ color: 'var(--text-secondary)' }}>Working hours not specified. Default: {business.openingTime} - {business.closingTime}</p>
          ) : (
             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
               {sortedHours.map(wh => (
                   <li key={wh.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                       <span style={{ fontWeight: 600 }}>{DAYS[wh.dayOfWeek]}</span>
                       <span style={{ color: 'var(--text-secondary)' }}>{wh.openTime} - {wh.closeTime}</span>
                   </li>
               ))}
             </ul>
          )}
        </div>

        {/* Location Map Placeholder */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🗺️ Location</h3>
          <div style={{ width: '100%', height: '300px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
              <MapWrapper 
                  address={business.address} 
                  city={business.city} 
                  defaultLat={business.latitude} 
                  defaultLon={business.longitude} 
              />
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
             <MessageOwnerButton 
                ownerId={business.ownerId} 
                businessId={business.id} 
                currentUserId={session?.userId} 
             />
             <ReportModal businessId={business.id} businessName={business.name} />
          </div>
        </div>
        
      </div>
      
    </div>
  )
}
