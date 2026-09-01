import Link from 'next/link'
import { headers } from 'next/headers'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { href: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Determine active path from the request headers so we can highlight the
  // correct nav item without a client component.
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  return (
    <div className="flex min-h-screen flex-col bg-surface-container-low md:flex-row">
      {/* ── Sidebar ── */}
      <aside className="w-full shrink-0 border-r border-outline-variant bg-surface md:w-64">
        <div className="flex h-16 items-center justify-between border-b border-outline-variant px-6">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover"
          >
            Hapylo
          </Link>
          <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            Admin
          </span>
        </div>

        <nav className="space-y-1 p-4">
          {NAV.map(({ href, label, icon }) => {
            // Exact match for dashboard, prefix match for everything else
            const isActive =
              href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? 'text-primary' : ''}`}
                >
                  {icon}
                </span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: storefront link */}
        <div className="absolute bottom-0 left-0 w-64 border-t border-outline-variant p-4 hidden md:block">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            View Storefront
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
