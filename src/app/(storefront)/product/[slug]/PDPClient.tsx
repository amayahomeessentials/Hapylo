'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/database.types'
import { RatingStars } from '@/components/ui/RatingStars'
import { Badge } from '@/components/ui/Badge'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useRouter } from 'next/navigation'

interface PDPClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function PDPClient({ product, relatedProducts }: PDPClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedScent, setSelectedScent] = useState(product.scents?.[0]?.name ?? '')
  const [quantity, setQuantity] = useState(1)
  const [shareCopied, setShareCopied] = useState(false)

  const addItem = useCart(state => state.addItem)
  const { toggleItem, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const router = useRouter()

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedScent)
  }

  const handleBuyNow = () => {
    addItem(product, quantity, selectedScent)
    router.push('/checkout')
  }

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null

  const totalPrice = (product.price * quantity).toFixed(2)

  return (
    <>
      <div className="page-wrap mb-6 hidden items-center gap-2 pt-12 text-sm text-on-surface-variant md:flex">
        <Link href="/" className="transition-colors hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/shop" className="transition-colors hover:text-primary">Shop</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-medium text-primary">{product.name}</span>
      </div>

      <div className="pointer-events-none fixed top-16 z-40 flex w-full items-center justify-between px-6 py-4 md:hidden">
        <Link href="/shop" className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant bg-white/80 text-primary shadow-sm backdrop-blur-md">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={handleShare}
            title={shareCopied ? 'Link copied!' : 'Share'}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant bg-white/80 text-primary shadow-sm backdrop-blur-md"
          >
            <span className="material-symbols-outlined">{shareCopied ? 'check' : 'share'}</span>
          </button>
          <button
            onClick={() => toggleItem(product)}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant bg-white/80 shadow-sm backdrop-blur-md"
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
                color: wishlisted ? '#DC2626' : undefined,
              }}
            >favorite</span>
          </button>
        </div>
      </div>

      <div className="page-wrap grid grid-cols-1 gap-8 py-6 md:grid-cols-12 md:gap-12 md:py-12 lg:gap-16">

        <div className="flex flex-col gap-4 md:col-span-7">
          <div className="group relative aspect-[4/5] w-full overflow-hidden border border-outline-variant bg-surface-container-low md:aspect-square md:rounded-md">
            {product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            )}
            {discount && (
              <div className="absolute top-4 left-4 z-10 md:top-6 md:left-6">
                <Badge type="sale" label={`Save ${discount}%`} />
              </div>
            )}
            {product.is_best_seller && !discount && (
              <div className="absolute top-20 left-6 z-10 md:top-6 md:left-6">
                <Badge type="bestseller" />
              </div>
            )}
            {product.images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 md:hidden">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`swipe-dot ${i === selectedImage ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="hidden grid-cols-4 gap-4 md:grid">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square cursor-pointer overflow-hidden rounded-md border bg-surface-container-low transition-all ${
                    i === selectedImage ? 'border-primary opacity-100' : 'border-outline-variant opacity-70 hover:border-outline hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} width={200} height={200} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

          <div className="flex flex-col gap-6 rounded-lg bg-surface px-0 py-6 md:col-span-5 md:border md:border-outline-variant md:p-8 md:shadow-card">
          {product.rating && (
            <RatingStars rating={product.rating} reviewCount={product.review_count} />
          )}

          <div>
            <p className="mb-3 text-xs font-extrabold tracking-[0.14em] text-accent uppercase">Hapylo essentials</p><h1 className="mb-2 font-display text-3xl font-extrabold tracking-[-0.04em] text-on-surface md:text-4xl">
              {product.name}
            </h1>
            {product.scents && (
              <p className="text-lg text-on-surface-variant">
                {selectedScent} Scent • {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-primary">₹{product.price.toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-lg text-outline line-through">₹{product.compare_at_price.toFixed(2)}</span>
            )}
            <span className="rounded-md bg-secondary-container px-2 py-1 text-caption font-semibold text-primary">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <p className="text-base leading-relaxed text-on-surface-variant">
            {product.description}
          </p>

          {product.scents && product.scents.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="font-label text-label-md text-on-surface">
                Scent: <span className="font-normal text-primary">{selectedScent}</span>
              </span>
              <div className="flex gap-3">
                {product.scents.map(scent => (
                  <button
                    key={scent.name}
                    onClick={() => setSelectedScent(scent.name)}
                    title={scent.name}
                    className={`h-12 w-12 rounded-full border-2 p-1 transition-all ${
                      selectedScent === scent.name ? 'border-primary' : 'border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <div className="h-full w-full rounded-full" style={{ backgroundColor: scent.color }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 hidden flex-col gap-6 md:flex">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-on-surface">Quantity</span>
              <div className="flex h-12 w-32 items-center overflow-hidden rounded-md border border-outline-variant bg-surface">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex h-full w-10 items-center justify-center text-on-surface-variant transition-colors hover:bg-secondary-container hover:text-primary"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="w-12 text-center text-base font-semibold text-on-surface">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="flex h-full w-10 items-center justify-center text-on-surface-variant transition-colors hover:bg-secondary-container hover:text-primary"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button 
                onClick={handleAddToCart}
                className="btn-primary flex flex-1 items-center justify-center gap-2 py-4 text-base"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="btn-secondary flex-1 py-4 text-base"
              >
                Buy Now
              </button>
            </div>

            <p className="flex items-center justify-center gap-2 text-center text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              Free shipping on orders over ₹500
            </p>
          </div>

          <hr className="my-4 border-outline-variant" />

          <div className="flex flex-col gap-4">
            <AccordionItem icon="auto_awesome" title="Key Features" defaultOpen>
              <ul className="list-disc space-y-2 pl-5 text-base text-on-surface-variant">
                <li>Plant-derived cleaning enzymes</li>
                <li>Free of dyes and artificial brighteners</li>
                <li>Dermatologist tested & hypoallergenic</li>
                <li>Greywater and septic safe</li>
              </ul>
            </AccordionItem>

            <AccordionItem icon="science" title="Ingredients">
              <p className="text-base leading-relaxed text-on-surface-variant">
                Water, Laureth-7 (plant-derived cleanser), Sodium Lauryl Sulfate (plant-derived cleanser),
                Glycerin (plant-derived solvent), Protease & Amylase (plant-derived enzyme blend).
              </p>
            </AccordionItem>

            <AccordionItem icon="local_shipping" title="Shipping & Returns">
              <p className="text-base leading-relaxed text-on-surface-variant">
                Free carbon-neutral shipping on orders over ₹500. Try it risk-free for 30 days.
                If you don&apos;t love it, returns are on us.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="page-wrap mt-16 border-t border-outline-variant pt-16 pb-24">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-h2 tracking-tight text-on-surface">
              You May Also Like
            </h2>
            <Link href="/shop" className="flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-hover">
              Shop All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}

      <div className="glass-panel fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between px-6 py-4 pb-safe md:hidden">
        <div className="flex items-center rounded-md border border-outline-variant bg-surface p-1">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-primary transition-colors hover:bg-secondary-container"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
          <span className="w-8 text-center font-label text-label-md">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-primary transition-colors hover:bg-secondary-container"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="btn-primary ml-4 flex flex-grow items-center justify-center gap-2 px-6 py-3 text-sm"
        >
          <span>Add to Cart</span>
          <span>·</span>
          <span>₹{totalPrice}</span>
        </button>
      </div>
    </>
  )
}

function AccordionItem({
  icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: string
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-md border border-outline-variant bg-surface-container-low p-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full cursor-pointer items-center justify-between text-lg font-semibold text-on-surface"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          <span>{title}</span>
        </div>
        <span
          className="material-symbols-outlined text-outline transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="mt-4 pl-9">
          {children}
        </div>
      )}
    </div>
  )
}
