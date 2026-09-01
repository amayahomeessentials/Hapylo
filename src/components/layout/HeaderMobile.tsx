'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { MobileNavDrawer } from './MobileNavDrawer'

interface HeaderMobileProps {
  cartCount?: number
}

export function HeaderMobile({}: HeaderMobileProps) {
  const getCartCount = useCart(state => state.getCartCount)
  const [mounted, setMounted] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = getCartCount()
  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant bg-surface/95 px-6 py-3 shadow-sm backdrop-blur-xl md:hidden">
        <div className="flex-none">
          <button
            onClick={() => setDrawerOpen(true)}
            className="-ml-2 flex min-h-[48px] min-w-[48px] items-center justify-center p-2 text-on-surface"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover">
            Hapylo
          </Link>
        </div>

        <div className="flex flex-none gap-1">
          <Link href="/search" aria-label="Search" className="flex min-h-[48px] min-w-[48px] items-center justify-center p-2 text-on-surface">
            <span className="material-symbols-outlined text-2xl">search</span>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative -mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary p-2 text-white shadow-primary-glow">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {mounted && cartCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-sale-red" />
            )}
          </Link>
        </div>
      </header>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
