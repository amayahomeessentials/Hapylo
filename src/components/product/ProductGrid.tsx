import { Product } from '@/types/database.types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductGrid({ products, columns = 4, onAddToCart, className = '' }: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns]

  return (
    <div className={`grid ${colClass} gap-4 gap-y-8 md:gap-6 lg:gap-8 ${className}`}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
