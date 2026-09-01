import { getAllProducts, getAllCategories } from '@/data/products'
import ShopClient from './ShopClient'

export default async function ShopPage() {
  const allProducts = await getAllProducts()
  const categories = await getAllCategories()

  return <ShopClient initialProducts={allProducts} categories={categories} />
}
