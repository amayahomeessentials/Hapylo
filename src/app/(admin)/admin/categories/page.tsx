import { getAllCategoriesAdmin, getCategoryProductCount } from '@/data/admin'
import { CategoriesClient } from './CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const [categories, productCounts] = await Promise.all([
    getAllCategoriesAdmin(),
    getCategoryProductCount(),
  ])

  return <CategoriesClient categories={categories} productCounts={productCounts} />
}
