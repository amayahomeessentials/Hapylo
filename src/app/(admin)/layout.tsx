'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── Navigation config ────────────────────────────────────────────────────────

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
      { href: '/admin/categories', label: 'Categories', icon: 'category', exact: false },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: 'receipt_long', exact: false },
    ],
  },
]

// ─── Breadcrumb helper ────────────────────────────────────────────────────────

const CRUMB_MAP: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'New Product',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
}

function Breadcrumb({ pathname }: { pathname: string }) {
  // Build crumb trail: Dashboard > Section > Page
  const segments: { label: string; href: string }[] = []

  // Always start with Dashboard (unless we're already there)
  if (pathname !== '/admin') {
    segments.push({ label: 'Dashboard', href: '/admin' })
  }

  // Section label from known map
  const known = CRUMB_MAP[pathname]
  if (known && pathname !== '/admin') {
    segments.push({ label: known, href: pathname })
  } else if (!known && pathname !== '/admin') {
    // Dynamic routes: /admin/products/[id], /admin/orders/[id]
    if (pathname.startsWith('/admin/products/')) {
      segments.push({ label: 'Products', href: '/admin/products' })
      segments.push({ label: 'Edit Product', href: pathname })
    } else if (pathname.startsWith('/admin/orders/')) {
      segments.push({ label: 'Orders', href: '/admin/orders' })
      segments.push({ label: 'Order Detail', href: pathname })
    } else {
      // Fallback: capitalise last segment
      const last = pathname.split('/').pop() ?? ''
      segments.push({ label: last.charAt(0).toUpperCase() + last.slice(1), href: pathname })
    }
  }

  if (segments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-on-surface-variant md:flex">
      {segments.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>}
          {i === segments.length - 1 ? (
            <span className="font-semibold text-on-surface">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-primary hover:underline">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

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
        className={`material-symbols-outlined text-[20px] transition-colors ${
          isActive ? 'text-white' : 'text-white/50 group-hover:text-white'
        }`}
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {icon}
      </span>
      {label}
      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />}
    </Link>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

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
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-2 font-display text-xl font-extrabold tracking-[-0.05em] text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs tracking-normal text-white">
            H
          </span>
          Hapylo
        </Link>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white/70">
          Admin
        </span>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="mb-1.5 px-3 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/35">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem key={item.href} {...item} pathname={pathname} onClose={onClose} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 space-y-1 border-t border-white/10 p-3">
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

// ─── Layout ───────────────────────────────────────────────────────────────────

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
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-primary px-4 shadow-sm md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/admin" className="flex-1 font-display text-lg font-extrabold tracking-tight text-white">
          Hapylo Admin
        </Link>
        <Link
          href="/"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/70 hover:bg-white/15 hover:text-white"
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
          <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col shadow-2xl md:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25"
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
        {/* Desktop breadcrumb bar */}
        <div className="hidden border-b border-outline-variant bg-surface px-8 py-3 md:flex md:items-center md:justify-between">
          <Breadcrumb pathname={pathname} />
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            View storefront
          </Link>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
