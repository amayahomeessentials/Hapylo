'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

const mainLinks = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/shop', label: 'Shop All', icon: 'storefront' },
  { href: '/shop/combo-kits', label: 'Combo Kits', icon: 'inventory_2' },
]

const accountLinks = [
  { href: '/account/orders', label: 'My Orders', icon: 'receipt_long' },
  { href: '/account', label: 'My Account', icon: 'manage_accounts' },
  { href: '/cart', label: 'Cart', icon: 'shopping_cart', showBadge: true },
]

const helpLinks = [
  { href: '/faq', label: 'FAQs', icon: 'help' },
  { href: '/contact', label: 'Contact Us', icon: 'mail' },
  { href: '/returns-policy', label: 'Returns & Refunds', icon: 'assignment_return' },
]

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const items = useCart(state => state.items)
  const cartCount = items.reduce((count, item) => count + item.quantity, 0)
  const pathname = usePathname()

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        id="mobile-nav-drawer"
        className={`fixed inset-y-0 left-0 z-[70] flex w-[17.5rem] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between bg-primary px-5 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 font-display text-xl font-extrabold tracking-[-0.05em] text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs tracking-normal text-white">H</span>
            Hapylo
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* ── Sign In CTA banner (if not on login page) ── */}
        {pathname !== '/login' && (
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-3 border-b border-outline-variant/50 bg-primary/5 px-5 py-3.5 transition-colors hover:bg-primary/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-[20px] text-primary">person</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-on-surface-variant">Welcome!</p>
              <p className="text-sm font-bold text-primary">Sign in to your account</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-primary/50">chevron_right</span>
          </Link>
        )}

        {/* ── Scrollable nav content ── */}
        <nav className="flex-1 overflow-y-auto">

          {/* Main navigation */}
          <div className="px-3 pt-4 pb-2">
            <p className="mb-1.5 px-3 text-[10px] font-extrabold tracking-[0.14em] uppercase text-on-surface-variant/60">
              Browse
            </p>
            <ul className="space-y-0.5">
              {mainLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-on-surface hover:bg-surface-container hover:text-primary'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? 'text-white' : 'text-on-surface-variant group-hover:text-primary'
                        }`}
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mx-4 my-1 h-px bg-outline-variant/50" />

          {/* Account links */}
          <div className="px-3 py-2">
            <p className="mb-1.5 px-3 text-[10px] font-extrabold tracking-[0.14em] uppercase text-on-surface-variant/60">
              Account
            </p>
            <ul className="space-y-0.5">
              {accountLinks.map(link => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-on-surface hover:bg-surface-container hover:text-primary'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? 'text-white' : 'text-on-surface-variant group-hover:text-primary'
                        }`}
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {link.icon}
                      </span>
                      <span className="flex-1">{link.label}</span>
                      {link.showBadge && cartCount > 0 && (
                        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sale-red px-1.5 text-[10px] font-extrabold text-white">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mx-4 my-1 h-px bg-outline-variant/50" />

          {/* Help links */}
          <div className="px-3 py-2">
            <p className="mb-1.5 px-3 text-[10px] font-extrabold tracking-[0.14em] uppercase text-on-surface-variant/60">
              Help
            </p>
            <ul className="space-y-0.5">
              {helpLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-on-surface-variant transition-all duration-150 hover:bg-surface-container hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:text-primary">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ── Footer ── */}
        <div className="border-t border-outline-variant/50 bg-surface-container-low px-5 py-4">
          <p className="text-[11px] font-medium text-on-surface-variant">© 2026 Hapylo. All rights reserved.</p>
          <p className="mt-0.5 text-[11px] text-on-surface-variant/60">Home Essentials, Thoughtfully Made.</p>
        </div>
      </div>
    </>
  )
}
