'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/products', label: 'Products', icon: 'inventory_2', exact: false },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: 'receipt_long', exact: false },
    ],
  },
]

function NavItem({
  href,
  label,
  icon,
  exact,
  pathname,
  onClose,
}: {
  href: string
  label: string
  icon: string
  exact: boolean
  pathname: string
  onClose?: () => void
}) {
  const isActive = exact ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
        isActive
          ? 'bg-white/15 text-white'
          : 'text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span
        className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`}
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {icon}
      </span>
      {label}
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />
      )}
    </Link>
  )
}

function Sidebar({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-full flex-col bg-primary">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-white/10">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-2 font-display text-xl font-extrabold tracking-[-0.05em] text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs tracking-normal text-white">H</span>
          Hapylo
        </Link>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white/70">
          Admin
        </span>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="mb-1.5 px-3 text-[9px] font-extrabold tracking-[0.16em] uppercase text-white/35">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 border-t border-white/10 p-3 space-y-1">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined text-[20px] text-white/40">open_in_new</span>
          View Storefront
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition-all hover:bg-red-500/20 hover:text-red-300"
        >
          <span className="material-symbols-outlined text-[20px] text-white/40">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface-container-low md:flex-row">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-60 shrink-0 md:flex md:flex-col">
        <div className="sticky top-0 h-screen">
          <Sidebar pathname={pathname} />
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-primary px-4 shadow-sm md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/admin" className="font-display text-lg font-extrabold tracking-tight text-white">
          Hapylo Admin
        </Link>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 hover:bg-white/15 hover:text-white"
          aria-label="View Storefront"
        >
          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
        </Link>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col shadow-2xl md:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <Sidebar pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
