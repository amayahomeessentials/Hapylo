'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { OrderStatus } from '@/types/database.types'
import { AdminOrderDetail } from '@/data/admin'

const STATUS_COLOURS: Record<string, string> = {
  delivered:  'bg-emerald-100 text-emerald-800',
  shipped:    'bg-sky-100 text-sky-800',
  processing: 'bg-amber-100 text-amber-800',
  confirmed:  'bg-primary-fixed text-on-primary-fixed',
  created:    'bg-surface-container text-on-surface-variant',
  cancelled:  'bg-error-container text-on-error-container',
}

const STATUS_ICONS: Record<string, string> = {
  delivered: 'check_circle',
  shipped: 'local_shipping',
  processing: 'hourglass_top',
  confirmed: 'thumb_up',
  created: 'receipt_long',
  cancelled: 'cancel',
}

const ALL_STATUSES: OrderStatus[] = [
  'created', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
]

// ── Timeline step helper ──────────────────────────────────────────────────────

const STATUS_STEPS: OrderStatus[] = ['created', 'confirmed', 'processing', 'shipped', 'delivered']

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status as OrderStatus)
  const isCancelled = status === 'cancelled'

  return (
    <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E0E4E0", boxShadow: "0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)" }}>
      <h2 className="mb-4 font-semibold text-on-surface">Order Timeline</h2>
      {isCancelled ? (
        <div className="flex items-center gap-3 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
          This order has been cancelled.
        </div>
      ) : (
        <ol className="relative ml-3 border-l border-outline-variant">
          {STATUS_STEPS.map((step, i) => {
            const done = currentIdx >= i
            const active = currentIdx === i
            return (
              <li key={step} className="mb-5 ml-5 last:mb-0">
                <span className={`absolute -left-[11px] flex h-[22px] w-[22px] items-center justify-center rounded-full ring-2 ring-surface ${
                  done ? 'bg-primary ring-primary/20' : 'bg-surface-container ring-outline-variant'
                }`}>
                  {done ? (
                    <span className="material-symbols-outlined text-[13px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {active ? STATUS_ICONS[step] ?? 'radio_button_checked' : 'check'}
                    </span>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-outline-variant" />
                  )}
                </span>
                <p className={`text-sm font-semibold capitalize ${done ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {step}
                </p>
                {active && (
                  <p className="text-xs text-primary">Current status</p>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

// ── Internal notes ────────────────────────────────────────────────────────────

function InternalNotes({ orderId }: { orderId: string }) {
  const storageKey = `admin-order-notes-${orderId}`
  const [notes, setNotes] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) setNotes(stored)
    } catch { /* ignore */ }
  }, [storageKey])

  function startEdit() {
    setDraft(notes)
    setEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  function saveNotes() {
    try {
      localStorage.setItem(storageKey, draft)
    } catch { /* ignore */ }
    setNotes(draft)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function cancelEdit() {
    setDraft('')
    setEditing(false)
  }

  return (
    <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E0E4E0", boxShadow: "0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-on-surface">Internal Notes</h2>
        <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant">
          Local only
        </span>
      </div>

      {editing ? (
        <div>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={4}
            placeholder="Add notes about this order — visible only to admins on this device…"
            className="input w-full resize-y text-sm"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={saveNotes}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              Save notes
            </button>
            <button
              onClick={cancelEdit}
              className="rounded-xl border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {notes ? (
            <div className="rounded-xl bg-surface-container-low p-3">
              <p className="whitespace-pre-wrap text-sm text-on-surface">{notes}</p>
            </div>
          ) : (
            <p className="text-sm italic text-on-surface-variant">No notes yet.</p>
          )}
          <button
            onClick={startEdit}
            className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">{notes ? 'edit' : 'add'}</span>
            {notes ? 'Edit notes' : 'Add notes'}
          </button>
          {saved && (
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Saved
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

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
        <Link href="/admin/orders" className="mt-4 btn-primary rounded-xl px-5 py-2.5 text-sm">
          Back to Orders
        </Link>
      </div>
    )
  }

  const statusChanged = selectedStatus !== order.status

  const CARD = {
    border: '1px solid #E0E4E0',
    boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)',
  }

  return (
    <div>
      {/* ── Back + heading ── */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/orders')}
            className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Orders
          </button>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
            Order {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>

        {/* Status updater */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as OrderStatus)}
            className="rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-sm font-semibold text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {saved && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
            {saved ? 'Saved!' : 'Update Status'}
          </button>
        </div>
      </div>

      {/* ── 3-column grid ── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* ── Left: items + payment ── */}
        <div className="space-y-5 lg:col-span-2">
          {/* Items */}
          <div className="overflow-hidden rounded-2xl bg-white" style={CARD}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #E8ECE8' }}>
              <h2 className="font-bold text-on-surface">Items ({order.items.length})</h2>
            </div>
            <div className="divide-y" style={{ borderColor: '#F0F2EC' }}>
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
                    {item.product_image ? (
                      <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-outline">image</span>
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.product_slug}`}
                      target="_blank"
                      className="block truncate font-semibold text-on-surface hover:text-primary hover:underline"
                    >
                      {item.product_name}
                    </Link>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-on-surface">
                    ₹{(item.quantity * item.unit_price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <OrderTimeline status={order.status} />

          {/* Payment info */}
          {(order.razorpay_order_id || order.razorpay_payment_id) && (
            <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E0E4E0", boxShadow: "0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)" }}>
              <h2 className="mb-4 font-semibold text-on-surface">Payment Info</h2>
              <div className="space-y-2 text-sm">
                {order.razorpay_order_id && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                    <span className="text-on-surface-variant">Razorpay Order ID</span>
                    <span className="break-all font-mono text-on-surface">{order.razorpay_order_id}</span>
                  </div>
                )}
                {order.razorpay_payment_id && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                    <span className="text-on-surface-variant">Payment ID</span>
                    <span className="break-all font-mono text-on-surface">{order.razorpay_payment_id}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Internal notes */}
          <InternalNotes orderId={orderId} />
        </div>

        {/* ── Right: summary + customer + address ── */}
        <div className="space-y-5">
          {/* Order summary */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E0E4E0", boxShadow: "0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)" }}>
            <h2 className="mb-4 font-semibold text-on-surface">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface">
                  {order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>−₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-outline-variant pt-2 text-base font-bold">
                <span className="text-on-surface">Total</span>
                <span className="text-on-surface">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-outline-variant pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Order Status</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLOURS[order.status] ?? ''}`}>
                  <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {STATUS_ICONS[order.status] ?? 'circle'}
                  </span>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Payment</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                  order.payment_status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-surface-container text-on-surface-variant ring-1 ring-outline-variant'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E0E4E0", boxShadow: "0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)" }}>
            <h2 className="mb-4 font-semibold text-on-surface">Customer</h2>
            {order.customer_name || order.customer_email ? (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-primary">
                  {(order.customer_name ?? order.customer_email ?? '?')[0].toUpperCase()}
                </span>
                <div className="min-w-0">
                  {order.customer_name && (
                    <p className="truncate font-semibold text-on-surface">{order.customer_name}</p>
                  )}
                  {order.customer_email && (
                    <p className="truncate text-xs text-on-surface-variant">{order.customer_email}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-on-surface-variant">Guest order</p>
            )}
          </div>

          {/* Shipping address */}
          {order.address && (
            <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E0E4E0", boxShadow: "0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)" }}>
              <h2 className="mb-4 font-semibold text-on-surface">Shipping Address</h2>
              <address className="not-italic space-y-0.5 text-sm text-on-surface-variant">
                <p className="text-on-surface">{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>
                  {order.address.city}, {order.address.state} — {order.address.pincode}
                </p>
              </address>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
