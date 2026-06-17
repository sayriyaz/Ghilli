import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

// Stable bubble positions (no hydration mismatch) — lots of fizz
const BUBBLE_TINTS = ['136,170,255', '68,221,102', '255,134,28', '255,68,102', '246,189,24', '222,219,53']
const BUBBLES = Array.from({ length: 28 }, (_, i) => {
  const s = Math.sin(i * 99.7 + 12.3) * 43758.5
  const r = (n: number) => Math.abs(Math.sin(s + n))
  return {
    left: Math.round(r(1) * 100),
    size: 5 + Math.round(r(2) * 18),
    delay: (r(3) * 6).toFixed(2),
    dur: (4 + r(4) * 5).toFixed(2),
    tint: BUBBLE_TINTS[Math.floor(r(5) * BUBBLE_TINTS.length)],
  }
})

// Small flavour bottles drifting around the page
const FLOATERS = [
  { img: 'cola_bottle.png', top: 14, left: 12, size: 78, rot: -22, dur: 6.5, delay: 0 },
  { img: 'orange_bottle.png', top: 22, left: 82, size: 70, rot: 18, dur: 7.5, delay: 0.6 },
  { img: 'green_apple_bottle.png', top: 58, left: 8, size: 64, rot: 14, dur: 8, delay: 1.1 },
  { img: 'strawberry_bottle.png', top: 64, left: 86, size: 82, rot: -16, dur: 6.8, delay: 0.3 },
  { img: 'lemon_bottle.png', top: 40, left: 90, size: 56, rot: 26, dur: 9, delay: 1.6 },
  { img: 'pineapple_bottle.png', top: 78, left: 22, size: 60, rot: -10, dur: 7.2, delay: 0.9 },
  { img: 'paneer_bottle.png', top: 8, left: 60, size: 52, rot: 12, dur: 8.4, delay: 1.3 },
]

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
      {/* Rising fizz bubbles — colourful, constant rise = linear easing */}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          aria-hidden
          className="fizz-404"
          style={{
            position: 'absolute',
            bottom: -30,
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            border: `1px solid rgba(${b.tint},0.5)`,
            boxShadow: `inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 6px rgba(${b.tint},0.3)`,
            animation: `four-oh-four-bubble ${b.dur}s linear ${b.delay}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Floating flavour bottles — the whole crew, hover to jiggle */}
      {FLOATERS.map((f) => (
        <div
          key={f.img}
          aria-hidden
          className="floater-404"
          style={{
            position: 'absolute',
            top: `${f.top}%`,
            left: `${f.left}%`,
            width: f.size,
            height: f.size * 2.4,
            ['--rot' as string]: `${f.rot}deg`,
            transform: `rotate(${f.rot}deg)`,
            opacity: 0.85,
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.45))',
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
            cursor: 'pointer',
          }}
        >
          <Image src={`/nobg/${f.img}`} alt="" fill style={{ objectFit: 'contain' }} />
        </div>
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
        className="four-oh-four-bottle"
        style={{
          position: 'relative',
          width: 120,
          height: 270,
          marginBottom: '2rem',
          transform: 'rotate(-18deg)',
          filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.5))',
          animation: 'four-oh-four-wobble 4s ease-in-out infinite',
          willChange: 'transform',
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
