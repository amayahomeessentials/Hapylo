'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { href: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
]

function Sidebar({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant px-6">
        <Link
          href="/"
          onClick={onClose}
          className="font-display text-2xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover"
        >
          Hapylo
        </Link>
        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV.map(({ href, label, icon }) => {
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-secondary-container text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'text-primary' : ''}`}>
                {icon}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Storefront link — inside flex flow, not absolute */}
      <div className="shrink-0 border-t border-outline-variant p-4">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          View Storefront
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-surface-container-low md:flex-row">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-64 shrink-0 border-r border-outline-variant bg-surface md:flex md:flex-col">
        <Sidebar pathname={pathname} />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-outline-variant bg-surface px-4 shadow-sm md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface hover:bg-secondary-container"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-display text-lg font-extrabold tracking-tight text-primary">Hapylo Admin</span>
        <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface-variant hover:bg-secondary-container" aria-label="View Storefront">
          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
        </Link>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-outline-variant bg-surface shadow-lg md:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-secondary-container"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <Sidebar pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
