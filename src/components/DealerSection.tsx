'use client'
import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const EMAILJS_SERVICE  = 'service_9sdqmlf'
const EMAILJS_TEMPLATE = 'template_bl5apym'
const EMAILJS_KEY      = 'WzEDAuDfduQPR8lYj'

// All 38 districts of Tamil Nadu
const cities = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar',
  'Other (outside Tamil Nadu)',
]

const perks = [
  { icon: '📦', title: 'Exclusive Territory', desc: 'Get dedicated distributor rights for your city zone.' },
  { icon: '💰', title: 'High Margins', desc: 'Industry-leading dealer margins on every case sold.' },
  { icon: '🎯', title: 'Marketing Support', desc: 'Branded materials, festival campaigns, digital support.' },
  { icon: '🚀', title: 'Fast Growing Brand', desc: 'Ride Ghilli\'s expansion across South India and beyond.' },
]

export default function DealerSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', city: '', business: '' })
  const [customCity, setCustomCity] = useState('')
  const isOther = form.city === 'Other (outside Tamil Nadu)'

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const els = sectionRef.current?.querySelectorAll('.dealer-animate')
    els?.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        }
      )
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const location = isOther ? (customCity.trim() || 'Outside Tamil Nadu') : form.city
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          title:   '🥤 Ghilli Dealer Enquiry',
          name:    form.name,
          time:    form.phone,
          message: `Business: ${form.business || '—'} | Location: ${location}`,
          email:   '',
        },
        EMAILJS_KEY
      )
      gsap.to(formRef.current, {
        scale: 0.98, duration: 0.1, yoyo: true, repeat: 1,
        onComplete: () => setSubmitted(true),
      })
    } catch {
      setError('Could not send. Call +91 99449 19449 directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="dealer"
      ref={sectionRef}
      style={{
        padding: '10rem 5vw',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #050810 50%, #0a0e1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(135deg, transparent, transparent 50px, rgba(212,175,55,0.01) 50px, rgba(212,175,55,0.01) 51px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Heading */}
        <div className="dealer-animate" style={{ opacity: 0, marginBottom: '5rem', maxWidth: 600 }}>
          <p style={{
            color: '#d4af37',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontWeight: 600,
          }}>
            Grow With Ghilli
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: '1rem',
          }}>
            Become a <span className="gradient-gold">Dealer</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
          }}>
            Join Ghilli&apos;s growing distributor network. Premium brand. Real margins. Unforgettable product.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* Perks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {perks.map((p, i) => (
              <div
                key={p.title}
                className="dealer-animate"
                style={{
                  opacity: 0,
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
              >
                <div style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'rgba(212,175,55,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="dealer-animate" style={{ opacity: 0 }}>
            {submitted ? (
              <div style={{
                padding: '3rem',
                borderRadius: '24px',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
                  We&apos;ll Be In Touch!
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                  Your enquiry is received. Our team will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                style={{
                  padding: '2.5rem',
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                  Dealer Enquiry
                </h3>

                {[
                  { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Full name' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                  { label: 'Business Name', key: 'business', type: 'text', placeholder: 'Your shop / company' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      {label}
                    </label>
                    <input
                      required
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    District / Location
                  </label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(10,14,26,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: form.city ? 'white' : 'rgba(255,255,255,0.4)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="" disabled>Select your district</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>

                  {/* Custom location field when "Other" picked (e.g. Bangalore, Dubai) */}
                  {isOther && (
                    <input
                      required
                      type="text"
                      placeholder="Type your city / country (e.g. Dubai)"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      style={{
                        width: '100%',
                        marginTop: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(212,175,55,0.4)',
                        color: 'white',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.7)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold"
                  style={{
                    padding: '0.9rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    marginTop: '0.5rem',
                    width: '100%',
                    letterSpacing: '0.04em',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Sending…' : 'Send Enquiry →'}
                </button>

                {error && (
                  <p style={{ fontSize: '0.8rem', color: '#ff6666', textAlign: 'center' }}>{error}</p>
                )}

                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                  We respond within 24 hours. Or call us directly:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
                  {['+91 99449 19449', '+91 93444 19991'].map((n) => (
                    <a key={n} href={`tel:${n.replace(/\s/g,'')}`} style={{ fontSize: '0.82rem', color: '#d4af37', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.03em' }}>{n}</a>
                  ))}
                  <a href="mailto:oasisfoodbeverag@gmail.com" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginTop: '0.15rem' }}>
                    oasisfoodbeverag@gmail.com
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
