'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop/combo-kits', label: 'Combo Kits' },
]

interface HeaderDesktopProps {
  activeHref?: string
}

export function HeaderDesktop({ activeHref = '/' }: HeaderDesktopProps) {
  const router = useRouter()
  const items = useCart(state => state.items)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = items.reduce((count, item) => count + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 hidden flex-col glass-panel transition-all duration-300 md:flex">
      <nav className="page-wrap flex h-[4.5rem] items-center justify-between gap-8 py-2">
        {/* Left: Logo */}
        <Link href="/" className="flex flex-none items-center transition-opacity hover:opacity-90">
          <Image src="/logo.png" alt="Hapylo Logo" width={140} height={40} className="h-10 w-auto object-contain" priority />
        </Link>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-2xl overflow-hidden rounded-md border border-outline-variant bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for essentials..."
              className="w-full px-4 py-2.5 text-on-surface outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-6 text-white hover:bg-primary-hover transition-colors flex items-center justify-center"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex flex-none items-center gap-2 text-on-surface">
          {/* Sign In — prominent button */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3.5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:border-primary"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Sign In
          </Link>

          <Link href="/account/orders" className="flex flex-col justify-center rounded-sm px-3 py-1.5 transition-colors hover:border hover:border-outline hover:bg-secondary-container">
            <span className="text-xs leading-none text-on-surface-variant">Returns</span>
            <span className="text-sm font-bold leading-tight">&amp; Orders</span>
          </Link>

          <Link href="/cart" className="relative flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-white transition-colors hover:bg-primary-hover shadow-primary-glow">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[22px] leading-none">shopping_cart</span>
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sale-red px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-bold leading-tight">Cart</span>
          </Link>
        </div>
      </nav>

      {/* Secondary Nav Bar for Links */}
      <div className="border-t border-outline-variant/30">
        <div className="page-wrap flex items-center gap-6 py-1.5">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeHref === link.href ? 'text-primary font-bold' : 'text-on-surface'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
