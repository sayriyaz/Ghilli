'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Keep in sync with the FAQPage JSON-LD in src/app/layout.tsx
const faqs = [
  {
    q: 'What is Ghilli Goli Soda?',
    a: 'Ghilli Goli Soda is an Indian marble-bottle (goli / codd-neck) carbonated soft drink brand, reimagined as a premium craft soda. It is made in Pudukkottai, Tamil Nadu by Oasis Food & Beverages and comes in 8 flavours.',
  },
  {
    q: 'How many flavours does Ghilli have?',
    a: '8 flavours: Blueberry, Cola, Green Apple, Lemon Mint, Orange, Paneer, Pineapple, and Strawberry.',
  },
  {
    q: 'Who manufactures Ghilli Goli Soda?',
    a: 'Oasis Food & Beverages, located in Pudukkottai, Tamil Nadu, India.',
  },
  {
    q: 'How do I become a Ghilli dealer or distributor?',
    a: 'Submit the dealer enquiry form on this page or call +91 99449 19449 or +91 93444 19991. Enquiries are accepted from all 38 districts of Tamil Nadu and other locations including other Indian states and abroad.',
  },
  {
    q: 'What is goli soda?',
    a: "Goli soda (also called banta or marble soda) is a traditional Indian carbonated drink sealed with a glass marble in a codd-neck bottle. You push the marble in to 'pop' the bottle and release the fizz.",
  },
]

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    gsap.fromTo(headingRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
    )
    const items = sectionRef.current?.querySelectorAll('.faq-item')
    items?.forEach((el, i) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: i * 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } }
      )
    })
  }, [])

  return (
    <section
      id="faq"
      ref={sectionRef}
      style={{
        padding: '8rem 5vw',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #070a14 50%, #0a0e1a 100%)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div ref={headingRef} style={{ opacity: 0, textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{
            color: '#d4af37', fontSize: '0.75rem', letterSpacing: '0.35em',
            textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600,
          }}>
            Good to Know
          </p>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900,
            lineHeight: 0.95, letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'white' }}>Frequently Asked</span>{' '}
            <span className="gradient-gold">Questions</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                className="faq-item"
                style={{
                  opacity: 0,
                  borderRadius: '16px',
                  background: isOpen ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isOpen ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'background 0.25s, border-color 0.25s',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1.25rem 1.5rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <h3 style={{
                    fontSize: '1.02rem', fontWeight: 700,
                    color: isOpen ? '#f0d060' : 'white',
                    transition: 'color 0.25s',
                    margin: 0,
                  }}>
                    {f.q}
                  </h3>
                  <span style={{
                    flexShrink: 0,
                    color: '#d4af37', fontSize: '1.2rem', lineHeight: 1,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s',
                  }}>
                    +
                  </span>
                </button>
                <div style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.3s ease',
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{
                      padding: '0 1.5rem 1.4rem',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.95rem',
                      lineHeight: 1.75,
                      margin: 0,
                    }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
