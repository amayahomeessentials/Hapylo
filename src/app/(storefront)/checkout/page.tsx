'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'

interface CheckoutAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [orderError, setOrderError] = useState('')

  const [form, setForm] = useState<CheckoutAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  const subtotal = getCartTotal()
  const shipping = subtotal >= 500 ? 0 : 50
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderError('')
    setLoading(true)

    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address: form }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setOrderError(data.error || 'Unable to initialize checkout. Please try again.')
        setLoading(false)
        return
      }

      // Demo or development mode fallback
      if (data.isDemo) {
        clearCart()
        router.push(`/checkout/confirmation/${data.orderId}`)
        return
      }

      // Production Razorpay Flow
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        setOrderError('Failed to load Razorpay payment gateway. Please check your internet connection.')
        setLoading(false)
        return
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'Hapylo',
        description: `Order #${data.orderNumber}`,
        image: '/icon.png',
        order_id: data.razorpayOrderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: `${form.address}, ${form.city}, ${form.state} - ${form.zipCode}`,
        },
        theme: {
          color: '#1a5f45',
        },
        handler: async (rzpResponse: any) => {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpayOrderId: rzpResponse.razorpay_order_id,
                razorpayPaymentId: rzpResponse.razorpay_payment_id,
                razorpaySignature: rzpResponse.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              clearCart()
              router.push(`/checkout/confirmation/${data.orderId}`)
            } else {
              setOrderError(verifyData.error || 'Payment verification failed. Please reach out to support.')
              setLoading(false)
            }
          } catch (err: any) {
            console.error('Verification network error:', err)
            setOrderError('Payment completed, but confirmation failed. Contact customer care with your payment ID.')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', (resp: any) => {
        setOrderError(resp.error?.description || 'Payment was cancelled or failed.')
        setLoading(false)
      })
      rzp.open()
    } catch (error: any) {
      console.error('Checkout error:', error)
      setOrderError(error?.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page-wrap flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-primary">
          <span className="material-symbols-outlined text-4xl">shopping_cart</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-on-surface">Your cart is empty</h2>
        <p className="max-w-md text-on-surface-variant">
          Add some conscious clean essentials to your bag before proceeding to checkout.
        </p>
        <Link href="/shop" className="btn-primary mt-2 px-8 py-3">
          Explore Products
        </Link>
      </div>
    )
  }

  return (
    <div className="page-wrap min-h-screen py-12">
      <nav className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link href="/cart" className="transition-colors hover:text-primary">Cart</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-bold text-primary">Checkout</span>
      </nav>

      <h1 className="mb-8 font-display text-3xl font-extrabold text-on-surface">Checkout</h1>

      {orderError && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-sale-red/20 bg-error-container p-4 text-sm text-sale-red">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{orderError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <form onSubmit={handleCheckout} className="col-span-1 md:col-span-7 lg:col-span-8 space-y-6">
          {/* Contact info */}
          <div className="rounded-xl border border-outline-variant bg-surface p-6 shadow-card">
            <h2 className="mb-6 font-display text-xl font-bold text-on-surface">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-on-surface">Email address</label>
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-on-surface">Phone number</label>
                <input
                  required
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl border border-outline-variant bg-surface p-6 shadow-card">
            <h2 className="mb-6 font-display text-xl font-bold text-on-surface">Shipping Address</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-on-surface">First Name</label>
                <input
                  required
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-on-surface">Last Name</label>
                <input
                  required
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-on-surface">Street Address</label>
                <input
                  required
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Flat no., building, street name"
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-on-surface">City</label>
                <input
                  required
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-on-surface">State</label>
                <input
                  required
                  name="state"
                  type="text"
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-on-surface">PIN Code</label>
                <input
                  required
                  name="zipCode"
                  type="text"
                  autoComplete="postal-code"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-on-surface">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full rounded-md border border-outline-variant bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="India">India</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-8 w-full py-4 text-base font-semibold shadow-primary-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Initiating Payment…</span>
                </>
              ) : (
                <>
                  <span>Pay with Razorpay — ₹{total.toFixed(2)}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
              Bank-grade 256-bit encryption • Razorpay Secure Checkout
            </p>
          </div>
        </form>

        {/* Summary Sidebar */}
        <div className="col-span-1 md:col-span-5 lg:col-span-4">
          <div className="sticky top-28 rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-bold text-on-surface">Order Summary</h2>
            <div className="mb-4 space-y-4 divide-y divide-outline-variant">
              {items.map((item, i) => {
                const img = item.product.images?.[0] || '/logo.png'
                return (
                  <div key={i} className="flex gap-3 pt-4 first:pt-0 items-center">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-outline-variant bg-surface">
                      <Image src={img} alt={item.product.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-on-surface truncate">{item.product.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {item.selectedScent ?? 'Standard'} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-on-surface shrink-0">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 space-y-2 border-t border-outline-variant pt-4 text-sm font-body">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span className="text-on-surface font-medium">
                  {shipping === 0 ? <span className="text-primary font-semibold">Free</span> : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-outline-variant pt-3 text-lg font-bold text-on-surface">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-1.5 pt-2 border-t border-outline-variant/60">
              {['UPI', 'CARDS', 'NETBANKING', 'WALLETS', 'RAZORPAY'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex h-6 min-w-[40px] items-center justify-center rounded border border-outline-variant bg-surface px-2 text-[9px] font-bold tracking-wider text-on-surface-variant"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
