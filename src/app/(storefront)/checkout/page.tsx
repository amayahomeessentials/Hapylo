'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const subtotal = getCartTotal()
  const shipping = subtotal >= 50 ? 0 : 5
  const total = subtotal + shipping

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Example call to our newly created API
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address: {} })
      })
      
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        setLoading(false)
        return
      }

      // In a real app, this is where you'd open the Razorpay widget
      // using the data.orderId returned from the API.
      
      alert('Order placed successfully! (Dummy flow)')
      clearCart()
      router.push('/')
      
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-4 font-display text-2xl font-bold">Your cart is empty</h2>
        <button onClick={() => router.push('/shop')} className="btn-primary px-8 py-3">
          Return to Shop
        </button>
      </div>
    )
  }

  return (
    <div className="page-wrap min-h-screen py-12">
      <h1 className="mb-8 font-display text-3xl font-extrabold text-on-surface">Checkout</h1>
      
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <form onSubmit={handleCheckout} className="col-span-1 md:col-span-7 lg:col-span-8">
          <div className="rounded-lg border border-outline-variant bg-surface p-6 shadow-sm">
            <h2 className="mb-6 font-display text-xl font-bold">Shipping Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium">First Name</label>
                <input required type="text" className="w-full rounded-md border border-outline-variant px-4 py-2" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium">Last Name</label>
                <input required type="text" className="w-full rounded-md border border-outline-variant px-4 py-2" />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium">Address</label>
                <input required type="text" className="w-full rounded-md border border-outline-variant px-4 py-2" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium">City</label>
                <input required type="text" className="w-full rounded-md border border-outline-variant px-4 py-2" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-sm font-medium">Zip Code</label>
                <input required type="text" className="w-full rounded-md border border-outline-variant px-4 py-2" />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary mt-8 w-full py-4 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>

        <div className="col-span-1 md:col-span-5 lg:col-span-4">
          <div className="rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <h2 className="mb-4 font-display text-xl font-bold">Order Summary</h2>
            <div className="mb-4 space-y-4 divide-y divide-outline-variant">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between pt-4 first:pt-0">
                  <div className="text-sm">
                    <p className="font-medium text-on-surface">{item.product.name}</p>
                    <p className="text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 border-t border-outline-variant pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-outline-variant pt-2 text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
