'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BOTTLES = [
  '/flip/blueberry.png',
  '/flip/cola.png',
  '/flip/greenapple.png',
  '/flip/lemon.png',
  '/flip/orange.png',
  '/flip/paneer.png',
  '/flip/pineapple.png',
  '/flip/strawberry.png',
]

// Physics constants (px, seconds, degrees)
const GRAVITY = 2000
const MAX_VY = 1000
const MAX_VROT = 1000
const UPRIGHT_TOL = 28 // degrees from upright counted as landed

// Total rotation at landing = power^2 * K  (flightTime = power, vrot = power*MAX_VROT)
const ROT_K = MAX_VROT * (2 * MAX_VY / GRAVITY)

// Sweet spots: power values where rotation = n*360 (one/two full flips)
const SWEET_SPOTS = [1, 2]
  .map((n) => {
    const center = Math.sqrt((n * 360) / ROT_K)
    if (center > 1) return null
    const slope = 2 * center * ROT_K            // d(rotation)/d(power)
    const half = UPRIGHT_TOL / slope            // power tolerance around center
    return { n, center, half }
  })
  .filter((b): b is { n: number; center: number; half: number } => b !== null)

type Phase = 'ready' | 'charging' | 'flying' | 'win' | 'fail'

export default function BottleFlipSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)
  const meterRef = useRef<HTMLDivElement>(null)
  const bandRefs = useRef<(HTMLDivElement | null)[]>([])

  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [bottleIdx, setBottleIdx] = useState(0)
  const [msg, setMsg] = useState('Hold to charge • Release to flip')
  const [sound, setSound] = useState(true)
  const soundRef = useRef(true)

  // --- Web Audio SFX (synthesized, no asset files) ---
  const audioRef = useRef<AudioContext | null>(null)
  const chargeOscRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null)

  const getCtx = () => {
    if (!soundRef.current) return null
    if (!audioRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioRef.current = new AC()
    }
    if (audioRef.current.state === 'suspended') audioRef.current.resume()
    return audioRef.current
  }

  const startChargeTone = () => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.05)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    chargeOscRef.current = { osc, gain }
  }

  const updateChargeTone = (p: number) => {
    const c = chargeOscRef.current
    const ctx = audioRef.current
    if (!c || !ctx) return
    c.osc.frequency.setTargetAtTime(180 + p * 620, ctx.currentTime, 0.02)
  }

  const stopChargeTone = () => {
    const c = chargeOscRef.current
    const ctx = audioRef.current
    if (!c || !ctx) return
    c.gain.gain.cancelScheduledValues(ctx.currentTime)
    c.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03)
    c.osc.stop(ctx.currentTime + 0.12)
    chargeOscRef.current = null
  }

  const playWhoosh = () => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(760, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.32)
    gain.gain.setValueAtTime(0.14, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.34)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.36)
  }

  const playWin = () => {
    const ctx = getCtx()
    if (!ctx) return
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((f, i) => {
      const t = ctx.currentTime + i * 0.08
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.24)
    })
  }

  // Short filtered noise burst — the "tk" of glass/cap hitting ground
  const noiseHit = (ctx: AudioContext, t: number, freq: number, q: number, vol: number, dur: number) => {
    const len = Math.ceil(ctx.sampleRate * dur)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
    const src = ctx.createBufferSource()
    src.buffer = buf
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = freq
    bp.Q.value = q
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(bp).connect(gain).connect(ctx.destination)
    src.start(t)
    src.stop(t + dur)
  }

  // Low body "thunk" of the bottle mass hitting ground
  const bodyThud = (ctx: AudioContext, t: number, freq: number, vol: number, dur: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + dur)
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  // Upright landing: glass cap tap + soft body thunk, scaled by impact (0..1)
  const playGlassTap = (impact: number) => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const v = 0.08 + impact * 0.22
    bodyThud(ctx, t, 150, v, 0.12)
    noiseHit(ctx, t, 2600, 6, v * 0.9, 0.05)   // glass click
    noiseHit(ctx, t + 0.012, 4200, 8, v * 0.4, 0.03) // bright shimmer
  }

  // Tip-over: heavy thud then wobble taps decaying to rest (bottle rocking on its side)
  const playRollOver = (impact: number) => {
    const ctx = getCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const v = 0.1 + impact * 0.24
    // Initial impact
    bodyThud(ctx, t0, 120, v, 0.22)
    noiseHit(ctx, t0, 1400, 3, v * 0.7, 0.08)
    // Wobble: bottle rocks, each contact softer & faster (damped)
    let t = t0 + 0.16
    let amp = v * 0.6
    let gap = 0.14
    for (let i = 0; i < 5 && amp > 0.02; i++) {
      bodyThud(ctx, t, 110 - i * 6, amp, 0.1)
      noiseHit(ctx, t, 1200 + i * 120, 4, amp * 0.5, 0.04)
      amp *= 0.62
      gap *= 0.78
      t += gap
    }
  }

  // Mutable game state
  const st = useRef({
    phase: 'ready' as Phase,
    power: 0,
    powerDir: 1,
    y: 0,
    vy: 0,
    rot: 0,
    vrot: 0,
    last: 0,
    raf: 0,
  })

  const setBottleTransform = (y: number, rot: number) => {
    if (bottleRef.current) {
      gsap.set(bottleRef.current, { y: -y, rotation: rot })
    }
  }

  const setMeter = (p: number) => {
    if (meterRef.current) meterRef.current.style.height = `${p * 100}%`
    // Light up the sweet-spot band the marker is currently inside
    SWEET_SPOTS.forEach((b, i) => {
      const el = bandRefs.current[i]
      if (!el) return
      const inside = Math.abs(p - b.center) <= b.half
      el.style.opacity = inside ? '1' : '0.4'
      el.style.boxShadow = inside ? '0 0 16px #44dd66, 0 0 6px #44dd66' : 'none'
    })
  }

  const loop = useCallback((t: number) => {
    const s = st.current
    if (!s.last) s.last = t
    const dt = Math.min((t - s.last) / 1000, 0.032)
    s.last = t

    if (s.phase === 'charging') {
      // Triangle oscillation 0..1..0
      s.power += s.powerDir * dt * 1.4
      if (s.power >= 1) { s.power = 1; s.powerDir = -1 }
      if (s.power <= 0) { s.power = 0; s.powerDir = 1 }
      setMeter(s.power)
      updateChargeTone(s.power)
      s.raf = requestAnimationFrame(loop)
    } else if (s.phase === 'flying') {
      s.y += s.vy * dt
      s.vy -= GRAVITY * dt
      s.rot += s.vrot * dt
      if (s.y <= 0 && s.vy < 0) {
        // Landed — impact strength from downward speed
        s.y = 0
        const impact = Math.min(Math.abs(s.vy) / MAX_VY, 1)
        const norm = ((s.rot % 360) + 360) % 360
        const upright = norm <= UPRIGHT_TOL || norm >= 360 - UPRIGHT_TOL
        if (upright) {
          setBottleTransform(0, 0)
          land(true, 0, impact)
        } else {
          // Snap to nearest fall side for natural rest
          const fallTo = norm < 180 ? 90 : -90
          land(false, fallTo, impact)
        }
        return
      }
      setBottleTransform(s.y, s.rot)
      s.raf = requestAnimationFrame(loop)
    }
  }, [])

  const land = (success: boolean, fallTo = 0, impact = 0.5) => {
    const s = st.current
    s.phase = success ? 'win' : 'fail'
    setPhase(s.phase)

    if (success) {
      setScore((prev) => {
        const next = prev + 1
        setBest((b) => Math.max(b, next))
        return next
      })
      setMsg('Perfect landing! 🔥')
      playGlassTap(impact) // ground contact
      playWin()
      // Bounce celebrate
      gsap.fromTo(bottleRef.current,
        { scale: 1 },
        { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
      )
      // Next bottle after short delay
      setTimeout(() => {
        setBottleIdx((i) => (i + 1) % BOTTLES.length)
        resetReady()
      }, 850)
    } else {
      setMsg('Tipped over! Streak reset.')
      playRollOver(impact)
      // Tip-over animation
      gsap.to(bottleRef.current, {
        rotate: fallTo,
        duration: 0.35,
        ease: 'bounce.out',
        transformOrigin: '50% 88%',
      })
      setScore(0)
      setTimeout(resetReady, 1100)
    }
  }

  const resetReady = () => {
    const s = st.current
    s.phase = 'ready'; s.power = 0; s.powerDir = 1
    s.y = 0; s.vy = 0; s.rot = 0; s.vrot = 0; s.last = 0
    setPhase('ready')
    setMsg('Hold to charge • Release to flip')
    setMeter(0)
    gsap.set(bottleRef.current, { y: 0, rotation: 0, scale: 1, transformOrigin: '50% 88%' })
  }

  const startCharge = useCallback(() => {
    const s = st.current
    if (s.phase !== 'ready') return
    s.phase = 'charging'; s.power = 0; s.powerDir = 1; s.last = 0
    setPhase('charging')
    setMsg('Release!')
    startChargeTone()
    s.raf = requestAnimationFrame(loop)
  }, [loop])

  const release = useCallback(() => {
    const s = st.current
    if (s.phase !== 'charging') return
    cancelAnimationFrame(s.raf)
    stopChargeTone()
    const p = s.power
    if (p < 0.12) { resetReady(); return } // too weak, no flip
    playWhoosh()
    s.vy = p * MAX_VY
    s.vrot = p * MAX_VROT
    s.phase = 'flying'; s.last = 0
    setPhase('flying')
    setMsg('')
    setMeter(0)
    s.raf = requestAnimationFrame(loop)
  }, [loop])

  // Heading + entrance animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    gsap.fromTo(headingRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
    )
    gsap.fromTo(stageRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: stageRef.current, start: 'top 80%' } }
    )
    return () => {
      cancelAnimationFrame(st.current.raf)
      audioRef.current?.close().catch(() => {})
    }
  }, [])

  // Keyboard support (spacebar)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        startCharge()
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); release() }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [startCharge, release])

  return (
    <section
      id="flip"
      ref={sectionRef}
      style={{
        padding: '10rem 5vw',
        background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #0d1b3e 0%, #0a0e1a 55%, #000 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading */}
        <div ref={headingRef} style={{ opacity: 0, textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#d4af37', fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
            Play & Win
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            <span style={{ color: 'white' }}>Bottle</span> <span className="gradient-gold">Flip</span>
          </h2>
          <p style={{ marginTop: '1.5rem', fontSize: '1.05rem', color: 'rgba(255,255,255,0.45)' }}>
            Hold to charge power. Release to flip. Land it upright. Build your streak.
          </p>
        </div>

        {/* Score bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2rem' }}>
          <Stat label="Streak" value={score} accent="#4488ff" />
          <Stat label="Best" value={best} accent="#d4af37" />
        </div>

        {/* Game stage */}
        <div
          ref={stageRef}
          onPointerDown={(e) => { e.preventDefault(); startCharge() }}
          onPointerUp={(e) => { e.preventDefault(); release() }}
          onPointerLeave={() => { if (st.current.phase === 'charging') release() }}
          style={{
            opacity: 0,
            position: 'relative',
            maxWidth: 460,
            height: 520,
            margin: '0 auto',
            borderRadius: '28px',
            background: 'linear-gradient(180deg, rgba(68,136,255,0.06), rgba(0,0,0,0.2))',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Sound toggle */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              const next = !sound
              setSound(next)
              soundRef.current = next
              if (!next) stopChargeTone()
            }}
            title={sound ? 'Sound on' : 'Sound off'}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 5,
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)',
            }}
          >
            {sound ? '🔊' : '🔇'}
          </button>

          {/* Power meter (left) */}
          <div style={{
            position: 'absolute', left: 20, bottom: 90, top: 40,
            width: 18, borderRadius: '9px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          }}>
            {/* Fill */}
            <div ref={meterRef} style={{
              width: '100%', height: '0%',
              background: 'linear-gradient(180deg, #ff4466, #f0d060, #44dd66)',
              borderRadius: '9px',
              transition: 'none',
            }} />
            {/* Sweet-spot bands */}
            {SWEET_SPOTS.map((b, i) => (
              <div
                key={b.n}
                ref={(el) => { bandRefs.current[i] = el }}
                style={{
                  position: 'absolute', left: 0, right: 0,
                  bottom: `${(b.center - b.half) * 100}%`,
                  height: `${Math.max(b.half * 2 * 100, 4)}%`,
                  background: 'rgba(68,221,102,0.55)',
                  borderTop: '1px solid #44dd66',
                  borderBottom: '1px solid #44dd66',
                  opacity: 0.4,
                  pointerEvents: 'none',
                  transition: 'opacity 0.05s, box-shadow 0.05s',
                }}
              />
            ))}
          </div>

          {/* Sweet-spot labels */}
          {SWEET_SPOTS.map((b) => (
            <div
              key={b.n}
              style={{
                position: 'absolute', left: 44,
                bottom: `calc(90px + (100% - 130px) * ${b.center})`,
                transform: 'translateY(50%)',
                fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em',
                color: '#44dd66', whiteSpace: 'nowrap', pointerEvents: 'none',
                textShadow: '0 0 8px rgba(0,0,0,0.6)',
              }}
            >
              ◄ {b.n === 1 ? '1 FLIP' : `${b.n} FLIPS`}
            </div>
          ))}

          {/* Platform / ground */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 80, height: 4,
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
          }} />
          <div style={{
            position: 'absolute', left: '50%', bottom: 56, transform: 'translateX(-50%)',
            width: 130, height: 18, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(68,136,255,0.25), transparent 70%)',
            filter: 'blur(2px)',
          }} />

          {/* Bottle */}
          <div
            ref={bottleRef}
            style={{
              position: 'absolute',
              left: '50%', bottom: 82,
              width: 110, height: 300,
              marginLeft: -55,
              transformOrigin: '50% 88%',
              willChange: 'transform',
            }}
          >
            <Image
              src={BOTTLES[bottleIdx]}
              alt="Ghilli bottle"
              fill
              priority
              style={{ objectFit: 'contain', pointerEvents: 'none' }}
            />
          </div>

          {/* Status message */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center',
            fontSize: '0.95rem', fontWeight: 700,
            color: phase === 'win' ? '#44dd66' : phase === 'fail' ? '#ff6666' : 'rgba(255,255,255,0.55)',
            letterSpacing: '0.03em',
            transition: 'color 0.2s',
          }}>
            {msg}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          Tip: release when the meter hits a <span style={{ color: '#44dd66', fontWeight: 700 }}>green zone</span> — it lights up at the sweet spot. Spacebar works too.
        </p>
      </div>
    </section>
  )
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  )
}
