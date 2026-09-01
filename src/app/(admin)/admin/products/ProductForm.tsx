'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Category, Product } from '@/types/database.types'

interface ProductFormProps {
  product?: Product          // undefined = create, defined = edit
  categories: Category[]
}

const BADGE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'bestseller', label: 'Best Seller' },
  { value: 'sale', label: 'Sale' },
  { value: 'eco', label: 'Eco' },
  { value: 'new', label: 'New' },
]

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Form state ──────────────────────────────────────────────────────────────
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [compareAtPrice, setCompareAtPrice] = useState(
    String(product?.compare_at_price ?? '')
  )
  const [stock, setStock] = useState(String(product?.stock ?? '0'))
  const [badge, setBadge] = useState<string>(product?.badge ?? '')
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false)
  const [isBestSeller, setIsBestSeller] = useState(product?.is_best_seller ?? false)
  const [isActive, setIsActive] = useState(product?.is_active ?? true)

  // ── Image state ─────────────────────────────────────────────────────────────
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploadingCount, setUploadingCount] = useState(0)
  const [uploadError, setUploadError] = useState('')

  // ── Submission state ────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ── Auto-generate slug from name ────────────────────────────────────────────
  function handleNameChange(val: string) {
    setName(val)
    if (!product) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      )
    }
  }

  // ── Cloudinary upload ───────────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadError('')
    setUploadingCount(files.length)

    // Get signed params from our API
    const sigRes = await fetch('/api/admin/cloudinary-sign')
    if (!sigRes.ok) {
      setUploadError('Could not get upload signature — are you signed in?')
      setUploadingCount(0)
      return
    }
    const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json()

    const uploaded: string[] = []

    await Promise.all(
      files.map(async (file) => {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('timestamp', String(timestamp))
        fd.append('signature', signature)
        fd.append('folder', folder)
        fd.append('api_key', apiKey)

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: fd }
        )
        if (res.ok) {
          const data = await res.json()
          uploaded.push(data.secure_url as string)
        }
      })
    )

    setImages((prev) => [...prev, ...uploaded])
    setUploadingCount(0)
    // Reset file input so same files can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  function moveImage(from: number, to: number) {
    setImages((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      ...(product?.id ? { id: product.id } : {}),
      name,
      slug,
      description: description || null,
      category_id: categoryId || null,
      price: parseFloat(price),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      stock: parseInt(stock, 10),
      images,
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
      is_active: isActive,
      badge: (badge || null) as Product['badge'],
    }

    const res = await fetch('/api/admin/products', {
      method: product?.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Failed to save product.')
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-error-container bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {/* ── Basic info ── */}
      <section className="surface-card p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-on-surface">Basic Info</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Product Name</label>
            <input
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Concentrated Laundry Wash"
              className="input mt-1"
            />
          </div>

          <div>
            <label className="label">Slug (URL)</label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="concentrated-laundry-wash"
              className="input mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input mt-1"
            >
              <option value="">— Uncategorised —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What makes this product special?"
              className="input mt-1 resize-y"
            />
          </div>
        </div>
      </section>

      {/* ── Pricing & stock ── */}
      <section className="surface-card p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-on-surface">Pricing & Stock</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label">Price (₹)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="24.00"
              className="input mt-1"
            />
          </div>
          <div>
            <label className="label">Compare-at Price (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="28.00 (optional)"
              className="input mt-1"
            />
          </div>
          <div>
            <label className="label">Stock</label>
            <input
              required
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="100"
              className="input mt-1"
            />
          </div>
        </div>
      </section>

      {/* ── Images ── */}
      <section className="surface-card p-6">
        <h2 className="mb-1 font-display text-lg font-bold text-on-surface">Images</h2>
        <p className="mb-5 text-sm text-on-surface-variant">
          First image is the cover. Drag to reorder (coming soon). Uploaded to Cloudinary.
        </p>

        {uploadError && (
          <p className="mb-3 text-sm text-error">{uploadError}</p>
        )}

        {/* Existing images */}
        {images.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
                <Image src={url} alt={`Product image ${i + 1}`} fill className="object-cover" sizes="96px" />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-primary/80 py-0.5 text-center text-[10px] font-bold text-white">
                    Cover
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      className="rounded bg-white/20 p-1 text-white hover:bg-white/40"
                      title="Move left"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="rounded bg-error/80 p-1 text-white hover:bg-error"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, i + 1)}
                      className="rounded bg-white/20 p-1 text-white hover:bg-white/40"
                      title="Move right"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant px-6 py-8 text-center transition-colors hover:border-primary hover:bg-secondary-container/30 ${uploadingCount > 0 ? 'pointer-events-none opacity-60' : ''}`}>
          {uploadingCount > 0 ? (
            <>
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
              <p className="text-sm font-medium text-on-surface">
                Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}…
              </p>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-3xl text-outline">cloud_upload</span>
              <p className="text-sm font-medium text-on-surface">Click to upload images</p>
              <p className="text-xs text-on-surface-variant">PNG, JPG, WEBP — multiple allowed</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </section>

      {/* ── Flags & badge ── */}
      <section className="surface-card p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-on-surface">Flags & Badge</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Badge</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="input mt-1"
            >
              {BADGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end gap-3">
            {[
              { label: 'Active (visible in store)', value: isActive, set: setIsActive },
              { label: 'Featured on homepage', value: isFeatured, set: setIsFeatured },
              { label: 'Best Seller', value: isBestSeller, set: setIsBestSeller },
            ].map(({ label, value, set }) => (
              <label key={label} className="flex cursor-pointer items-center gap-3">
                <div
                  role="checkbox"
                  aria-checked={value}
                  tabIndex={0}
                  onClick={() => set(!value)}
                  onKeyDown={(e) => e.key === ' ' && set(!value)}
                  className={`relative h-5 w-5 shrink-0 rounded border-2 transition-colors ${
                    value ? 'border-primary bg-primary' : 'border-outline-variant bg-surface'
                  }`}
                >
                  {value && (
                    <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-[14px] text-white">
                      check
                    </span>
                  )}
                </div>
                <span className="text-sm text-on-surface">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="btn-secondary px-6 py-2.5 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Saving…
            </>
          ) : product?.id ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
