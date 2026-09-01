import Link from 'next/link'
import { getDashboardStats } from '@/data/admin'

export const dynamic = 'force-dynamic'

const STATUS_COLOURS: Record<string, string> = {
  delivered:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  shipped:    'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  processing: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  confirmed:  'bg-primary-fixed text-on-primary-fixed ring-1 ring-primary-fixed-dim',
  created:    'bg-surface-container text-on-surface-variant ring-1 ring-outline-variant',
  cancelled:  'bg-error-container text-on-error-container ring-1 ring-error/20',
}

const STATUS_ICONS: Record<string, string> = {
  delivered: 'check_circle',
  shipped: 'local_shipping',
  processing: 'hourglass_top',
  confirmed: 'thumb_up',
  created: 'receipt_long',
  cancelled: 'cancel',
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'payments',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString('en-IN'),
      icon: 'receipt_long',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      label: 'Pending / Active',
      value: stats.pendingOrders.toLocaleString('en-IN'),
      icon: 'hourglass_top',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Active Products',
      value: stats.activeProducts.toLocaleString('en-IN'),
      icon: 'inventory_2',
      color: 'text-primary',
      bg: 'bg-primary-fixed',
    },
  ]

  return (
    <div>
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-on-surface md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(card => (
          <div key={card.label} className="surface-card p-5">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
              <span className={`material-symbols-outlined text-[22px] ${card.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {card.icon}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant">{card.label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-on-surface">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── Recent orders ── */}
      <div className="mt-8 surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-on-surface">Recent Orders</h2>
            <p className="text-xs text-on-surface-variant">Last 10 orders</p>
          </div>
          <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-hover">
            View all
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="material-symbols-outlined mb-3 text-5xl text-outline">receipt_long</span>
            <p className="font-semibold text-on-surface">No orders yet</p>
            <p className="mt-1 text-sm text-on-surface-variant">Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Order #</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:table-cell">Customer</th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant md:table-cell">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {stats.recentOrders.map(order => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-6 py-3.5">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-bold text-primary hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="hidden px-6 py-3.5 sm:table-cell">
                      <span className="text-on-surface">{order.customer_name ?? <span className="text-on-surface-variant italic">Guest</span>}</span>
                    </td>
                    <td className="hidden px-6 py-3.5 text-on-surface-variant md:table-cell">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLOURS[order.status] ?? 'bg-surface-container text-on-surface'}`}>
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {STATUS_ICONS[order.status] ?? 'circle'}
                        </span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-on-surface">
                      ₹{order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick actions ── */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/products/new"
          className="group flex items-center gap-4 surface-card p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <span className="material-symbols-outlined">add_box</span>
          </span>
          <div>
            <p className="font-semibold text-on-surface">Add Product</p>
            <p className="text-xs text-on-surface-variant">Upload via Cloudinary</p>
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="group flex items-center gap-4 surface-card p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <span className="material-symbols-outlined">inventory_2</span>
          </span>
          <div>
            <p className="font-semibold text-on-surface">Manage Products</p>
            <p className="text-xs text-on-surface-variant">Edit, delete, toggle status</p>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="group flex items-center gap-4 surface-card p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <span className="material-symbols-outlined">receipt_long</span>
          </span>
          <div>
            <p className="font-semibold text-on-surface">Manage Orders</p>
            <p className="text-xs text-on-surface-variant">Update status, view details</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
