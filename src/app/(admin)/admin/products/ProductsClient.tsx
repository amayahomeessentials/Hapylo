'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product, Category } from '@/types/database.types'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

type SortKey = 'name' | 'price' | 'stock' | 'created_at'
type SortDir = 'asc' | 'desc'

interface ProductsClientProps {
  products: Product[]
  categories: Category[]
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const router = useRouter()

  // ── Filters / sort state ────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // ── Delete modal state ──────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ── Derived list ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...products]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== 'all') {
      list = list.filter(p => p.category_id === categoryFilter)
    }

    if (statusFilter === 'active') list = list.filter(p => p.is_active)
    if (statusFilter === 'inactive') list = list.filter(p => !p.is_active)

    list.sort((a, b) => {
      let av: number | string
      let bv: number | string
      if (sortKey === 'name') { av = a.name; bv = b.name }
      else if (sortKey === 'price') { av = a.price; bv = b.price }
      else if (sortKey === 'stock') { av = a.stock; bv = b.stock }
      else { av = a.created_at ?? ''; bv = b.created_at ?? '' }

      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [products, search, categoryFilter, statusFilter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="material-symbols-outlined text-[14px] opacity-30">unfold_more</span>
    return (
      <span className="material-symbols-outlined text-[14px] text-primary">
        {sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    )
  }

  // ── Delete handler ──────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  // ── Status badge helper ─────────────────────────────────────────────────────
  function StatusBadges({ product }: { product: Product }) {
    return (
      <div className="flex flex-wrap items-center gap-1">
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
    )
  }

  const activeCount = products.filter(p => p.is_active).length
  const lowStockCount = products.filter(p => p.stock <= 5).length

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface md:text-3xl">Products</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
            <span>{products.length} total</span>
            <span className="text-emerald-600 font-medium">{activeCount} active</span>
            {lowStockCount > 0 && (
              <span className="font-medium text-amber-600">
                <span className="material-symbols-outlined text-[14px] align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>{' '}
                {lowStockCount} low stock
              </span>
            )}
          </div>
        </div>
        <Link href="/admin/products/new" className="btn-primary px-5 py-2.5 text-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Product
        </Link>
      </div>

      {/* ── Filters bar ── */}
      <div className="mb-5 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 w-full text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="input text-sm w-auto min-w-[140px]"
        >
          <option value="all">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="input text-sm w-auto min-w-[120px]"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* ── Results count ── */}
      {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
        <p className="mb-4 text-sm text-on-surface-variant">
          Showing <span className="font-semibold text-on-surface">{filtered.length}</span> of {products.length} products
          {' '}
          <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all') }} className="ml-1 text-primary hover:underline font-medium">
            Clear filters
          </button>
        </p>
      )}

      {/* ── Empty state ── */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">inventory_2</span>
          <p className="font-semibold text-on-surface">No products yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">Add your first product to get started.</p>
          <Link href="/admin/products/new" className="btn-primary mt-6 px-5 py-2.5 text-sm">
            Add Product
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-outline-variant bg-surface py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-5xl text-outline">search_off</span>
          <p className="font-semibold text-on-surface">No products match your filters</p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all') }}
            className="mt-4 text-sm font-bold text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-on-surface"
                    >
                      Product <SortIcon col="name" />
                    </button>
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant lg:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleSort('price')}
                      className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-on-surface"
                    >
                      Price <SortIcon col="price" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleSort('stock')}
                      className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-on-surface"
                    >
                      Stock <SortIcon col="stock" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map(product => (
                  <tr key={product.id} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="44px" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center">
                              <span className="material-symbols-outlined text-xl text-outline">image</span>
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-on-surface">{product.name}</p>
                          <p className="truncate text-xs text-on-surface-variant">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-on-surface-variant lg:table-cell">
                      {(product.category as { name?: string } | null)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-on-surface">
                      ₹{product.price.toFixed(2)}
                      {product.compare_at_price && (
                        <span className="ml-1 text-xs text-on-surface-variant line-through">
                          ₹{product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <span className={product.stock <= 5 ? 'font-bold text-error' : 'text-on-surface'}>
                        {product.stock}
                      </span>
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="ml-1 text-[10px] text-amber-600">low</span>
                      )}
                      {product.stock === 0 && (
                        <span className="ml-1 text-[10px] text-error">out</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadges product={product} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                          aria-label="Edit product"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-error hover:text-error"
                          aria-label="Delete product"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list (< md) ── */}
          <div className="grid gap-3 md:hidden">
            {filtered.map(product => (
              <div
                key={product.id}
                className="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface p-3.5 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-outline">image</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{product.name}</p>
                  <p className="text-xs text-on-surface-variant truncate mb-1.5">
                    {(product.category as { name?: string } | null)?.name ?? 'Uncategorised'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-bold text-on-surface">₹{product.price.toFixed(2)}</span>
                    <span className={product.stock <= 5 ? 'font-semibold text-error' : 'text-on-surface-variant'}>
                      {product.stock <= 5 && (
                        <span className="material-symbols-outlined text-[12px] align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                      )}{' '}
                      {product.stock} in stock
                    </span>
                  </div>
                  <div className="mt-2">
                    <StatusBadges product={product} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-1.5">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                    aria-label="Edit product"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-error hover:text-error"
                    aria-label="Delete product"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Delete confirm modal ── */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete product?"
        message={`"${deleteTarget?.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  )
}
