'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/types/database.types'
import { Badge } from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductCard({ product, onAddToCart, className = '' }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(w => !w)
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-md border border-outline-variant bg-surface shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-primary-fixed-dim hover:shadow-card-hover ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        <div className="absolute right-0 bottom-0 left-0 z-20 translate-y-full bg-gradient-to-t from-primary/85 to-transparent p-4 pt-12 transition-transform duration-500 ease-out group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className={`flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold shadow-md transition-all duration-200 ${
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
          className="absolute top-3 right-3 z-10 rounded-full bg-white/95 p-2.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-secondary-container"
        >
          <span
            className="material-symbols-outlined text-[20px] transition-colors"
            style={{
              fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
              color: wishlisted ? '#DC2626' : undefined,
            }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-2 p-4">
        {product.rating !== undefined && (
          <div className="mb-1 flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[16px] text-accent"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-caption text-on-surface-variant">
              {product.rating} ({product.review_count})
            </span>
          </div>
        )}

        <h3 className="line-clamp-2 text-base leading-snug font-semibold text-on-surface transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="font-display text-lg font-bold text-on-surface">
            ${product.price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-sm text-on-surface-variant line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
