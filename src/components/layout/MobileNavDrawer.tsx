'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'

const shopCategories = [
  { href: '/shop', label: 'All Products', icon: 'storefront', badge: 'All' },
  { href: '/shop/laundry', label: 'Laundry Care', icon: 'local_laundry_service', badge: 'Best Seller' },
  { href: '/shop/sprays', label: 'Surface Sprays', icon: 'cleaning_services' },
  { href: '/shop/combo-kits', label: 'Combo Kits', icon: 'inventory_2', badge: 'Save 15%' },
]

const accountLinks = [
  { href: '/account/orders', label: 'My Orders', icon: 'receipt_long' },
  { href: '/account', label: 'My Account', icon: 'manage_accounts' },
]

const helpLinks = [
  { href: '/faq', label: 'FAQs & Help', icon: 'quiz' },
  { href: '/contact', label: 'Contact Us', icon: 'mail' },
  { href: '/shipping-policy', label: 'Shipping & Delivery', icon: 'local_shipping' },
  { href: '/returns-policy', label: 'Returns & Refunds', icon: 'assignment_return' },
]

const sidebarSocials = [
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

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const items = useCart((state) => state.items)
  const openCart = useCart((state) => state.openCart)
  const wishlistItems = useWishlist((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = items.reduce((count, item) => count + item.quantity, 0)
  const wishlistCount = wishlistItems.length

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
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        id="mobile-nav-drawer"
        className={`fixed inset-y-0 left-0 z-[70] flex w-[86vw] max-w-sm flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out sm:max-w-md ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 bg-surface px-5 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt="Hapylo Logo"
              width={130}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* ── Sign In / Profile Quick Bar ── */}
        <div className="border-b border-outline-variant/50 bg-surface-container-low px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </span>
              <div>
                <p className="text-xs font-semibold text-on-surface">Welcome to Hapylo</p>
                <p className="text-[11px] text-on-surface-variant">Clean living essentials</p>
              </div>
            </div>

            {pathname !== '/login' ? (
              <Link
                href="/login"
                onClick={onClose}
                className="btn-primary rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm"
              >
                Sign In
              </Link>
            ) : (
              <span className="rounded-md bg-secondary-container px-2.5 py-1 text-xs font-bold text-primary">
                Active
              </span>
            )}
          </div>
        </div>

        {/* ── Quick Action Tiles (Cart & Wishlist) ── */}
        <div className="grid grid-cols-2 gap-2 border-b border-outline-variant/50 bg-surface p-3">
          <button
            onClick={() => {
              onClose()
              openCart()
            }}
            className="flex items-center justify-between rounded-xl border border-outline-variant/70 bg-surface-container-low p-2.5 text-left transition-all hover:border-primary/40 hover:bg-surface-container"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              </span>
              <div>
                <p className="text-[11px] font-bold text-on-surface">Your Bag</p>
                <p className="text-[10px] text-on-surface-variant">View cart</p>
              </div>
            </div>
            {mounted && cartCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sale-red px-1.5 text-[10px] font-extrabold text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border border-outline-variant/70 bg-surface-container-low p-2.5 transition-all hover:border-primary/40 hover:bg-surface-container"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </span>
              <div>
                <p className="text-[11px] font-bold text-on-surface">Saved</p>
                <p className="text-[10px] text-on-surface-variant">Wishlist</p>
              </div>
            </div>
            {mounted && wishlistCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-extrabold text-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>

        {/* ── Scrollable Nav Sections ── */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
          {/* Shop Categories */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant/70">
              Shop Categories
            </p>
            <ul className="space-y-1">
              {shopCategories.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-on-surface hover:bg-surface-container hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isActive
                              ? 'text-white'
                              : 'text-on-surface-variant group-hover:text-primary'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-secondary-container text-primary'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mx-2 h-px bg-outline-variant/60" />

          {/* Account Links */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant/70">
              My Account
            </p>
            <ul className="space-y-1">
              {accountLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-on-surface hover:bg-surface-container hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isActive
                              ? 'text-white'
                              : 'text-on-surface-variant group-hover:text-primary'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 group-hover:text-primary">
                        chevron_right
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mx-2 h-px bg-outline-variant/60" />

          {/* Help & Policies */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant/70">
              Customer Support
            </p>
            <ul className="space-y-0.5">
              {helpLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant/70 group-hover:text-primary">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plant powered promise badge */}
          <div className="mx-1 rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-primary">eco</span>
              <div>
                <p className="text-xs font-bold text-primary">100% Plant Powered</p>
                <p className="mt-0.5 text-[11px] leading-snug text-on-surface-variant">
                  Free of dyes, toxins, and artificial brighteners. Greywater and septic safe.
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Footer: Socials & Brand ── */}
        <div className="border-t border-outline-variant/60 bg-surface-container-low p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface">Follow Hapylo</span>
            <div className="flex items-center gap-2">
              {sidebarSocials.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface-variant shadow-xs transition-all hover:border-primary hover:bg-primary hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-outline-variant/40 pt-2.5 text-[10px] text-on-surface-variant">
            <span>© 2026 Hapylo</span>
            <span>care@hapylo.com</span>
          </div>
        </div>
      </div>
    </>
  )
}
