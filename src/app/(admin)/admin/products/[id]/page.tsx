import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllCategoriesAdmin, getProductByIdAdmin } from '@/data/admin'
import { ProductForm } from '../ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductByIdAdmin(id),
    getAllCategoriesAdmin(),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-on-surface">Edit Product</h1>
          <p className="mt-0.5 text-sm text-on-surface-variant">{product.name}</p>
        </div>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}
