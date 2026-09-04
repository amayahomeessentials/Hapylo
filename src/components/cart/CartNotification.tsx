'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'

export function CartNotification() {
  const { notificationOpen, lastAddedItem, closeNotification, openCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!notificationOpen) return

    const timer = setTimeout(() => {
      closeNotification()
    }, 4500)

    return () => clearTimeout(timer)
  }, [notificationOpen, lastAddedItem, closeNotification])

  if (!mounted || !notificationOpen || !lastAddedItem) return null

  const { product, quantity, selectedScent } = lastAddedItem
  const itemImage = product.images?.[0] || '/logo.png'

  const handleGoToCart = () => {
    closeNotification()
    openCart()
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-4 right-4 z-[9990] mx-auto max-w-md md:hidden animate-slide-up"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface/95 p-3 shadow-2xl backdrop-blur-md">
        {/* Product thumbnail */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-low">
          <Image
            src={itemImage}
            alt={product.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        {/* Product info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>Added to bag</span>
          </div>
          <p className="truncate font-display text-xs font-bold text-on-surface">
            {product.name}
          </p>
          <p className="truncate text-[11px] text-on-surface-variant">
            {selectedScent ? `${selectedScent} · ` : ''}Qty: {quantity}
          </p>
        </div>

        {/* Action: Go to Cart */}
        <button
          onClick={handleGoToCart}
          className="btn-primary flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold shadow-primary-glow"
        >
          <span>Go to Cart</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>

        {/* Dismiss button */}
        <button
          onClick={closeNotification}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          aria-label="Dismiss notification"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  )
}
