'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/types/database.types'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'

interface ProductCardProps {
  product: Product
  /** @deprecated onAddToCart is no longer needed — ProductCard uses useCart directly */
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false)
  const addItem = useCart((state) => state.addItem)
  const openCart = useCart((state) => state.openCart)
  const { toggleItem, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (addedToCart) {
      openCart()
      return
    }

    addItem(product, 1, product.scents?.[0]?.name)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 4000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-fixed-dim hover:shadow-card-hover ${className}`}
    >
      {/* Image container — shorter on mobile, taller on desktop */}
      <div className="relative aspect-square md:aspect-[3/4] overflow-hidden bg-surface-container-low">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Desktop hover overlay — hidden on mobile */}
        <div className="absolute right-0 bottom-0 left-0 z-20 hidden translate-y-full bg-gradient-to-t from-primary/85 to-transparent p-3 pt-10 transition-transform duration-500 ease-out group-hover:translate-y-0 md:block">
          <button
            onClick={handleAddToCart}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold shadow-md transition-all duration-200 ${
              addedToCart
                ? 'bg-secondary-container text-primary'
                : 'btn-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {addedToCart ? 'check_circle' : 'add_shopping_cart'}
            </span>
            {addedToCart ? 'Added!' : 'Add to Cart'}
          </button>
        </div>

        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              type={product.badge}
              label={product.badge === 'sale' && discount ? `Sale -${discount}%` : undefined}
            />
          </div>
        )}

        <button
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 rounded-full bg-white/95 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-secondary-container"
        >
          <span
            className="material-symbols-outlined text-[18px] transition-colors"
            style={{
              fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
              color: wishlisted ? '#DC2626' : undefined,
            }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-grow flex-col gap-1 p-2.5 md:p-4">
        {product.rating !== undefined && (
          <div className="flex items-center gap-0.5">
            <span
              className="material-symbols-outlined text-[13px] text-accent"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-[11px] text-on-surface-variant md:text-caption">
              {product.rating} ({product.review_count})
            </span>
          </div>
        )}

        <h3 className="line-clamp-2 text-[13px] leading-snug font-semibold text-on-surface transition-colors group-hover:text-primary md:text-base">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 pt-1">
          <span className="font-display text-base font-bold text-on-surface md:text-lg">
            ₹{product.price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-[11px] text-on-surface-variant line-through md:text-sm">
              ₹{product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobile Add to Cart — always visible on mobile, hidden on desktop */}
        <button
          onClick={handleAddToCart}
          className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold shadow-sm transition-all duration-200 md:hidden ${
            addedToCart
              ? 'bg-secondary-container text-primary ring-1 ring-primary/25'
              : 'bg-primary text-white active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">
            {addedToCart ? 'shopping_bag' : 'add_shopping_cart'}
          </span>
          <span>{addedToCart ? 'Go to Cart →' : 'Add to Cart'}</span>
        </button>
      </div>
    </Link>
  )
}
