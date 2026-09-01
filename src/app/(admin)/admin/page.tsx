import Link from 'next/link'
import { getDashboardStats } from '@/data/admin'

export const dynamic = 'force-dynamic'

const STATUS_COLOURS: Record<string, string> = {
  delivered: 'bg-secondary-container text-primary',
  shipped: 'bg-primary-fixed text-on-primary-fixed',
  processing: 'bg-accent/10 text-accent',
  confirmed: 'bg-surface-container text-on-surface',
  created: 'bg-surface-container text-on-surface-variant',
  cancelled: 'bg-error-container text-on-error-container',
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-on-surface">Dashboard</h1>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-on-surface-variant">Total Revenue</p>
            <span className="material-symbols-outlined text-xl text-primary">payments</span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-on-surface">
            ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-on-surface-variant">Total Orders</p>
            <span className="material-symbols-outlined text-xl text-primary">receipt_long</span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-on-surface">
            {stats.totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-on-surface-variant">Active Products</p>
            <span className="material-symbols-outlined text-xl text-primary">inventory_2</span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-on-surface">
            {stats.activeProducts.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="mt-8 surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h2 className="font-display text-xl font-bold text-on-surface">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
            View all
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <span className="material-symbols-outlined mb-2 text-4xl text-outline">receipt_long</span>
            <p className="text-sm text-on-surface-variant">No orders yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">Order #</th>
                <th className="hidden px-6 py-3 text-left font-semibold text-on-surface-variant sm:table-cell">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">Status</th>
                <th className="px-6 py-3 text-right font-semibold text-on-surface-variant">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-6 py-3 font-mono font-medium text-on-surface">
                    {order.order_number}
                  </td>
                  <td className="hidden px-6 py-3 text-on-surface-variant sm:table-cell">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOURS[order.status] ?? 'bg-surface-container text-on-surface'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-on-surface">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Quick links ── */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-4 surface-card p-5 transition-shadow hover:shadow-card-hover"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-primary">
            <span className="material-symbols-outlined">add_box</span>
          </span>
          <div>
            <p className="font-semibold text-on-surface">Add New Product</p>
            <p className="text-xs text-on-surface-variant">Upload images via Cloudinary</p>
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="flex items-center gap-4 surface-card p-5 transition-shadow hover:shadow-card-hover"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-primary">
            <span className="material-symbols-outlined">inventory_2</span>
          </span>
          <div>
            <p className="font-semibold text-on-surface">Manage Products</p>
            <p className="text-xs text-on-surface-variant">Edit, delete, toggle visibility</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
