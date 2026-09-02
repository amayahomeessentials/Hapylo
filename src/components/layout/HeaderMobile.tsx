'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { MobileNavDrawer } from './MobileNavDrawer'
import Image from 'next/image'

interface HeaderMobileProps {
  cartCount?: number
}

export function HeaderMobile({}: HeaderMobileProps) {
  const items = useCart(state => state.items)
  const [mounted, setMounted] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full flex-col glass-panel shadow-sm md:hidden">
        {/* Main header row */}
        <div className="flex w-full items-center justify-between px-4 py-2.5">
          {/* Left: Hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Center: Logo */}
          <Link
            href="/"
            className="flex items-center justify-center transition-opacity hover:opacity-90"
          >
            <Image src="/logo.png" alt="Hapylo Logo" width={150} height={40} className="h-10 w-auto object-contain" priority />
          </Link>

          {/* Right: Sign In + Cart */}
          <div className="flex items-center gap-2">
            {/* Sign In button — compact pill style */}
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              aria-label="Sign in"
            >
              <span className="material-symbols-outlined text-[15px]">person</span>
              Sign In
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-primary-glow"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-sale-red px-1 text-[9px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar row */}
        <div className="px-4 pb-2.5">
          <Link
            href="/search"
            className="flex w-full items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-sm text-on-surface-variant shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
            Search for essentials...
          </Link>
        </div>
      </header>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
