'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const storyBeats = [
  {
    icon: '☀️',
    title: 'A Village Summer',
    body: 'Dust roads. Mango trees. The distant hiss of a soda cart. Every Indian childhood has a moment where a cold banta changed everything.',
    accent: '#ffaa44',
  },
  {
    icon: '🏏',
    title: 'Tea Shops & Cricket Lanes',
    body: 'Between overs. After school. Before exams. Goli soda was never just a drink — it was a pause. A reward. A ritual.',
    accent: '#44aaff',
  },
  {
    icon: '💎',
    title: 'Reimagined for Today',
    body: 'Ghilli takes that nostalgia and gives it a premium edge. Same marble pop magic. New flavours. Glass-clear quality. Bold Indian soul.',
    accent: '#d4af37',
  },
  {
    icon: '🌟',
    title: 'Eight Flavours. One Spirit.',
    body: 'From the deep fizz of cola to the tropical bliss of pineapple — every Ghilli bottle carries that childhood memory forward.',
    accent: '#ff44aa',
  },
]

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const beatsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    beatsRef.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    const heading = sectionRef.current?.querySelector('.story-heading')
    if (heading) {
      gsap.fromTo(
        heading,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 85%' },
        }
      )
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <section
      id="story"
      ref={sectionRef}
      style={{
        padding: '10rem 5vw',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #060810 50%, #0a0e1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background texture lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255,255,255,0.01) 100px, rgba(255,255,255,0.01) 101px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading */}
        <div className="story-heading" style={{ opacity: 0, marginBottom: '6rem' }}>
          <p style={{
            color: '#d4af37',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontWeight: 600,
          }}>
            Our Story
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'white' }}>The Indian Goli Soda</span>
            <br />
            <span className="gradient-gold">Reimagined.</span>
          </h2>
          <p style={{
            marginTop: '1.5rem',
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 500,
            lineHeight: 1.7,
          }}>
            Born from nostalgia. Built for the bold. Ghilli is where Indian heritage meets modern craft.
          </p>
        </div>

        {/* Story beats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {storyBeats.map((beat, i) => (
            <div
              key={i}
              ref={(el) => { beatsRef.current[i] = el }}
              style={{
                opacity: 0,
                display: 'flex',
                gap: '2.5rem',
                alignItems: 'flex-start',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              }}
            >
              {/* Icon bubble */}
              <div style={{
                flexShrink: 0,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${beat.accent}22, transparent)`,
                border: `1px solid ${beat.accent}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}>
                {beat.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'left' : 'right', maxWidth: 500 }}>
                <div style={{
                  display: 'inline-block',
                  width: 40,
                  height: 2,
                  background: beat.accent,
                  marginBottom: '1rem',
                  borderRadius: 2,
                }} />
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'white',
                  marginBottom: '0.75rem',
                  lineHeight: 1.15,
                }}>
                  {beat.title}
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.75,
                  fontSize: '1.05rem',
                }}>
                  {beat.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
