import Link from 'next/link'
import { getAllCategoriesAdmin } from '@/data/admin'
import { ProductForm } from '../ProductForm'

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin()

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
          <h1 className="font-display text-3xl font-extrabold text-on-surface">New Product</h1>
          <p className="mt-0.5 text-sm text-on-surface-variant">Fill in the details and upload images via Cloudinary.</p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
