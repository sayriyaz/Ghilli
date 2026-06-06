'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; size: number
  color: string; decay: number
}

function runPopAnimation(canvas: HTMLCanvasElement, cx: number, cy: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const particles: Particle[] = []
  const colors = ['#4488ff', '#88aaff', '#aaccff', '#d4af37', '#f0d060', '#ffffff', '#ccddff']
  for (let i = 0; i < 220; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 14
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + (i < 100 ? -10 : 0),
      life: 1,
      size: 2 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      decay: 0.01 + Math.random() * 0.016,
    })
  }
  let rafId: number
  function step() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false
    for (const p of particles) {
      if (p.life <= 0) continue
      alive = true
      p.x += p.vx; p.y += p.vy
      p.vy += 0.22; p.vx *= 0.98
      p.life -= p.decay; p.size *= 0.99
      ctx!.save()
      ctx!.globalAlpha = Math.max(0, p.life)
      ctx!.fillStyle = p.color
      ctx!.shadowColor = p.color
      ctx!.shadowBlur = 8
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2)
      ctx!.fill()
      ctx!.restore()
    }
    if (alive) rafId = requestAnimationFrame(step)
  }
  step()
  return () => cancelAnimationFrame(rafId)
}

export default function GoliPopSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bottleWrapRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const marbleRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [popped, setPopped] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    gsap.fromTo(headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 80%' } }
    )
    gsap.fromTo(bottleWrapRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: bottleWrapRef.current, start: 'top 75%' } }
    )
    gsap.set(videoWrapRef.current, { opacity: 0, scale: 0.9, pointerEvents: 'none' })
  }, [])

  const resize = () => {
    if (!canvasRef.current || !sectionRef.current) return
    canvasRef.current.width = sectionRef.current.offsetWidth
    canvasRef.current.height = sectionRef.current.offsetHeight
  }
  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const handlePop = () => {
    if (popped) return
    setPopped(true)

    // Start video immediately within user gesture window (before GSAP callbacks)
    // Click is a user gesture → unmuted autoplay allowed
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.muted = false
      videoRef.current.play().catch(() => {
        // Fallback: if browser still blocks audio, retry muted
        if (videoRef.current) {
          videoRef.current.muted = true
          setMuted(true)
          videoRef.current.play().catch(() => {})
        }
      })
    }

    // Marble flies
    gsap.to(marbleRef.current, {
      y: -350, x: 30, scale: 0, opacity: 0,
      duration: 0.65, ease: 'power4.out',
    })

    // Particle burst
    if (canvasRef.current && sectionRef.current && bottleWrapRef.current) {
      const sRect = sectionRef.current.getBoundingClientRect()
      const bRect = bottleWrapRef.current.getBoundingClientRect()
      runPopAnimation(canvasRef.current,
        bRect.left - sRect.left + bRect.width / 2,
        bRect.top - sRect.top + bRect.height * 0.1
      )
    }

    // Crossfade bottle → video
    gsap.to(bottleWrapRef.current, {
      opacity: 0, scale: 1.06, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        gsap.set(bottleWrapRef.current, { pointerEvents: 'none' })
        gsap.to(videoWrapRef.current, {
          opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out',
          onStart: () => {
            gsap.set(videoWrapRef.current, { pointerEvents: 'auto' })
          },
        })
      },
    })
  }

  const handleVideoEnd = () => {
    // Fade back to bottle
    gsap.to(videoWrapRef.current, {
      opacity: 0, scale: 0.92, duration: 0.5, ease: 'power2.in',
      onComplete: () => {
        gsap.set(videoWrapRef.current, { pointerEvents: 'none' })
        gsap.set(marbleRef.current, { y: 0, x: 0, scale: 1, opacity: 1 })
        gsap.to(bottleWrapRef.current, {
          opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out',
          onStart: () => gsap.set(bottleWrapRef.current, { pointerEvents: 'auto' }),
        })
        setPopped(false)
        setMuted(false)
        if (videoRef.current) { videoRef.current.currentTime = 0 }
      },
    })
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  return (
    <section
      id="golipop"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '10rem 5vw',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #0d1b3e 0%, #0a0e1a 60%, #000 100%)',
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }} />

      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%',
        display: 'flex', gap: '5rem', alignItems: 'center',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {/* Text */}
        <div ref={headingRef} style={{ opacity: 0, flex: '1 1 300px', maxWidth: 480 }}>
          <p style={{ color: '#d4af37', fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
            The Signature Experience
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.02em', color: 'white', marginBottom: '1.5rem' }}>
            Pop the<br /><span className="gradient-gold">Goli.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2rem' }}>
            The marble sits at the top. You push it in. It drops. The fizz shoots up. That one second — that&apos;s Ghilli.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {['Push', 'Pop', 'Fizz'].map((step, i) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, color: '#d4af37', marginBottom: '0.5rem',
                }}>{i + 1}</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: bottle + video stacked */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10 }}>

          {/* Glow ring */}
          <div style={{
            position: 'absolute', width: 340, height: 340, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(68,136,255,0.1) 0%, transparent 70%)',
            animation: 'glow-pulse 3s ease-in-out infinite', pointerEvents: 'none',
          }} />

          {/* Stacked: bottle (before) / video (after) */}
          <div style={{ position: 'relative', width: 280, minHeight: 480 }}>

            {/* Closed bottle */}
            <div
              ref={bottleWrapRef}
              onClick={handlePop}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer', userSelect: 'none', opacity: 0,
              }}
            >
              {/* Marble */}
              <div ref={marbleRef} style={{
                position: 'absolute', top: 28, left: '50%',
                transform: 'translateX(-50%)',
                width: 24, height: 24, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #88aaff, #1a3a7c)',
                boxShadow: '0 0 16px #4488ffaa', zIndex: 5,
                animation: 'ping-soft 2s ease-in-out infinite',
              }} />
              <Image
                src="/nobg/new_blueberry.png"
                alt="Ghilli Goli Soda"
                width={200}
                height={440}
                style={{ objectFit: 'contain' }}
                priority
              />
              <button
                className="btn-gold"
                style={{ marginTop: '1.5rem', padding: '0.9rem 2.5rem', borderRadius: '50px', fontSize: '1rem', letterSpacing: '0.05em' }}
              >
                Click to Pop! →
              </button>
              <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                Feel the pop.
              </p>
            </div>

            {/* Video reveal */}
            <div
              ref={videoWrapRef}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 60px rgba(68,136,255,0.3)' }}>
                <video
                  ref={videoRef}
                  src="/brand/ghilli_ad.mp4"
                  playsInline
                  onEnded={handleVideoEnd}
                  style={{ display: 'block', width: 280, borderRadius: '16px' }}
                />
                {/* Mute toggle */}
                <button
                  onClick={toggleMute}
                  style={{
                    position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white', cursor: 'pointer', fontSize: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    transition: 'background 0.2s',
                  }}
                  title={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? '🔇' : '🔊'}
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.04em', animation: 'fadeInUp 0.4s ease-out' }}>
                  <span className="gradient-gold">FIZZZZ! 🎉</span>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
                  The Ghilli experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
