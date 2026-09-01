import Link from 'next/link'
import Image from 'next/image'
import { getAllProductsAdmin } from '@/data/admin'
import { DeleteProductButton } from './DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-on-surface">Products</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{products.length} total products in database</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary px-5 py-2.5 text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">inventory_2</span>
          <p className="font-semibold text-on-surface">No products yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">Add your first product to get started.</p>
          <Link href="/admin/products/new" className="btn-primary mt-6 px-5 py-2.5 text-sm">
            Add Product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-on-surface-variant">Product</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-on-surface-variant sm:table-cell">Category</th>
                <th className="px-4 py-3 text-right font-semibold text-on-surface-variant">Price</th>
                <th className="hidden px-4 py-3 text-right font-semibold text-on-surface-variant md:table-cell">Stock</th>
                <th className="px-4 py-3 text-center font-semibold text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-surface-container-low">
                  {/* Product name + thumbnail */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-outline">image</span>
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-on-surface">{product.name}</p>
                        <p className="truncate text-xs text-on-surface-variant">{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="hidden px-4 py-3 text-on-surface-variant sm:table-cell">
                    {(product.category as { name?: string } | null)?.name ?? '—'}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-right font-medium text-on-surface">
                    ₹{product.price.toFixed(2)}
                    {product.compare_at_price && (
                      <span className="ml-1 text-xs text-on-surface-variant line-through">
                        ₹{product.compare_at_price.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="hidden px-4 py-3 text-right md:table-cell">
                    <span className={product.stock <= 5 ? 'font-semibold text-error' : 'text-on-surface'}>
                      {product.stock}
                    </span>
                  </td>

                  {/* Status badges */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        product.is_active
                          ? 'bg-secondary-container text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {product.is_featured && (
                        <span className="inline-flex items-center rounded-full bg-primary-fixed px-2 py-0.5 text-xs font-semibold text-on-primary-fixed">
                          Featured
                        </span>
                      )}
                      {product.is_best_seller && (
                        <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                        aria-label="Edit product"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
