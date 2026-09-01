'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { OrderStatus } from '@/types/database.types'
import { AdminOrderDetail } from '@/data/admin'

const STATUS_COLOURS: Record<string, string> = {
  delivered:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  shipped:    'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  processing: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  confirmed:  'bg-primary-fixed text-on-primary-fixed ring-1 ring-primary-fixed-dim',
  created:    'bg-surface-container text-on-surface-variant ring-1 ring-outline-variant',
  cancelled:  'bg-error-container text-on-error-container ring-1 ring-error/20',
}

const ALL_STATUSES: OrderStatus[] = ['created', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<AdminOrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('created')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`)
        const data = await res.json()
        if (data.order) {
          setOrder(data.order)
          setSelectedStatus(data.order.status)
        }
      } catch {
        console.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [orderId])

  const handleSaveStatus = async () => {
    if (!order || selectedStatus === order.status) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      })
      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status: selectedStatus } : prev)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } catch {
      console.error('Failed to update order status')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <span className="material-symbols-outlined mb-3 text-5xl text-outline">error</span>
        <p className="font-semibold text-on-surface">Order not found</p>
        <Link href="/admin/orders" className="mt-4 btn-primary px-5 py-2.5 text-sm rounded-xl">
          Back to Orders
        </Link>
      </div>
    )
  }

  const statusChanged = selectedStatus !== order.status

  return (
    <div>
      {/* Back + heading */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/orders')}
            className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Orders
          </button>
          <h1 className="font-display text-xl font-extrabold text-on-surface md:text-2xl">
            Order {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>

        {/* Status updater */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as OrderStatus)}
            className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={handleSaveStatus}
            disabled={!statusChanged || saving}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-40 ${
              saved ? 'bg-emerald-600 text-white' : 'btn-primary'
            }`}
          >
            {saving ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            ) : saved ? (
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            ) : null}
            {saved ? 'Saved!' : 'Update Status'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left: Order items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items card */}
          <div className="surface-card overflow-hidden">
            <div className="border-b border-outline-variant px-6 py-4">
              <h2 className="font-semibold text-on-surface">Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-outline">image</span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product_slug}`}
                      target="_blank"
                      className="font-semibold text-on-surface hover:text-primary hover:underline truncate block"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-on-surface-variant mt-0.5">Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}</p>
                  </div>
                  <p className="font-bold text-on-surface shrink-0">
                    ₹{(item.quantity * item.unit_price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment info */}
          {(order.razorpay_order_id || order.razorpay_payment_id) && (
            <div className="surface-card p-6">
              <h2 className="mb-4 font-semibold text-on-surface">Payment Info</h2>
              <div className="space-y-2 text-sm">
                {order.razorpay_order_id && (
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant">Razorpay Order ID</span>
                    <span className="font-mono text-on-surface text-right break-all">{order.razorpay_order_id}</span>
                  </div>
                )}
                {order.razorpay_payment_id && (
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant">Payment ID</span>
                    <span className="font-mono text-on-surface text-right break-all">{order.razorpay_payment_id}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary + customer + address */}
        <div className="space-y-5">
          {/* Order summary */}
          <div className="surface-card p-6">
            <h2 className="mb-4 font-semibold text-on-surface">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface">{order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>−₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-outline-variant pt-2 mt-2 flex justify-between font-bold text-base">
                <span className="text-on-surface">Total</span>
                <span className="text-on-surface">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Order Status</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLOURS[order.status] ?? ''}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Payment</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                  order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-surface-container text-on-surface-variant ring-1 ring-outline-variant'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="surface-card p-6">
            <h2 className="mb-4 font-semibold text-on-surface">Customer</h2>
            {order.customer_name || order.customer_email ? (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-primary font-bold text-sm">
                  {(order.customer_name ?? order.customer_email ?? '?')[0].toUpperCase()}
                </span>
                <div className="min-w-0">
                  {order.customer_name && <p className="font-semibold text-on-surface truncate">{order.customer_name}</p>}
                  {order.customer_email && <p className="text-xs text-on-surface-variant truncate">{order.customer_email}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-on-surface-variant">Guest order</p>
            )}
          </div>

          {/* Shipping address */}
          {order.address && (
            <div className="surface-card p-6">
              <h2 className="mb-4 font-semibold text-on-surface">Shipping Address</h2>
              <div className="text-sm text-on-surface-variant space-y-0.5">
                <p className="text-on-surface">{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
