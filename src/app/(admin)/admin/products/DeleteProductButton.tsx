'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Failed to delete product.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:opacity-50"
      aria-label="Delete product"
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      ) : (
        <span className="material-symbols-outlined text-[18px]">delete</span>
      )}
    </button>
  )
}
