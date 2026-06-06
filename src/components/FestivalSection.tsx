'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const festivals = [
  {
    name: 'Holi',
    emoji: '🎨',
    tagline: 'Colours of Joy',
    desc: 'Every splash of colour, a sip of Ghilli. Make your Holi brighter.',
    from: '#e040fb',
    via: '#ff4081',
    to: '#ff9800',
    bottle: 'strawberry_bottle.png',
  },
  {
    name: 'Pongal',
    emoji: '🌾',
    tagline: 'Harvest Spirit',
    desc: 'Sun, sugarcane, and fizzy gold. Celebrate the harvest with Ghilli.',
    from: '#ff9800',
    via: '#f57f17',
    to: '#e65100',
    bottle: 'orange_bottle.png',
  },
  {
    name: 'Eid',
    emoji: '🌙',
    tagline: 'Sweet Celebration',
    desc: 'Share joy with the ones you love. Ghilli — for every feast table.',
    from: '#00bcd4',
    via: '#26a69a',
    to: '#1b5e20',
    bottle: 'green_apple_bottle.png',
  },
  {
    name: 'Village Cricket',
    emoji: '🏏',
    tagline: 'Sunday Six',
    desc: 'Between overs. After the catch. Ghilli is the timeout everyone wants.',
    from: '#388e3c',
    via: '#689f38',
    to: '#f9a825',
    bottle: 'lemon_bottle.png',
  },
  {
    name: 'College Canteen',
    emoji: '🎓',
    tagline: 'Campus Vibes',
    desc: 'Bunking class, sharing sips. The drink of every great story.',
    from: '#3949ab',
    via: '#7b1fa2',
    to: '#e91e63',
    bottle: 'Blueberry_bottle.png',
  },
  {
    name: 'Diwali',
    emoji: '🪔',
    tagline: 'Festival of Lights',
    desc: 'Diyas lit, sweets shared, Ghilli in hand. Light up every celebration.',
    from: '#ff8f00',
    via: '#f9a825',
    to: '#ff6f00',
    bottle: 'pineapple_bottle.png',
  },
  {
    name: 'Christmas',
    emoji: '🎄',
    tagline: 'Season of Joy',
    desc: 'Jingle all the way with Ghilli. Because every party needs the pop.',
    from: '#c62828',
    via: '#388e3c',
    to: '#c62828',
    bottle: 'cola_bottle.png',
  },
]

export default function FestivalSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(headingRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      }
    )

    const cards = trackRef.current?.querySelectorAll('.festival-card')
    cards?.forEach((card, i) => {
      gsap.fromTo(card,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        }
      )
    })
  }, [])

  const scrollByDir = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.festival-card') as HTMLElement | null
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onTrackKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByDir(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByDir(-1) }
  }

  return (
    <section
      id="festival"
      ref={sectionRef}
      style={{
        padding: '10rem 0 10rem 5vw',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #060810 50%, #0a0e1a 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1200, marginBottom: '4rem', paddingRight: '5vw' }}>
        <div ref={headingRef} style={{ opacity: 0 }}>
          <p style={{
            color: '#d4af37',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontWeight: 600,
          }}>
            Brand Identity
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'white' }}>Every Festival.</span>
            <br />
            <span className="gradient-gold">One Ghilli.</span>
          </h2>
          <p style={{
            marginTop: '1.5rem',
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 480,
            lineHeight: 1.7,
          }}>
            From Holi to college canteens — Ghilli belongs to every moment of Indian life.
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onTrackKey}
        role="region"
        aria-label="Festival cards — use arrow keys to navigate"
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          paddingRight: '5vw',
          paddingBottom: '1rem',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          outline: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {festivals.map((f, i) => (
          <div
            key={f.name}
            className="festival-card"
            style={{
              opacity: 0,
              flexShrink: 0,
              width: 'clamp(280px, 35vw, 380px)',
              minHeight: 480,
              borderRadius: '24px',
              background: `linear-gradient(145deg, ${f.from}22 0%, ${f.via}11 50%, ${f.to}22 100%)`,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '2.5rem',
              scrollSnapAlign: 'start',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'transform 0.35s ease, border-color 0.3s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.borderColor = `${f.from}44`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            {/* Gradient blob */}
            <div style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${f.from}33, transparent)`,
              pointerEvents: 'none',
            }} />

            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>{f.emoji}</div>
              <div style={{
                display: 'inline-block',
                padding: '0.3rem 0.9rem',
                borderRadius: '50px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: `${f.from}22`,
                color: f.from,
                marginBottom: '1rem',
              }}>
                {f.tagline}
              </div>
              <h3 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '1rem',
              }}>
                {f.name}
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
              }}>
                {f.desc}
              </p>
            </div>

            {/* Bottle corner — matched to flavour */}
            <div style={{
              position: 'absolute',
              bottom: -8,
              right: '1rem',
              width: 92,
              height: 210,
              opacity: 0.92,
              filter: `drop-shadow(0 14px 26px ${f.from}66)`,
              pointerEvents: 'none',
            }}>
              {/* Color glow behind bottle */}
              <div style={{
                position: 'absolute',
                inset: '20% -20% 10% -20%',
                background: `radial-gradient(ellipse at center, ${f.from}55 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }} />
              <Image
                src={`/nobg/${f.bottle}`}
                alt={`Ghilli ${f.name}`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              fontSize: '0.8rem',
              color: f.from,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}>
              #{f.name.replace(' ', '')}Ghilli →
            </div>
          </div>
        ))}
      </div>

      {/* Arrow controls + hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem',
        paddingRight: '5vw',
      }}>
        {([['‹', -1], ['›', 1]] as const).map(([glyph, dir]) => (
          <button
            key={dir}
            onClick={() => scrollByDir(dir)}
            aria-label={dir === 1 ? 'Next festival' : 'Previous festival'}
            style={{
              width: 46, height: 46, borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.35)',
              color: '#d4af37', fontSize: '1.5rem', lineHeight: 1,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)' }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {glyph}
          </button>
        ))}
        <span style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', letterSpacing: '0.15em',
        }}>
          <span style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.2)' }} />
          SWIPE OR USE ARROWS
        </span>
      </div>
    </section>
  )
}
