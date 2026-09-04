'use client'

import Link from 'next/link'
import { useState } from 'react'

const shopLinks = [
  { href: '/shop', label: 'All Products' },
  { href: '/shop/laundry', label: 'Laundry Care' },
  { href: '/shop/sprays', label: 'Surface Sprays' },
  { href: '/shop/combo-kits', label: 'Combo Kits' },
]

const serviceLinks = [
  { href: '/shipping-policy', label: 'Shipping & Delivery' },
  { href: '/returns-policy', label: 'Returns & Refunds' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
]

const socials = [
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

function PaymentMark({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 min-w-[48px] items-center justify-center rounded-sm border border-white/15 bg-white/10 px-2 text-[10px] font-semibold tracking-wider text-on-footer">
      {label}
    </span>
  )
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subLoading, setSubLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubLoading(true)
    // In production this would POST to an API route or Supabase
    await new Promise(r => setTimeout(r, 600))
    setSubscribed(true)
    setSubLoading(false)
  }

  return (
    <footer className="mt-auto border-t-4 border-accent bg-footer text-on-footer">
      <div className="page-wrap grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-16">
        {/* Brand / about */}
        <div className="space-y-4">
          <div className="font-display text-3xl font-extrabold tracking-[-0.06em] text-white">Hapylo</div>
          <p className="font-display text-sm font-bold tracking-widest text-accent uppercase">Refreshingly Clean.</p>
          <p className="text-sm leading-relaxed text-on-footer-muted">
            Plant-powered home care products that respect your family and the planet. Ultra-concentrated formulas, ethically made.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socials.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-on-footer transition-all hover:scale-110 hover:border-accent hover:bg-accent/15 hover:text-accent"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          {shopLinks.map(link => (
            <Link
              key={link.href}
              className="text-sm text-on-footer-muted transition-colors hover:text-white"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Customer service */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Customer Service</h4>
          {serviceLinks.map(link => (
            <Link
              key={link.label}
              className="text-sm text-on-footer-muted transition-colors hover:text-white"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h4>
          <p className="text-sm leading-relaxed text-on-footer-muted">
            Sign up for tips, new arrivals, and exclusive offers.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 rounded-md bg-white/10 p-3 text-sm text-primary-fixed">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              You&apos;re subscribed! Welcome to Hapylo.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
              <input
                className="min-h-11 flex-grow rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-on-footer-muted transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={subLoading}
                className="btn-primary min-h-11 whitespace-nowrap px-5 py-2.5 text-sm disabled:opacity-60"
              >
                {subLoading ? '…' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-wrap flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-caption text-on-footer-muted">
            © 2026 Hapylo Home Care. Ethically Made. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
            <PaymentMark label="VISA" />
            <PaymentMark label="MC" />
            <PaymentMark label="AMEX" />
            <PaymentMark label="UPI" />
            <PaymentMark label="RZP" />
          </div>
        </div>
      </div>
    </footer>
  )
}
