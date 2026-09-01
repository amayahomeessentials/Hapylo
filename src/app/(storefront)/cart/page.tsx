'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/types/database.types'
import { useCart } from '@/hooks/useCart'

// Valid promo codes — in production these would be stored in the DB
const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  HAPYLO10: { discount: 0.10, label: 'HAPYLO10' },
  CLEAN20: { discount: 0.20, label: 'CLEAN20' },
  WELCOME15: { discount: 0.15, label: 'WELCOME15' },
}

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getCartTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState<string | null>(null)
  const [promoError, setPromoError] = useState('')

  const updateQty = (productId: string, delta: number, currentQty: number, selectedScent?: string) => {
    updateQuantity(productId, currentQty + delta, selectedScent)
  }

  const removeCartItem = (productId: string, selectedScent?: string) => {
    removeItem(productId, selectedScent)
  }

  const handleApplyPromo = () => {
    setPromoError('')
    const code = promoCode.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setPromoApplied(code)
    } else {
      setPromoApplied(null)
      setPromoError('Invalid promo code. Try HAPYLO10.')
    }
  }

  const handleRemovePromo = () => {
    setPromoApplied(null)
    setPromoCode('')
    setPromoError('')
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 50 ? 0 : 5
  const discountRate = promoApplied ? PROMO_CODES[promoApplied].discount : 0
  const discount = subtotal * discountRate
  const total = subtotal + shipping - discount

  return (
    <div className="min-h-screen bg-background">
      <div className="page-wrap hidden py-12 md:block">
        <div className="mb-12 rounded-lg bg-primary px-10 py-10 text-white shadow-lg"><span className="eyebrow text-primary-fixed">Your selection</span><h1 className="mt-3 font-display text-h1 font-extrabold tracking-[-0.04em] text-white">Your Cart</h1><p className="mt-2 text-white/70">Everything you need for a cleaner reset.</p></div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-8 space-y-6">
              {items.map(item => (
                <CartItemRow
                  key={`${item.product.id}-${item.selectedScent}`}
                  item={item}
                  onUpdateQty={(delta) => updateQty(item.product.id, delta, item.quantity, item.selectedScent)}
                  onRemove={() => removeCartItem(item.product.id, item.selectedScent)}
                />
              ))}
            </div>

            <div className="col-span-4">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoApplied={promoApplied}
                promoError={promoError}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
              />
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden">
        <header className="sticky top-16 z-30 flex items-center justify-between border-b border-outline-variant bg-surface/90 px-6 py-4 shadow-sm backdrop-blur-md">
          <Link href="/shop" className="-ml-2 rounded-md p-2 text-on-surface transition-colors hover:bg-secondary-container">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Link>
          <h1 className="font-display text-h4 text-on-surface">Your Cart</h1>
          <div className="w-[40px]" />
        </header>

        <div className="flex flex-col gap-4 px-6 py-6 pb-32">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {items.map(item => (
                <MobileCartItem
                  key={`${item.product.id}-${item.selectedScent}`}
                  item={item}
                  onUpdateQty={(delta) => updateQty(item.product.id, delta, item.quantity, item.selectedScent)}
                  onRemove={() => removeCartItem(item.product.id, item.selectedScent)}
                />
              ))}

              <div className="space-y-2">
                <div className="relative flex w-full items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[20px] text-outline">sell</span>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError('') }}
                    placeholder="Promo code"
                    className="w-full rounded-md border border-outline-variant bg-surface py-3 pr-24 pl-10 font-body text-body-md outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-accent/30"
                  />
                  <button
                    onClick={promoApplied ? handleRemovePromo : handleApplyPromo}
                    className="absolute right-2 px-2 py-1 font-label text-label-md text-primary transition-colors hover:text-primary-hover"
                  >
                    {promoApplied ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-xs text-sale-red">{promoError}</p>}
                {promoApplied && <p className="text-xs text-primary">✓ Code applied — {Math.round(discountRate * 100)}% off!</p>}
              </div>

              <div className="mt-4 rounded-md border border-outline-variant bg-surface p-6 shadow-card">
                <h2 className="mb-4 font-display text-h4 text-on-surface">Order Summary</h2>
                <div className="mb-6 flex flex-col gap-2 font-body text-body-md text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-on-surface">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-accent">
                      <span>Discount ({promoApplied})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between border-t border-outline-variant pt-4">
                  <span className="font-label text-label-md text-on-surface">Total</span>
                  <span className="font-display text-headline-lg-mobile text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="fixed right-0 bottom-0 left-0 z-40 flex w-full flex-col gap-2 border-t border-outline-variant bg-surface/90 px-6 py-4 pb-safe backdrop-blur-lg">
          <p className="mb-1 text-center font-label text-caption text-on-surface-variant">Taxes calculated at checkout</p>
          <button
            onClick={() => router.push('/checkout')}
            disabled={items.length === 0}
            className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-sm disabled:opacity-50"
          >
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function CartItemRow({ item, onUpdateQty, onRemove }: {
  item: CartItem
  onUpdateQty: (delta: number) => void
  onRemove: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-md border border-outline-variant bg-surface p-6 shadow-card sm:flex-row sm:items-center">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
        <Image src={item.product.images[0]} alt={item.product.name} width={96} height={96} className="h-full w-full object-cover" />
      </div>
      <div className="flex-grow">
        <h3 className="mb-1 font-display text-h5 text-on-surface">{item.product.name}</h3>
        <p className="text-sm text-on-surface-variant">
          {/* Fixed: show selectedScent, not the first product scent */}
          {item.selectedScent ?? 'Standard'} · {item.product.stock > 0 ? 'In Stock' : 'Limited'}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center overflow-hidden rounded-md border border-outline-variant bg-surface">
          <button onClick={() => onUpdateQty(-1)} className="px-3 py-2 text-on-surface-variant transition-colors hover:bg-secondary-container">
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <span className="min-w-[32px] px-2 text-center text-sm font-semibold">{item.quantity}</span>
          <button onClick={() => onUpdateQty(1)} className="px-3 py-2 text-on-surface-variant transition-colors hover:bg-secondary-container">
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
        <div className="w-20 text-right">
          <span className="font-display text-lg font-bold text-on-surface">${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
        <button
          onClick={onRemove}
          className="rounded-md p-2 text-outline transition-colors hover:bg-error-container hover:text-sale-red"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  )
}

function MobileCartItem({ item, onUpdateQty, onRemove }: {
  item: CartItem
  onUpdateQty: (delta: number) => void
  onRemove: () => void
}) {
  return (
    <div className="flex gap-4 rounded-md border border-outline-variant bg-surface p-4 shadow-card">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md">
        <Image src={item.product.images[0]} alt={item.product.name} width={96} height={96} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-1 font-label text-label-md text-on-surface">{item.product.name}</h3>
            {/* Fixed: show selectedScent */}
            <p className="font-label text-caption text-outline">{item.selectedScent ?? 'Standard'} · In Stock</p>
          </div>
          <button onClick={onRemove} className="-mt-1 -mr-1 rounded-md p-1 text-outline-variant transition-colors hover:text-error-vivid">
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <span className="font-display text-h4 text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
          <div className="flex items-center rounded-md border border-outline-variant bg-surface-container-low px-2 py-1">
            <button onClick={() => onUpdateQty(-1)} className="flex items-center justify-center rounded-md p-1 text-on-surface-variant hover:bg-outline-variant/20">
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="w-6 text-center font-label text-label-md text-on-surface">{item.quantity}</span>
            <button onClick={() => onUpdateQty(1)} className="flex items-center justify-center rounded-md p-1 text-on-surface-variant hover:bg-outline-variant/20">
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({ subtotal, shipping, discount, total, promoCode, setPromoCode, promoApplied, promoError, onApplyPromo, onRemovePromo }: {
  subtotal: number
  shipping: number
  discount: number
  total: number
  promoCode: string
  setPromoCode: (v: string) => void
  promoApplied: string | null
  promoError: string
  onApplyPromo: () => void
  onRemovePromo: () => void
}) {
  const router = useRouter()
  return (
    <div className="sticky top-28 rounded-md border border-outline-variant bg-surface p-8 shadow-card">
      <p className="mb-3 text-xs font-extrabold tracking-[0.15em] text-accent uppercase">Order details</p>
      <h2 className="mb-6 font-display text-h3 text-on-surface">Order Summary</h2>
      <div className="mb-6 space-y-4 border-b border-outline-variant pb-6">
        <div className="flex justify-between text-base text-on-surface-variant">
          <span>Subtotal</span>
          <span className="text-on-surface">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base text-on-surface-variant">
          <span>Shipping</span>
          <span className="text-on-surface">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        {promoApplied && (
          <div className="flex justify-between text-base font-medium text-accent">
            <span>Discount ({promoApplied})</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mb-2 flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={e => setPromoCode(e.target.value)}
          placeholder="Promo code"
          disabled={!!promoApplied}
          className="flex-1 rounded-md border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
        />
        <button
          onClick={promoApplied ? onRemovePromo : onApplyPromo}
          className="btn-secondary px-4 py-3 text-sm"
        >
          {promoApplied ? 'Remove' : 'Apply'}
        </button>
      </div>
      {promoError && <p className="mb-4 text-xs text-sale-red">{promoError}</p>}
      {promoApplied && <p className="mb-4 text-xs text-primary">✓ Code applied!</p>}

      <div className="mb-8 flex justify-between text-xl font-bold text-on-surface">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button
        onClick={() => router.push('/checkout')}
        className="btn-primary w-full py-4"
      >
        Proceed to Checkout
      </button>
      <p className="mt-4 text-center text-caption text-on-surface-variant">Secure checkout powered by Hapylo.</p>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-md border border-outline-variant bg-secondary-container">
        <span className="material-symbols-outlined text-5xl text-primary">shopping_cart</span>
      </div>
      <h2 className="font-display text-h2 text-on-surface">Your cart is empty</h2>
      <p className="max-w-md text-lg text-on-surface-variant">
        Looks like you haven&apos;t added anything yet. Explore our plant-powered range and find something you&apos;ll love.
      </p>
      <Link
        href="/shop"
        className="btn-primary mt-4 px-10 py-4"
      >
        Shop Now
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </Link>
    </div>
  )
}
