import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, phone, business, city } = await req.json()

  if (!name || !phone || !city) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Gmail App Password (not your login password)
    },
  })

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0e1a;color:white;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#d4af37,#f0d060);padding:1.5rem 2rem;">
        <h2 style="margin:0;color:#0a0e1a;font-size:1.4rem;font-weight:900;">🥤 New Dealer Enquiry</h2>
        <p style="margin:0.25rem 0 0;color:#0a0e1acc;font-size:0.85rem;">Ghilli Goli Soda</p>
      </div>
      <div style="padding:2rem;display:flex;flex-direction:column;gap:1rem;">
        ${[
          ['Name', name],
          ['Phone', phone],
          ['Business', business || '—'],
          ['City', city],
        ].map(([label, val]) => `
          <div style="border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:0.75rem;">
            <p style="margin:0;font-size:0.75rem;color:#d4af37;letter-spacing:0.1em;text-transform:uppercase;">${label}</p>
            <p style="margin:0.25rem 0 0;font-size:1rem;color:white;">${val}</p>
          </div>
        `).join('')}
      </div>
      <div style="padding:1rem 2rem 1.5rem;font-size:0.75rem;color:rgba(255,255,255,0.3);">
        Submitted via ghilli-web dealer form
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Ghilli Website" <${process.env.SMTP_USER}>`,
      to: 'oasisfoodbeverag@gmail.com',
      subject: `New Dealer Enquiry — ${name} (${city})`,
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Mail error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
