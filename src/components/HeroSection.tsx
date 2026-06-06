'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

const flavours = [
  { id: 'blueberry', name: 'Blueberry', image: '/hero-bottles/blueberry.webp', color: '#1677ff', glow: '22, 119, 255' },
  { id: 'orange', name: 'Orange', image: '/hero-bottles/orange.webp', color: '#ff861c', glow: '255, 134, 28' },
  { id: 'cola', name: 'Cola', image: '/hero-bottles/cola.webp', color: '#9b4b19', glow: '155, 75, 25' },
  { id: 'strawberry', name: 'Strawberry', image: '/hero-bottles/strawberry.webp', color: '#e82a42', glow: '232, 42, 66' },
  { id: 'greenapple', name: 'Green Apple', image: '/hero-bottles/greenapple.webp', color: '#85bd18', glow: '133, 189, 24' },
  { id: 'pineapple', name: 'Pineapple', image: '/hero-bottles/pineapple.webp', color: '#f6bd18', glow: '246, 189, 24' },
  { id: 'lemon', name: 'Lemon Mojito', image: '/hero-bottles/lemon.webp', color: '#dedb35', glow: '222, 219, 53' },
  { id: 'paneer', name: 'Paneer', image: '/hero-bottles/paneer.webp', color: '#e9edf1', glow: '233, 237, 241' },
] as const

function getBottleSlot(index: number, activeIndex: number) {
  const relative = (index - activeIndex + flavours.length) % flavours.length
  return relative > 4 ? relative - flavours.length : relative
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const activeFlavour = flavours[activeIndex]

  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        left: `${8 + ((index * 29) % 86)}%`,
        top: `${10 + ((index * 43) % 75)}%`,
        size: 4 + (index % 5) * 3,
        delay: `${(index % 6) * -0.7}s`,
        duration: `${4.5 + (index % 4)}s`,
      })),
    []
  )

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.35, defaults: { ease: 'power3.out' } })
      timeline
        .fromTo('.hero-kicker', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo('.hero-title-line', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.2')
        .fromTo('.hero-support', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.35')
        .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, '-=0.35')
        .fromTo(stageRef.current, { x: 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85 }, '-=0.8')
        .fromTo(
          '.hero-bottle img',
          { y: 90, opacity: 0, scale: 0.88 },
          { y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.07, ease: 'back.out(1.25)' },
          '-=0.62'
        )
        .fromTo('.flavour-rail', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.45')

      gsap.to('.hero-bottle img', {
        y: -9,
        duration: 2.4,
        delay: 2.6,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.11, from: 'center' },
        ease: 'sine.inOut',
      })
    }, heroRef)

    return () => context.revert()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-shell"
      style={{ '--hero-accent': activeFlavour.color, '--hero-glow': activeFlavour.glow } as React.CSSProperties}
    >
      <div className="hero-blue-field" aria-hidden="true" />
      <div className="hero-marble-ring" aria-hidden="true" />
      <div className="hero-bubbles" aria-hidden="true">
        {bubbles.map((bubble, index) => (
          <span
            key={index}
            style={{
              left: bubble.left,
              top: bubble.top,
              width: bubble.size,
              height: bubble.size,
              animationDelay: bubble.delay,
              animationDuration: bubble.duration,
            }}
          />
        ))}
      </div>

      <div className="hero-main">
        <div ref={copyRef} className="hero-copy">
          <p className="hero-kicker">The Indian Goli Soda · Reimagined</p>
          <h1 className="hero-title">
            <span className="hero-title-line">8 Flavours.</span>
            <span className="hero-title-line hero-title-gold">One Legendary</span>
            <span className="hero-title-line">Pop.</span>
          </h1>
          <p className="hero-support">
            India&apos;s iconic marble soda, crafted with real flavours and that unmistakable pop.
            Open a little nostalgia. Share a lot of joy.
          </p>
          <div className="hero-actions">
            <button className="hero-primary" onClick={() => scrollTo('flavours')}>
              Explore all 8 flavours
            </button>
            <button className="hero-secondary" onClick={() => scrollTo('golipop')}>
              Hear the pop
            </button>
          </div>
          <div className="hero-origin">
            <span>Made in India</span>
            <span aria-hidden="true" className="hero-origin-rule" />
            <span>Tear · Press · Pop</span>
          </div>
        </div>

        <div ref={stageRef} className="hero-stage" aria-live="polite">
          <p className="hero-stage-label">
            Now pouring <strong>{activeFlavour.name}</strong>
          </p>
          <div className="bottle-stage">
            {flavours.map((flavour, index) => {
              const slot = getBottleSlot(index, activeIndex)
              const distance = Math.abs(slot)
              return (
                <button
                  key={flavour.id}
                  className={`hero-bottle ${slot === 0 ? 'is-active' : ''}`}
                  style={{
                    '--slot': slot,
                    '--distance': distance,
                    '--bottle-color': flavour.color,
                    zIndex: 20 - distance,
                  } as React.CSSProperties}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Feature ${flavour.name} flavour`}
                  aria-pressed={slot === 0}
                >
                  <Image
                    src={flavour.image}
                    alt={`${flavour.name} Ghilli Goli Soda bottle`}
                    fill
                    unoptimized
                    loading="eager"
                    sizes="(max-width: 760px) 46vw, (max-width: 1100px) 22vw, 14vw"
                    style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                  />
                </button>
              )
            })}
          </div>
          <div className="hero-reflection" aria-hidden="true" />
        </div>
      </div>

      <div className="flavour-rail" role="tablist" aria-label="Choose a Ghilli flavour">
        {flavours.map((flavour, index) => (
          <button
            key={flavour.id}
            role="tab"
            aria-selected={activeIndex === index}
            className={activeIndex === index ? 'is-active' : ''}
            onClick={() => setActiveIndex(index)}
          >
            <span style={{ backgroundColor: flavour.color }} aria-hidden="true" />
            {flavour.name}
          </button>
        ))}
      </div>
    </section>
  )
}
