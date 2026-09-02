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

// ─── Shared status config ─────────────────────────────────────────────────────

const STATUS_PILL: Record<string, string> = {
  delivered:  'bg-emerald-100 text-emerald-800',
  shipped:    'bg-sky-100 text-sky-800',
  processing: 'bg-amber-100 text-amber-800',
  confirmed:  'bg-primary-fixed text-on-primary-fixed',
  created:    'bg-surface-container text-on-surface-variant',
  cancelled:  'bg-error-container text-on-error-container',
}

const STATUS_DOT: Record<string, string> = {
  delivered:  'bg-emerald-500',
  shipped:    'bg-sky-500',
  processing: 'bg-amber-400',
  confirmed:  'bg-primary',
  created:    'bg-outline',
  cancelled:  'bg-error',
}

const STATUS_ICONS: Record<string, string> = {
  delivered: 'check_circle',
  shipped: 'local_shipping',
  processing: 'hourglass_top',
  confirmed: 'thumb_up',
  created: 'receipt_long',
  cancelled: 'cancel',
}

// ─── Revenue bar chart ────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const chartH = 80
  const barW = 32
  const gap = 10
  const svgW = data.length * (barW + gap) - gap

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border bg-white" style={{ borderColor: '#E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.06), 0 8px 20px rgba(12,46,50,0.06)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4" style={{ borderBottom: '1px solid #E8ECE8' }}>
        <div>
          <h2 className="font-display text-base font-bold text-on-surface">Revenue — Last 7 Days</h2>
          <p className="mt-0.5 text-sm text-on-surface-variant">
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} total
          </p>
        </div>
        <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          View orders
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
      <div className="overflow-x-auto px-6 py-6">
        <div style={{ minWidth: svgW + 16 }}>
          <svg width={svgW} height={chartH + 32} className="w-full overflow-visible" aria-label="7-day revenue chart">
            {data.map((d, i) => {
              const barH = Math.max(6, (d.revenue / maxRevenue) * chartH)
              const x = i * (barW + gap)
              const y = chartH - barH
              const isEmpty = d.revenue === 0
              return (
                <g key={d.date}>
                  <title>₹{d.revenue.toLocaleString('en-IN')} · {d.orders} order{d.orders !== 1 ? 's' : ''}</title>
                  {/* Track */}
                  <rect x={x} y={0} width={barW} height={chartH} rx={6} fill="#F4F6F4" />
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={6}
                    fill={isEmpty ? '#D9DED5' : '#123C3E'}
                    opacity={isEmpty ? 0.5 : 1}
                    className="transition-opacity hover:opacity-80"
                  />
                  {/* Value label */}
                  {d.revenue > 0 && (
                    <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={9} fontWeight={700} fill="#596567">
                      ₹{d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}
                    </text>
                  )}
                  {/* Date label */}
                  <text x={x + barW / 2} y={chartH + 22} textAnchor="middle" fontSize={9} fill="#899495">
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const [stats, lowStock, chartData, topProducts, statusBreakdown] = await Promise.all([
    getDashboardStats(),
    getLowStockProducts(5),
    getRevenueChart(7),
    getTopProducts(5),
    getOrderStatusBreakdown(),
  ])

  const totalOrdersBreakdown = statusBreakdown.reduce((s, b) => s + b.count, 0) || 1

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'payments',
      accent: '#10B981',   // emerald
      accentBg: '#D1FAE5',
      href: '/admin/orders',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString('en-IN'),
      icon: 'receipt_long',
      accent: '#0EA5E9',   // sky
      accentBg: '#E0F2FE',
      href: '/admin/orders',
    },
    {
      label: 'Pending / Active',
      value: stats.pendingOrders.toLocaleString('en-IN'),
      icon: 'hourglass_top',
      accent: '#F59E0B',   // amber
      accentBg: '#FEF3C7',
      href: '/admin/orders',
    },
    {
      label: 'Active Products',
      value: stats.activeProducts.toLocaleString('en-IN'),
      icon: 'inventory_2',
      accent: '#123C3E',   // primary
      accentBg: '#D7F2EC',
      href: '/admin/products',
    },
  ]

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-7">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">Dashboard</h1>
        <p className="mt-1.5 text-sm text-on-surface-variant">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* ── Low-stock banner ── */}
      {lowStock.length > 0 && (
        <div className="mb-6 flex flex-wrap items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="material-symbols-outlined mt-0.5 shrink-0 text-[22px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900">
              {lowStock.length} product{lowStock.length > 1 ? 's are' : ' is'} running low on stock
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {lowStock.map(p => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 transition-all hover:ring-amber-400 hover:shadow-sm"
                >
                  {p.images?.[0] && (
                    <Image src={p.images[0]} alt="" width={14} height={14} className="rounded object-cover" />
                  )}
                  {p.name}
                  <span className="rounded-full bg-amber-200 px-1.5 font-extrabold text-amber-900">{p.stock}</span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/admin/products" className="shrink-0 text-xs font-bold text-amber-700 hover:underline">
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
            className="group flex flex-col rounded-2xl bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ border: '1px solid #E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)' }}
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: card.accentBg }}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ color: card.accent, fontVariationSettings: "'FILL' 1" }}
              >
                {card.icon}
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{card.label}</p>
            <p className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-on-surface">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* ── Revenue chart ── */}
      <RevenueChart data={chartData} />

      {/* ── Two-col: top products + breakdown ── */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Top products */}
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid #E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E8ECE8' }}>
            <div>
              <h2 className="font-display text-base font-bold text-on-surface">Top Products</h2>
              <p className="text-xs text-on-surface-variant">By units sold</p>
            </div>
            <Link href="/admin/products" className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
              View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="material-symbols-outlined mb-3 text-4xl text-outline">inventory_2</span>
              <p className="text-sm text-on-surface-variant">No sales data yet</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F0F2EC' }}>
              {topProducts.map((p, i) => (
                <div key={p.product_id} className="flex items-center gap-3 px-6 py-3.5">
                  <span className="w-5 shrink-0 text-center text-xs font-extrabold text-outline">{i + 1}</span>
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border bg-surface-container-low" style={{ borderColor: '#E8ECE8' }}>
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
                  <span className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold text-white" style={{ background: '#123C3E' }}>
                    {p.total_sold}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order breakdown */}
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid #E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E8ECE8' }}>
            <div>
              <h2 className="font-display text-base font-bold text-on-surface">Order Breakdown</h2>
              <p className="text-xs text-on-surface-variant">By status — all time</p>
            </div>
            <Link href="/admin/orders" className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
              View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          {statusBreakdown.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="material-symbols-outlined mb-3 text-4xl text-outline">receipt_long</span>
              <p className="text-sm text-on-surface-variant">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4 px-6 py-5">
              {statusBreakdown.map(b => {
                const pct = Math.round((b.count / totalOrdersBreakdown) * 100)
                return (
                  <div key={b.status}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_PILL[b.status] ?? 'bg-surface-container text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {STATUS_ICONS[b.status] ?? 'circle'}
                        </span>
                        {b.status}
                      </span>
                      <span className="text-xs font-bold text-on-surface">{b.count} <span className="font-normal text-on-surface-variant">({pct}%)</span></span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                      <div
                        className={`h-full rounded-full transition-all ${STATUS_DOT[b.status] ?? 'bg-outline'}`}
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
      <div className="mt-6 overflow-hidden rounded-2xl bg-white" style={{ border: '1px solid #E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E8ECE8' }}>
          <div>
            <h2 className="font-display text-base font-bold text-on-surface">Recent Orders</h2>
            <p className="text-xs text-on-surface-variant">Last 10 orders</p>
          </div>
          <Link href="/admin/orders" className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline">
            View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
              <thead style={{ background: '#F7F9F7', borderBottom: '1px solid #E8ECE8' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Order #</th>
                  <th className="hidden px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant sm:table-cell">Customer</th>
                  <th className="hidden px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant md:table-cell">Date</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#F0F2EC' }}>
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-6 py-3.5">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-bold text-primary hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="hidden px-6 py-3.5 sm:table-cell">
                      <span className="font-medium text-on-surface">
                        {order.customer_name ?? <span className="italic text-on-surface-variant">Guest</span>}
                      </span>
                    </td>
                    <td className="hidden px-6 py-3.5 text-on-surface-variant md:table-cell">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_PILL[order.status] ?? 'bg-surface-container text-on-surface'}`}>
                        <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
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
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { href: '/admin/products/new', icon: 'add_box', label: 'Add Product', sub: 'Upload to Cloudinary' },
          { href: '/admin/products', icon: 'inventory_2', label: 'Products', sub: 'Edit, delete, toggle' },
          { href: '/admin/orders', icon: 'receipt_long', label: 'Orders', sub: 'Update status' },
          { href: '/admin/categories', icon: 'category', label: 'Categories', sub: 'Add & manage' },
          { href: '/admin/users', icon: 'group', label: 'Users', sub: 'View customers' },
        ].map(a => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-center gap-3 rounded-2xl bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ border: '1px solid #E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.04)' }}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-primary"
              style={{ background: '#E4F0EC' }}
            >
              <span
                className="material-symbols-outlined text-[20px] text-primary transition-colors group-hover:text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {a.icon}
              </span>
            </span>
            <div>
              <p className="text-sm font-bold text-on-surface">{a.label}</p>
              <p className="text-xs text-on-surface-variant">{a.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
