'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const packs = [
  {
    name: '6 Pack',
    bottles: 6,
    price: '₹299',
    pricePerBottle: '₹50/bottle',
    desc: 'Perfect for your small get-together.',
    tag: '',
    flavours: 'Choose 1 flavour',
    accent: '#4488ff',
    bottle: 'new_blueberry.png',
  },
  {
    name: '12 Pack',
    bottles: 12,
    price: '₹549',
    pricePerBottle: '₹46/bottle',
    desc: 'Great for families and small parties.',
    tag: 'MOST POPULAR',
    flavours: 'Mix any 2 flavours',
    accent: '#d4af37',
    bottle: 'new_blueberry.png',
  },
  {
    name: 'Festival Combo',
    bottles: 24,
    price: '₹999',
    pricePerBottle: '₹42/bottle',
    desc: 'The full Ghilli experience. Go all out.',
    tag: 'BEST VALUE',
    flavours: 'All 8 flavours',
    accent: '#ff44aa',
    bottle: 'new_blueberry.png',
  },
]

export default function EcommerceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [addedTo, setAddedTo] = useState<string | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const cards = sectionRef.current?.querySelectorAll('.pack-card')
    cards?.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
        }
      )
    })
    const heading = sectionRef.current?.querySelector('.eco-heading')
    if (heading) {
      gsap.fromTo(heading,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 85%' },
        }
      )
    }
  }, [])

  const handleOrder = (packName: string) => {
    setAddedTo(packName)
    setTimeout(() => setAddedTo(null), 2500)
  }

  return (
    <section
      id="ecommerce"
      ref={sectionRef}
      style={{
        padding: '10rem 5vw',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #08111f 50%, #0a0e1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '60vh',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading */}
        <div className="eco-heading" style={{ opacity: 0, textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{
            color: '#d4af37',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontWeight: 600,
          }}>
            Order Online
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'white' }}>Stock Up.</span>
            {' '}
            <span className="gradient-gold">Fizz Up.</span>
          </h2>
          <p style={{
            marginTop: '1.5rem',
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 450,
            margin: '1.5rem auto 0',
            lineHeight: 1.7,
          }}>
            Order party packs and bulk combos. Fast delivery. Cold arrival guaranteed.
          </p>
        </div>

        {/* Pack cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch',
        }}>
          {packs.map((pack, i) => {
            const isSelected = selected === i
            const isPop = pack.tag === 'MOST POPULAR'
            return (
              <div
                key={pack.name}
                className="pack-card"
                onClick={() => setSelected(i === selected ? null : i)}
                style={{
                  opacity: 0,
                  position: 'relative',
                  borderRadius: '24px',
                  padding: '2.5rem 2rem',
                  background: isSelected
                    ? `radial-gradient(ellipse at top, ${pack.accent}15, rgba(255,255,255,0.04))`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isSelected ? pack.accent + '44' : (isPop ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.07)')}`,
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = `${pack.accent}33`
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = isPop ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.07)'
                }}
              >
                {/* Tag */}
                {pack.tag && (
                  <div style={{
                    position: 'absolute',
                    top: '-0.75rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '0.3rem 1rem',
                    borderRadius: '50px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    background: isPop
                      ? 'linear-gradient(135deg, #d4af37, #f0d060)'
                      : `${pack.accent}cc`,
                    color: isPop ? '#0a0e1a' : 'white',
                    whiteSpace: 'nowrap',
                  }}>
                    {pack.tag}
                  </div>
                )}

                {/* Bottles visual */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                }}>
                  {Array.from({ length: Math.min(pack.bottles, 12) }).map((_, bi) => (
                    <div
                      key={bi}
                      style={{
                        position: 'relative',
                        width: pack.bottles > 12 ? 22 : 28,
                        height: pack.bottles > 12 ? 50 : 62,
                        transition: 'transform 0.3s',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        transitionDelay: `${bi * 0.03}s`,
                      }}
                    >
                      <Image
                        src={`/nobg/${pack.bottle}`}
                        alt=""
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                  {pack.bottles > 12 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: pack.accent,
                    }}>
                      +{pack.bottles - 12}
                    </div>
                  )}
                </div>

                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: 'white',
                  marginBottom: '0.35rem',
                }}>
                  {pack.name}
                </h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '1rem',
                  lineHeight: 1.6,
                }}>
                  {pack.desc}
                </p>

                <div style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '10px',
                  background: `${pack.accent}11`,
                  border: `1px solid ${pack.accent}22`,
                  fontSize: '0.78rem',
                  color: pack.accent,
                  marginBottom: '1.5rem',
                  fontWeight: 600,
                }}>
                  {pack.flavours}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{pack.price}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{pack.pricePerBottle}</span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleOrder(pack.name) }}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.25s ease',
                      letterSpacing: '0.03em',
                      ...(addedTo === pack.name
                        ? { background: '#22c55e', color: 'white' }
                        : isPop
                        ? { background: 'linear-gradient(135deg, #d4af37, #f0d060)', color: '#0a0e1a' }
                        : { background: `${pack.accent}22`, color: pack.accent, border: `1px solid ${pack.accent}44` }
                      ),
                    }}
                    onMouseEnter={(e) => {
                      if (addedTo !== pack.name) {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = `0 8px 30px ${pack.accent}33`
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {addedTo === pack.name ? '✓ Added to Cart!' : 'Order Now →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bulk note */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '1.5rem',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
            Need 50+ cases for events, weddings, or retail?{' '}
            <button
              onClick={() => document.getElementById('dealer')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Contact our dealer team →
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}
