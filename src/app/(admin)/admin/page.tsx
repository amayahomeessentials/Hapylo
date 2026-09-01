import Link from 'next/link'
import Image from 'next/image'
import {
  getDashboardStats,
  getLowStockProducts,
  getRevenueChart,
  getTopProducts,
  getOrderStatusBreakdown,
} from '@/data/admin'

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

const STATUS_BAR_COLOURS: Record<string, string> = {
  delivered:  'bg-emerald-500',
  shipped:    'bg-sky-500',
  processing: 'bg-amber-500',
  confirmed:  'bg-primary',
  created:    'bg-outline',
  cancelled:  'bg-error',
}

// ── Inline sparkline bar chart (SVG, no deps) ─────────────────────────────────
function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const chartH = 72
  const barW = 28
  const gap = 8
  const svgW = data.length * (barW + gap) - gap

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="mt-8 surface-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant px-6 py-4">
        <div>
          <h2 className="font-display text-lg font-bold text-on-surface">Revenue — Last 7 Days</h2>
          <p className="text-xs text-on-surface-variant">
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} total
          </p>
        </div>
        <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover">
          All orders
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      <div className="overflow-x-auto px-6 py-5">
        <div style={{ minWidth: svgW + 16 }}>
          <svg width={svgW} height={chartH + 28} className="w-full overflow-visible" aria-label="Revenue chart last 7 days">
            {data.map((d, i) => {
              const barH = Math.max(4, (d.revenue / maxRevenue) * chartH)
              const x = i * (barW + gap)
              const y = chartH - barH
              return (
                <g key={d.date}>
                  <title>₹{d.revenue.toLocaleString('en-IN')} · {d.orders} order{d.orders !== 1 ? 's' : ''}</title>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={5}
                    className="fill-primary opacity-80 transition-opacity hover:opacity-100"
                  />
                  {d.revenue > 0 && (
                    <text
                      x={x + barW / 2}
                      y={y - 5}
                      textAnchor="middle"
                      fontSize={9}
                      className="fill-on-surface-variant font-semibold"
                    >
                      ₹{d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}
                    </text>
                  )}
                  <text
                    x={x + barW / 2}
                    y={chartH + 18}
                    textAnchor="middle"
                    fontSize={9}
                    className="fill-on-surface-variant"
                  >
                    {fmtDate(d.date)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const [stats, lowStock, chartData, topProducts, statusBreakdown] = await Promise.all([
    getDashboardStats(),
    getLowStockProducts(5),
    getRevenueChart(7),
    getTopProducts(5),
    getOrderStatusBreakdown(),
  ])

  const totalOrdersForBreakdown = statusBreakdown.reduce((s, b) => s + b.count, 0) || 1

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'payments',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/orders',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString('en-IN'),
      icon: 'receipt_long',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      href: '/admin/orders',
    },
    {
      label: 'Pending / Active',
      value: stats.pendingOrders.toLocaleString('en-IN'),
      icon: 'hourglass_top',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/orders',
    },
    {
      label: 'Active Products',
      value: stats.activeProducts.toLocaleString('en-IN'),
      icon: 'inventory_2',
      color: 'text-primary',
      bg: 'bg-primary-fixed',
      href: '/admin/products',
    },
  ]

  return (
    <div>
      {/* ── Page heading ── */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-on-surface md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* ── Low-stock alert banner ── */}
      {lowStock.length > 0 && (
        <div className="mb-6 flex flex-wrap items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <span
            className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-amber-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">
              {lowStock.length} product{lowStock.length > 1 ? 's are' : ' is'} running low on stock
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {lowStock.map(p => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 transition-colors hover:bg-white hover:ring-amber-400"
                >
                  {p.images?.[0] && (
                    <Image src={p.images[0]} alt="" width={16} height={16} className="rounded object-cover" />
                  )}
                  {p.name}
                  <span className="rounded-full bg-amber-200 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-900">
                    {p.stock} left
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/admin/products"
            className="shrink-0 text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline"
          >
            Manage →
          </Link>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(card => (
          <Link
            key={card.label}
            href={card.href}
            className="surface-card group p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
              <span
                className={`material-symbols-outlined text-[22px] ${card.color}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {card.icon}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant">{card.label}</p>
            <p className="mt-1 font-display text-xl font-extrabold text-on-surface md:text-2xl">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* ── Revenue chart ── */}
      <RevenueChart data={chartData} />

      {/* ── Two-column section: top products + order breakdown ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">Top Products</h2>
              <p className="text-xs text-on-surface-variant">By units sold</p>
            </div>
            <Link href="/admin/products" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover">
              View all
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="material-symbols-outlined mb-3 text-4xl text-outline">inventory_2</span>
              <p className="text-sm text-on-surface-variant">No sales data yet</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {topProducts.map((p, i) => (
                <div key={p.product_id} className="flex items-center gap-3 px-6 py-3.5">
                  <span className="w-5 shrink-0 text-center text-xs font-extrabold text-on-surface-variant">
                    {i + 1}
                  </span>
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
                    {p.product_image ? (
                      <Image src={p.product_image} alt={p.product_name} fill className="object-cover" sizes="40px" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <span className="material-symbols-outlined text-xl text-outline">image</span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-on-surface">{p.product_name}</p>
                    <p className="text-xs text-on-surface-variant">{p.total_sold} units · ₹{p.revenue.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{p.total_sold}</p>
                    <p className="text-[10px] text-on-surface-variant">sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">Order Breakdown</h2>
              <p className="text-xs text-on-surface-variant">By status — all time</p>
            </div>
            <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover">
              View all
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {statusBreakdown.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="material-symbols-outlined mb-3 text-4xl text-outline">receipt_long</span>
              <p className="text-sm text-on-surface-variant">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3 px-6 py-5">
              {statusBreakdown.map(b => {
                const pct = Math.round((b.count / totalOrdersForBreakdown) * 100)
                return (
                  <div key={b.status}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOURS[b.status] ?? 'bg-surface-container text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {STATUS_ICONS[b.status] ?? 'circle'}
                        </span>
                        {b.status}
                      </span>
                      <span className="text-xs font-bold text-on-surface">
                        {b.count} <span className="font-normal text-on-surface-variant">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                      <div
                        className={`h-full rounded-full transition-all ${STATUS_BAR_COLOURS[b.status] ?? 'bg-outline'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="mt-6 surface-card overflow-hidden">
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
                  <tr key={order.id} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-6 py-3.5">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-bold text-primary hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="hidden px-6 py-3.5 sm:table-cell">
                      <span className="text-on-surface">
                        {order.customer_name ?? <span className="italic text-on-surface-variant">Guest</span>}
                      </span>
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
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <Link
          href="/admin/categories"
          className="group flex items-center gap-4 surface-card p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <span className="material-symbols-outlined">category</span>
          </span>
          <div>
            <p className="font-semibold text-on-surface">Categories</p>
            <p className="text-xs text-on-surface-variant">Add & manage categories</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
