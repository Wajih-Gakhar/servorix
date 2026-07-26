import Link from 'next/link'
import Image from 'next/image'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedStagger'
import SmoothScroll from '@/components/SmoothScroll'

import PublicConciergeWidget from '@/components/ai/PublicConciergeWidget'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <SmoothScroll>
      <div style={{ overflowX: 'hidden' }}>
        {/* Public Floating Servorix AI Concierge */}
        <PublicConciergeWidget />

        {/* 1. HERO SECTION */}
        <main style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 2rem' }}>
          {/* Geometric Background Orbs */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,180,216,0.1) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: -1, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(0,119,182,0.15) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: -1, borderRadius: '50%' }} />

          {/* Animated Deep Space Watermark */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, zIndex: 0, pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/servorixIconAnimated.svg" alt="" style={{ width: '80vw', maxWidth: '900px', height: 'auto', objectFit: 'contain' }} />
          </div>

          <AnimatedSection directional="up" className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px', marginTop: 'auto', marginBottom: 'auto' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 900, marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
              Supercharge Your <br /> Business Growth
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              The elite digital sanctuary bridging exclusive grooming salons and top-tier fitness centers. Scale your revenue and elevate your daily lifestyle effortlessly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Launch Your Business
              </Link>
              <Link href="/businesses" className="btn btn-secondary glass-card" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                Explore Services
              </Link>
            </div>
          </AnimatedSection>
        </main>

        {/* 2. STATS COUNTER */}
        <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <StaggerContainer className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <StaggerItem directional="up">
              <h3 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 800 }}>Rs 2.7M+</h3>
              <p style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Revenue Generated</p>
            </StaggerItem>
            <StaggerItem directional="up">
              <h3 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 800 }}>10k+</h3>
              <p style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Monthly Bookings</p>
            </StaggerItem>
            <StaggerItem directional="up">
              <h3 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 800 }}>140+</h3>
              <p style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Elite Partners</p>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* 3. PROCESS STEPS (Getting Started) */}
        <section className="container" style={{ padding: '8rem 1.5rem' }}>
          <AnimatedSection directional="left" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Getting Started with Servorix</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>A perfectly streamlined flow to transform how you connect and schedule, protected by impenetrable cryptographic schemas.</p>
          </AnimatedSection>

          <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Register & Configure', desc: 'Secure your vault. Enter your basic administrative credentials and dynamically define your operational hours.' },
              { step: '02', title: 'Deploy Services', desc: 'Upload your cutting-edge grooming treatments or bespoke fitness slots into the global registry engine.' },
              { step: '03', title: 'Automated Trajectory', desc: 'Watch global customer bookings instantly sync to your digital ledger. Zero phone calls. Zero friction.' }
            ].map((item, i) => (
              <StaggerItem directional="up" key={i}>
                <div className="glass-card glass-card-scale" style={{ padding: '3rem 2.5rem', position: 'relative', height: '100%', cursor: 'pointer' }}>
                  <div style={{ fontSize: '5rem', fontWeight: 900, color: 'rgba(0, 180, 216, 0.05)', position: 'absolute', top: '1.5rem', right: '1.5rem', lineHeight: 1 }}>{item.step}</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>{item.title}</h3>
                  <p style={{ position: 'relative', zIndex: 1, margin: 0 }}>{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* 4. FEATURE GRID */}
        <section style={{ padding: '8rem 0', backgroundColor: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <AnimatedSection directional="right" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Structural Features</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Built meticulously for high-load, zero-latency scheduling operations.</p>
            </AnimatedSection>

            <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: '⚡', title: 'Instant Processing', desc: 'Sub-millisecond data handling powered natively by Next.js Server Actions.' },
                { icon: '💳', title: 'Digital Ledgers', desc: 'Secure fiat transactional architectures to monitor revenue streams instantly.' },
                { icon: '📅', title: 'Automated Logic', desc: 'Algorithmic time-mapping that inherently prevents double bookings system-wide.' },
                { icon: '🔒', title: 'Cryptographic Vaults', desc: 'Military-grade encryption securing all passwords and transactional footprints.' },
                { icon: '📊', title: 'Charting Nodes', desc: 'Dynamic vector graphing arrays to monitor booking aggregates via Recharts.' },
                { icon: '📱', title: 'True Glassmorphism', desc: 'A breathtakingly fluid UI aesthetic deeply integrated into the DOM matrix.' }
              ].map((feature, i) => (
                <StaggerItem directional="up" key={i}>
                  <div className="glass-card glass-card-bg" style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem', height: '100%' }}>
                    <div style={{ fontSize: '2.2rem', background: 'rgba(0, 180, 216, 0.08)', padding: '1.25rem', borderRadius: '1rem', color: 'var(--color-primary)' }}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{feature.title}</h4>
                      <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-secondary)' }}>{feature.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* 5. TESTIMONIALS */}
        <section className="container" style={{ padding: '8rem 1.5rem' }}>
          <AnimatedSection directional="up">
            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>Trusted by Elite Framework Operators</h2>
          </AnimatedSection>
          <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <StaggerItem directional="left">
              <div className="glass-card" style={{ padding: '3rem', borderTop: '2px solid var(--color-primary)', height: '100%' }}>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2.5rem' }}>"Before Servorix, my barber shop was bleeding slots to no-shows. Now, everything is cryptographically secured with pure systemic speed. Absolute perfection."</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(45deg, #00B4D8, #0077B6)' }}></div>
                  <div><h4 style={{ margin: 0 }}>Raja Shariyar</h4><span style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Director, Sharp Edge Salon</span></div>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem directional="right">
              <div className="glass-card" style={{ padding: '3rem', borderTop: '2px solid var(--color-primary)', height: '100%' }}>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2.5rem' }}>"We needed a digital marketplace that reflected the physical premium scale of our facility. Servorix delivered the absolute best UI/UX engine I've deployed."</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(45deg, #48CAE4, #00B4D8)' }}></div>
                  <div><h4 style={{ margin: 0 }}>Shanzay Zafar</h4><span style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Founder, Apex Iron</span></div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* 6. FAQ Accordion */}
        <section style={{ padding: '6rem 0', backgroundColor: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <AnimatedSection directional="left">
              <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Matrix Technical Inquiries</h2>
            </AnimatedSection>
            <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: 'How does the booking logic prevent double slots?', a: 'Our Next.js runtime algorithms physically scan the Prisma database to evaluate overlapping timestamps, structurally rejecting conflicting sessions pre-database generation.' },
                { q: 'Can I swap between multiple businesses I own?', a: 'Affirmative. The platform utilizes a Global Context Switcher that reloads isolated memory structures for each distinct entity on demand.' },
                { q: 'Does the application support full server actions?', a: 'Yes. Forms are pushed globally utilizing 100% bleeding-edge Next.js Server Actions, stripping all API router lag.' }
              ].map((faq, i) => (
                <StaggerItem directional="up" key={i}>
                  <details className="glass-card" style={{ cursor: 'pointer' }}>
                    <summary style={{ padding: '1.5rem 2rem', fontSize: '1.1rem', fontWeight: 600, listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                      {faq.q}
                      <span style={{ color: 'var(--color-primary)' }}>+</span>
                    </summary>
                    <div style={{ padding: '0 2rem 1.5rem 2rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  </details>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* 7. CTA BANNER */}
        <section className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
          <AnimatedSection directional="up" className="glass-card animate-pulse-glow" style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.1), rgba(0, 119, 182, 0.2))', border: '1px solid rgba(0, 180, 216, 0.4)' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Initialize Your Trajectory</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem' }}>
              Deploy your enterprise directly into the Servorix ecosystem and experience unprecedented scaling automation.
            </p>
            <Link href="/register" className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.25rem' }}>
              Launch Dashboard
            </Link>
          </AnimatedSection>
        </section>

        {/* DEVELOPER INFORMATION FOOTER */}
        <Footer />
      </div>
    </SmoothScroll>
  )
}
