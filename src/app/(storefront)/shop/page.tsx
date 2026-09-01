import { Suspense } from 'react'
import { getAllProducts, getAllCategories } from '@/data/products'
import ShopClient from './ShopClient'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'

export default async function ShopPage() {
  const allProducts = await getAllProducts()
  const categories = await getAllCategories()

  return (
    <Suspense fallback={
      <div className="page-wrap py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ShopClient initialProducts={allProducts} categories={categories} />
    </Suspense>
  )
}
