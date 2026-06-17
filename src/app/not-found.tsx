import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

// Stable bubble positions (no hydration mismatch)
const BUBBLES = Array.from({ length: 16 }, (_, i) => {
  const s = Math.sin(i * 99.7 + 12.3) * 43758.5
  const r = (n: number) => Math.abs(Math.sin(s + n))
  return {
    left: Math.round(r(1) * 100),
    size: 6 + Math.round(r(2) * 16),
    delay: (r(3) * 5).toFixed(2),
    dur: (5 + r(4) * 5).toFixed(2),
  }
})

export default function NotFound() {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 80% 60% at 50% 35%, #0d1b3e 0%, #0a0e1a 55%, #000 100%)',
      }}
    >
      {/* Rising fizz bubbles */}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -30,
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            border: '1px solid rgba(136,170,255,0.4)',
            boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.25)',
            animation: `four-oh-four-bubble ${b.dur}s ease-in ${b.delay}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Glow ring behind bottle */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(68,136,255,0.14) 0%, transparent 70%)',
          animation: 'glow-pulse 3.5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Tilted "tipped over" bottle */}
      <div
        style={{
          position: 'relative',
          width: 120,
          height: 270,
          marginBottom: '2rem',
          transform: 'rotate(-18deg)',
          filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.5))',
          animation: 'four-oh-four-wobble 4s ease-in-out infinite',
        }}
      >
        <Image
          src="/nobg/new_blueberry.png"
          alt="Tipped-over Ghilli bottle"
          fill
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>

      <h1
        className="gradient-gold"
        style={{
          fontSize: 'clamp(4.5rem, 16vw, 9rem)',
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
          marginBottom: '0.5rem',
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
          fontWeight: 800,
          color: 'white',
          marginBottom: '0.9rem',
        }}
      >
        This fizz went flat.
      </h2>

      <p
        style={{
          maxWidth: 440,
          color: 'rgba(255,255,255,0.5)',
          fontSize: '1rem',
          lineHeight: 1.7,
          marginBottom: '2.25rem',
        }}
      >
        The marble rolled away and took this page with it. No pop here — but
        there are 8 flavours waiting back home.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '0.9rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link
          href="/"
          className="btn-gold"
          style={{
            padding: '0.9rem 2.2rem',
            borderRadius: '50px',
            fontSize: '0.95rem',
            letterSpacing: '0.04em',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          Pop back home →
        </Link>
        <Link
          href="/#flavours"
          style={{
            padding: '0.9rem 2.2rem',
            borderRadius: '50px',
            fontSize: '0.95rem',
            letterSpacing: '0.04em',
            textDecoration: 'none',
            color: '#f1c551',
            border: '1px solid rgba(232,185,67,0.5)',
            background: 'rgba(2,5,10,0.35)',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          See the flavours
        </Link>
      </div>

      <p
        style={{
          marginTop: '3rem',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
        }}
      >
        Ghilli Goli Soda · Refreshing in Every Sip
      </p>
    </main>
  )
}
