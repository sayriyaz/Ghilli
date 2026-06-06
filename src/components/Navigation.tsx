'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const links = [
  { label: 'Story', id: 'story' },
  { label: 'Flavours', id: 'flavours' },
  { label: 'The Goli Pop', id: 'golipop' },
  { label: 'Bottle Flip', id: 'flip' },
  { label: 'Festival', id: 'festival' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [showTamil, setShowTamil] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const interval = window.setInterval(() => setShowTamil((current) => !current), 4200)
    return () => window.clearInterval(interval)
  }, [])

  // Deep link: scroll to the section in the URL hash on first load
  useEffect(() => {
    const id = window.location.hash.replace('#', '')
    if (!id) return
    const el = document.getElementById(id)
    if (el) window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 350)
  }, [])

  const scrollTo = (id: string) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth' })
    // Put the section in the URL so it's shareable, without a jump
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="Main navigation">
      <button
        className="brand-flip"
        onClick={() => {
          setShowTamil((current) => !current)
          scrollTo('hero')
        }}
        onMouseEnter={() => setShowTamil(true)}
        onMouseLeave={() => setShowTamil(false)}
        onFocus={() => setShowTamil(true)}
        onBlur={() => setShowTamil(false)}
        aria-label="Ghilli Goli Soda bilingual logo. Go to top."
      >
        <span className={`brand-flip-inner ${showTamil ? 'is-flipped' : ''}`}>
          <span className="brand-face brand-face-front">
            <Image src="/bottles/SODA LOGO.png" alt="" fill priority sizes="112px" />
          </span>
          <span className="brand-face brand-face-back">
            <Image src="/bottles/SODA LOGO tamil.png" alt="" fill priority sizes="112px" />
          </span>
        </span>
      </button>

      <div className="nav-links">
        {links.map((link) => (
          <button key={link.id} onClick={() => scrollTo(link.id)}>
            {link.label}
          </button>
        ))}
      </div>

      <button className="nav-dealer" onClick={() => scrollTo('dealer')}>
        Dealer enquiry
      </button>

      <button
        className={`nav-menu ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span />
        <span />
        <span />
      </button>

      <div id="mobile-navigation" className={`mobile-nav ${open ? 'is-open' : ''}`}>
        {links.map((link) => (
          <button key={link.id} onClick={() => scrollTo(link.id)}>
            {link.label}
          </button>
        ))}
        <button className="mobile-dealer" onClick={() => scrollTo('dealer')}>
          Dealer enquiry
        </button>
      </div>
    </nav>
  )
}
