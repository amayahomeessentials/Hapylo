'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

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
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 hidden flex-col glass-panel transition-all duration-300 md:flex">
      <nav className="page-wrap flex h-[4.5rem] items-center justify-between gap-8 py-2">
        {/* Left: Logo */}
        <Link href="/" className="flex flex-none items-center gap-2 font-display text-3xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm tracking-normal text-white">H</span>Hapylo
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
          <Link href="/login" className="flex flex-col justify-center rounded-sm px-3 py-1.5 transition-colors hover:border hover:border-outline hover:bg-secondary-container">
            <span className="text-xs leading-none text-on-surface-variant">Hello, sign in</span>
            <span className="text-sm font-bold leading-tight">Account &amp; Lists</span>
          </Link>

          <Link href="/account/orders" className="flex flex-col justify-center rounded-sm px-3 py-1.5 transition-colors hover:border hover:border-outline hover:bg-secondary-container">
            <span className="text-xs leading-none text-on-surface-variant">Returns</span>
            <span className="text-sm font-bold leading-tight">&amp; Orders</span>
          </Link>

          <Link href="/cart" className="relative flex items-end gap-1 rounded-sm px-3 py-1.5 transition-colors hover:border hover:border-outline hover:bg-secondary-container">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[32px] leading-none text-primary">shopping_cart</span>
              {/* Fixed: only show badge when count > 0 */}
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 font-bold text-sale-red">
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
