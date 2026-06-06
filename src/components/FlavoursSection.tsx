'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Stable bubble config — seeded so no hydration mismatch
const BUBBLES = Array.from({ length: 32 }, (_, i) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453
  const r = (n: number) => Math.abs(Math.sin(s + n))
  return {
    left:   Math.round(r(1) * 100),
    startY: Math.round(r(2) * 20),       // start near bottom
    size:   4 + Math.round(r(3) * 14),   // 4–18px
    dur:    2.5 + r(4) * 4,              // 2.5–6.5s
    delay:  r(5) * 4,                    // 0–4s
    drift:  (r(6) - 0.5) * 60,          // ±30px horizontal
  }
})

const flavours = [
  { name: 'Blueberry', brandImg: 'blueberry.png', poster: 'blueberry.png', glow: '#4488ff', desc: 'The OG. Bold. Crisp. Iconic.', tag: 'BESTSELLER' },
  { name: 'Green Apple', brandImg: 'green_apple.png', poster: 'greenapple.png', glow: '#44dd66', desc: 'Crisp green apple kick.', tag: '' },
  { name: 'Cola Rush', brandImg: 'cola.png', poster: 'cola.png', glow: '#cc7744', desc: 'Deep dark fizz. Maximum punch.', tag: 'BOLD' },
  { name: 'Lemon Zing', brandImg: 'lemon_mojito.png', poster: 'lemon.png', glow: '#eedd22', desc: 'Sharp citrus. Summer vibes.', tag: '' },
  { name: 'Orange Burst', brandImg: 'orange.png', poster: 'orange.png', glow: '#ff8844', desc: 'Sunny tropical warmth.', tag: 'SUMMER' },
  { name: 'Paneer Soda', brandImg: 'panner.png', poster: 'paneer.png', glow: '#ccccaa', desc: 'Masala magic. Uniquely Indian.', tag: 'DESI' },
  { name: 'Pineapple Gold', brandImg: 'pineapple.png', poster: 'pineapple.png', glow: '#d4af37', desc: 'Tropical bliss. Sweet & fizzy.', tag: '' },
  { name: 'Strawberry', brandImg: 'strawberry.png', poster: 'strawberry.png', glow: '#ff4466', desc: 'Berry sweet. Crowd favourite.', tag: 'POPULAR' },
]

type Flavour = typeof flavours[0]

function BottleCard({ flavour, index, onOpen }: { flavour: Flavour; index: number; onOpen: (f: Flavour) => void }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0, scale: 0.9 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.7,
        delay: index * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [index])

  return (
    <div
      ref={cardRef}
      onClick={() => onOpen(flavour)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 0,
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 32px 80px ${flavour.glow}44, 0 0 0 1px ${flavour.glow}55`
          : '0 4px 24px rgba(0,0,0,0.5)',
        background: '#0a0e1a',
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Product image — fills top 62% */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 260,
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <Image
          src={`/branding/${flavour.brandImg}`}
          alt={flavour.name}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
          }}
        />
        {/* Bottom fade into dark */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, #0a0e1a 100%)',
          pointerEvents: 'none',
        }} />

        {/* Tag */}
        {flavour.tag && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '50px',
            fontSize: '0.6rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            background: 'rgba(0,0,0,0.55)',
            color: flavour.glow,
            border: `1px solid ${flavour.glow}66`,
            backdropFilter: 'blur(6px)',
          }}>
            {flavour.tag}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: '1.25rem 1.5rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: 'white',
          marginBottom: '0.4rem',
          letterSpacing: '0.02em',
        }}>
          {flavour.name}
        </h3>
        <p style={{
          fontSize: '0.85rem',
          color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
          lineHeight: 1.55,
          transition: 'color 0.3s',
          flex: 1,
        }}>
          {flavour.desc}
        </p>

        <div style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            width: 20, height: 1,
            background: flavour.glow,
          }} />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: flavour.glow,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Explore
          </span>
        </div>
      </div>

      {/* Bottom glow line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '10%',
        right: '10%',
        height: 1,
        background: `linear-gradient(90deg, transparent, ${flavour.glow}66, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s',
      }} />
    </div>
  )
}

export default function FlavoursSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Flavour | null>(null)

  const openModal = useCallback((f: Flavour) => setActive(f), [])
  const closeModal = useCallback(() => setActive(null), [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    gsap.fromTo(
      headingRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      }
    )
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    if (active) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [active, closeModal])

  return (
    <section
      id="flavours"
      style={{
        padding: '10rem 5vw',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #050810 40%, #0a0e1a 100%)',
        position: 'relative',
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headingRef} style={{ opacity: 0, marginBottom: '5rem', textAlign: 'center' }}>
          <p style={{
            color: '#d4af37',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontWeight: 600,
          }}>
            8 Bold Flavours
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'white' }}>Pick Your</span>
            {' '}
            <span className="gradient-gold">Ghilli</span>
          </h2>
          <p style={{
            marginTop: '1.5rem',
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.45)',
          }}>
            Every bottle a new adventure. Hover to feel the fizz.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {flavours.map((f, i) => (
            <BottleCard key={f.name} flavour={f} index={i} onOpen={openModal} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeInUp 0.25s ease-out',
            overflow: 'hidden',
          }}
        >
          {/* Fizz bubbles backdrop */}
          {BUBBLES.map((b, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: `${b.startY}%`,
                left: `${b.left}%`,
                width: b.size,
                height: b.size,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${active.glow}cc, ${active.glow}44)`,
                boxShadow: `0 0 ${b.size * 2}px ${active.glow}55`,
                '--drift': `${b.drift}px`,
                animation: `rise-bubble-full ${b.dur}s ease-out ${b.delay}s infinite`,
                pointerEvents: 'none',
              } as React.CSSProperties}
            />
          ))}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 480,
              width: '100%',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: `0 40px 120px ${active.glow}44, 0 0 0 1px ${active.glow}33`,
            }}
          >
            <Image
              src={`/posters/${active.poster}`}
              alt={`${active.name} campaign poster`}
              width={800}
              height={1200}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: `1px solid ${active.glow}44`,
                color: 'white', fontSize: '1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(6px)',
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
