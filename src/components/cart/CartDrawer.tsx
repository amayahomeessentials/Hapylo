'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

const FREE_SHIPPING_THRESHOLD = 500

export function CartDrawer() {
  const router = useRouter()
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShipping,
    getTotal,
    getItemCount,
  } = useCart()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()
  const itemCount = getItemCount()
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  const handleViewCart = () => {
    closeCart()
    router.push('/cart')
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[9995] flex w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out sm:border-l sm:border-outline-variant ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping Cart Drawer"
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-primary">shopping_bag</span>
            <h2 className="font-display text-lg font-bold text-on-surface">Your Bag</h2>
            <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label text-xs font-semibold text-primary">
              {itemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Free shipping progress bar */}
        {items.length > 0 && (
          <div className="border-b border-outline-variant bg-surface-container-low px-6 py-3">
            <div className="mb-1.5 flex items-center justify-between font-label text-xs">
              <span className="font-medium text-on-surface">
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-primary font-bold">🎉 You unlocked FREE standard shipping!</span>
                ) : (
                  <>
                    Add <span className="font-bold text-primary">₹{amountNeededForFreeShipping.toFixed(0)}</span> more for free shipping
                  </>
                )}
              </span>
              <span className="text-on-surface-variant font-medium">
                ₹{subtotal.toFixed(0)} / ₹{FREE_SHIPPING_THRESHOLD}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-primary">
                <span className="material-symbols-outlined text-4xl">shopping_cart</span>
              </div>
              <h3 className="font-display text-lg font-bold text-on-surface">Your cart is empty</h3>
              <p className="max-w-xs text-sm text-on-surface-variant">
                Looks like you haven&apos;t added any clean essentials yet.
              </p>
              <button
                onClick={() => {
                  closeCart()
                  router.push('/shop')
                }}
                className="btn-primary mt-2 px-6 py-2.5 text-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-outline-variant/60">
              {items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedScent || 'default'}`
                const itemImage = item.product.images?.[0] || '/logo.png'

                return (
                  <div key={itemKey} className="flex gap-4 pt-4 first:pt-0">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
                      <Image
                        src={itemImage}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-medium text-sm text-on-surface hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedScent)}
                            className="text-outline hover:text-sale-red transition-colors p-0.5"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>

                        {item.selectedScent && (
                          <span className="inline-block mt-0.5 font-label text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                            {item.selectedScent}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-md border border-outline-variant bg-surface">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedScent
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center text-on-surface-variant hover:bg-secondary-container transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                          </button>
                          <span className="min-w-[28px] text-center font-label text-xs font-semibold text-on-surface">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedScent
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center text-on-surface-variant hover:bg-secondary-container transition-colors"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>

                        <span className="font-display text-sm font-bold text-on-surface">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant bg-surface p-6 space-y-4">
            <div className="space-y-1.5 font-body text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span className="text-on-surface font-medium">
                  {shipping === 0 ? (
                    <span className="text-primary font-semibold">Free</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/60 pt-2 font-display text-base font-bold text-on-surface">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-primary-glow"
              >
                <span>Checkout</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={handleViewCart}
                className="btn-secondary w-full py-2.5 text-sm font-medium"
              >
                View Bag & Details
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">eco</span> Plant Powered
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">lock</span> Secure Payment
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
