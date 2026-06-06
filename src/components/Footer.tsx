'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const INSTAGRAM = 'https://www.instagram.com/iamgillisoda/'
const FACEBOOK = 'https://www.facebook.com/iamgillisoda'

type Link = { label: string; scroll?: string; href?: string }

const links: Record<string, Link[]> = {
  Brand: [
    { label: 'Our Story', scroll: 'story' },
    { label: 'Flavours', scroll: 'flavours' },
    { label: 'The Goli Pop', scroll: 'golipop' },
    { label: 'Bottle Flip', scroll: 'flip' },
    { label: 'Festival', scroll: 'festival' },
  ],
  Business: [
    { label: 'Become a Dealer', scroll: 'dealer' },
    { label: 'Bulk Orders', scroll: 'dealer' },
    { label: 'Events & Catering', scroll: 'dealer' },
  ],
  Connect: [
    { label: 'Instagram', href: INSTAGRAM },
    { label: 'Facebook', href: FACEBOOK },
    { label: 'Contact Us', scroll: 'dealer' },
  ],
}

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Footer() {
  const [showTamil, setShowTamil] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const interval = window.setInterval(() => setShowTamil((c) => !c), 4200)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <footer style={{
      background: '#050810',
      borderTop: '1px solid rgba(212,175,55,0.08)',
      padding: '5rem 5vw 3rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem',
        }}>
          {/* Brand */}
          <div>
            <button
              className="footer-flip"
              onClick={() => setShowTamil((c) => !c)}
              onMouseEnter={() => setShowTamil(true)}
              onMouseLeave={() => setShowTamil(false)}
              onFocus={() => setShowTamil(true)}
              onBlur={() => setShowTamil(false)}
              aria-label="Ghilli Goli Soda bilingual logo"
            >
              <span className={`brand-flip-inner ${showTamil ? 'is-flipped' : ''}`}>
                <span className="brand-face brand-face-front">
                  <Image src="/bottles/SODA LOGO.png" alt="" fill sizes="128px" />
                </span>
                <span className="brand-face brand-face-back">
                  <Image src="/bottles/SODA LOGO tamil.png" alt="" fill sizes="128px" />
                </span>
              </span>
            </button>
            <p style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.875rem',
              lineHeight: 1.75,
              maxWidth: 240,
            }}>
              Refreshing in Every Sip. Made by Oasis Food &amp; Beverages, Pudukkottai, Tamil Nadu.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {['+91 99449 19449', '+91 93444 19991', 'oasisfoodbeverag@gmail.com'].map((c) => (
                <p key={c} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', letterSpacing: '0.02em' }}>{c}</p>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {[{ icon: '📸', href: INSTAGRAM, label: 'Instagram' }, { icon: '👍', href: FACEBOOK, label: 'Facebook' }].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#d4af37',
                marginBottom: '1.25rem',
              }}>
                {group}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'flex-start' }}>
                {items.map((item) => {
                  const style = {
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textAlign: 'left' as const,
                    textDecoration: 'none',
                    padding: 0,
                    transition: 'color 0.2s',
                    fontWeight: 400,
                  }
                  const enter = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = 'white')
                  const leave = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')
                  return item.href ? (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                      style={style} onMouseEnter={enter} onMouseLeave={leave}>
                      {item.label}
                    </a>
                  ) : (
                    <button key={item.label} onClick={() => item.scroll && scrollTo(item.scroll)}
                      style={style} onMouseEnter={enter} onMouseLeave={leave}>
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Gold divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)',
          marginBottom: '2rem',
        }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
            © 2025 Oasis Food &amp; Beverages. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
            Made with ❤️ in Pudukkottai, Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  )
}
