'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── Navigation ───────────────────────────────────────────────────────────────

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
  {
    label: 'People',
    items: [
      { href: '/admin/users', label: 'Users', icon: 'group', exact: false },
    ],
  },
]

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

const CRUMB_MAP: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'New Product',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments: { label: string; href: string }[] = []
  if (pathname !== '/admin') {
    segments.push({ label: 'Dashboard', href: '/admin' })
  }
  const known = CRUMB_MAP[pathname]
  if (known && pathname !== '/admin') {
    segments.push({ label: known, href: pathname })
  } else if (!known && pathname !== '/admin') {
    if (pathname.startsWith('/admin/products/')) {
      segments.push({ label: 'Products', href: '/admin/products' })
      segments.push({ label: 'Edit Product', href: pathname })
    } else if (pathname.startsWith('/admin/orders/')) {
      segments.push({ label: 'Orders', href: '/admin/orders' })
      segments.push({ label: 'Order Detail', href: pathname })
    } else {
      const last = pathname.split('/').pop() ?? ''
      segments.push({ label: last.charAt(0).toUpperCase() + last.slice(1), href: pathname })
    }
  }
  if (segments.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 md:flex">
      {segments.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          )}
          {i === segments.length - 1 ? (
            <span className="text-sm font-bold text-on-surface">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-sm text-on-surface-variant hover:text-primary">
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
  href, label, icon, exact, pathname, onClose,
}: {
  href: string; label: string; icon: string; exact: boolean; pathname: string; onClose?: () => void
}) {
  const isActive = exact ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
        isActive
          ? 'bg-white/[0.12] text-white'
          : 'text-white/50 hover:bg-white/[0.07] hover:text-white/90'
      }`}
    >
      {/* Active left accent bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-white/70" />
      )}
      <span
        className={`material-symbols-outlined text-[22px] transition-all ${
          isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'
        }`}
        style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400" }}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
      )}
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
    <div className="flex h-full flex-col" style={{ background: '#0C2729' }}>
      {/* Logo */}
      <div className="flex h-[68px] shrink-0 items-center gap-3 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black tracking-tight text-white"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            H
          </span>
          <div>
            <p className="font-display text-[15px] font-extrabold leading-none text-white tracking-tight">Hapylo</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[9px] font-extrabold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
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

      {/* Bottom */}
      <div className="shrink-0 px-3 py-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLElement).style.background = '' }}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ color: 'rgba(255,255,255,0.3)' }}>open_in_new</span>
          View Storefront
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fca5a5'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLElement).style.background = '' }}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ color: 'rgba(255,255,255,0.3)' }}>logout</span>
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
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#EEF0EC' }}>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 md:flex md:flex-col">
        <div className="sticky top-0 h-screen">
          <Sidebar pathname={pathname} />
        </div>
      </aside>

      {/* Right column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-3 px-4 shadow-md md:hidden" style={{ background: '#0C2729' }}>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <Link href="/admin" className="flex-1 font-display text-[17px] font-extrabold tracking-tight text-white">
            Hapylo Admin
          </Link>
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            aria-label="View Storefront"
          >
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
          </Link>
        </div>

        {/* Desktop header bar */}
        <div className="hidden h-14 items-center justify-between border-b bg-white px-8 md:flex" style={{ borderColor: '#E0E4E0' }}>
          <Breadcrumb pathname={pathname} />
          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              Storefront
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-semibold text-error transition-colors hover:text-error/80"
            >
              <span className="material-symbols-outlined text-[13px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col shadow-2xl md:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <Sidebar pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </div>
  )
}
