import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-container-low md:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-r border-outline-variant bg-surface md:w-64">
        <div className="flex h-16 items-center justify-center border-b border-outline-variant px-6">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover">
            Hapylo Admin
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link href="/admin" className="flex items-center gap-3 rounded-md bg-secondary-container px-3 py-2 text-sm font-medium text-on-surface">
            <span className="material-symbols-outlined text-primary">dashboard</span>
            Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface">
            <span className="material-symbols-outlined">inventory_2</span>
            Products
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface">
            <span className="material-symbols-outlined">receipt_long</span>
            Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
