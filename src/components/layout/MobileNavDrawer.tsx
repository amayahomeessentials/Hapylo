'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from '@/hooks/useCart'

const navLinks = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/shop', label: 'Shop', icon: 'storefront' },
  { href: '/shop/combo-kits', label: 'Combo Kits', icon: 'inventory_2' },
  { href: '/cart', label: 'Cart', icon: 'shopping_cart' },
  { href: '/login', label: 'Sign in', icon: 'person' },
]

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const items = useCart(state => state.items)
  const cartCount = items.reduce((count, item) => count + item.quantity, 0)

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
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 z-[70] flex w-72 flex-col bg-surface shadow-lg transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="font-display text-2xl font-extrabold tracking-[-0.06em] text-primary"
          >
            Hapylo
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
                >
                  <span className="material-symbols-outlined text-xl text-on-surface-variant">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.href === '/cart' && cartCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-outline-variant px-5 py-4">
          <p className="text-xs text-on-surface-variant">© 2026 Hapylo. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}
