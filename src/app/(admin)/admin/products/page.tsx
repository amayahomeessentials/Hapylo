import { getAllProductsAdmin, getAllCategoriesAdmin } from '@/data/admin'
import { ProductsClient } from './ProductsClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getAllCategoriesAdmin(),
  ])

  return <ProductsClient products={products} categories={categories} />
}
