'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { OrderStatus } from '@/types/database.types'
import { AdminOrder } from '@/data/admin'

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

const ALL_STATUSES: OrderStatus[] = ['created', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const FILTER_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'created' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

// ── CSV export helper ─────────────────────────────────────────────────────────
function exportToCSV(orders: AdminOrder[]) {
  const headers = ['Order #', 'Customer', 'Email', 'Items', 'Date', 'Status', 'Payment Status', 'Total (₹)']
  const rows = orders.map(o => [
    o.order_number,
    o.customer_name ?? 'Guest',
    o.customer_email ?? '',
    String(o.items_count),
    new Date(o.created_at).toLocaleDateString('en-IN'),
    o.status,
    o.payment_status,
    o.total.toFixed(2),
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLOURS[status] ?? 'bg-surface-container text-on-surface-variant'}`}>
      <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        {STATUS_ICONS[status] ?? 'circle'}
      </span>
      {status}
    </span>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(data.orders ?? [])
    } catch {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    } catch {
      console.error('Failed to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = useMemo(() => orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_email ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }), [orders, filter, search])

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface md:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{orders.length} total orders</p>
        </div>
        <button
          onClick={() => exportToCSV(filtered)}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface shadow-sm transition-all hover:border-primary hover:text-primary disabled:opacity-40"
          title="Export current view to CSV"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV
          {filtered.length < orders.length && (
            <span className="rounded-full bg-surface-container px-1.5 py-0.5 text-[10px] text-on-surface-variant">
              {filtered.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Search + filter bar ── */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search order #, customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 w-full text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Status filter tabs ── */}
      <div className="mb-5 flex gap-1 overflow-x-auto no-scrollbar rounded-xl border border-outline-variant bg-surface p-1">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              filter === tab.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${filter === tab.value ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                {orders.filter(o => o.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-outline-variant bg-surface py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-5xl text-outline">receipt_long</span>
          <p className="font-semibold text-on-surface">No orders found</p>
          <p className="mt-1 text-sm text-on-surface-variant">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-outline-variant bg-surface-container-low">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Order #</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Customer</th>
                    <th className="hidden px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant lg:table-cell">Items</th>
                    <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant xl:table-cell">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filtered.map(order => (
                    <tr key={order.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="px-5 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-bold text-primary hover:underline">
                          {order.order_number}
                        </Link>
                        <p className="mt-0.5 text-[10px] text-on-surface-variant xl:hidden">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {order.customer_name ? (
                          <div>
                            <p className="font-medium text-on-surface">{order.customer_name}</p>
                            <p className="text-xs text-on-surface-variant">{order.customer_email ?? ''}</p>
                          </div>
                        ) : (
                          <span className="text-xs italic text-on-surface-variant">Guest</span>
                        )}
                      </td>
                      <td className="hidden px-5 py-4 text-center text-on-surface-variant lg:table-cell">
                        {order.items_count}
                      </td>
                      <td className="hidden px-5 py-4 text-on-surface-variant xl:table-cell">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-on-surface">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="rounded-lg border border-outline-variant bg-surface px-2 py-1.5 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none disabled:opacity-50"
                          >
                            {ALL_STATUSES.map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                            aria-label="View order"
                          >
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile card list (< md) ── */}
          <div className="grid gap-3 md:hidden">
            {filtered.map(order => (
              <div key={order.id} className="rounded-xl border border-outline-variant bg-surface p-4 shadow-sm">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-bold text-primary hover:underline">
                      {order.order_number}
                    </Link>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                    aria-label="View order"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </Link>
                </div>

                {/* Customer */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-container text-[11px] font-bold text-primary">
                    {(order.customer_name ?? order.customer_email ?? 'G')[0].toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {order.customer_name ?? <span className="italic text-on-surface-variant">Guest</span>}
                    </p>
                    {order.customer_email && (
                      <p className="text-xs text-on-surface-variant truncate">{order.customer_email}</p>
                    )}
                  </div>
                </div>

                {/* Bottom row: status + total + quick-update */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant pt-3">
                  <StatusBadge status={order.status} />
                  <span className="font-bold text-on-surface">₹{order.total.toFixed(2)}</span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="rounded-lg border border-outline-variant bg-surface px-2 py-1.5 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Result count hint */}
          {(search || filter !== 'all') && (
            <p className="mt-4 text-center text-xs text-on-surface-variant">
              Showing {filtered.length} of {orders.length} orders
            </p>
          )}
        </>
      )}
    </div>
  )
}
