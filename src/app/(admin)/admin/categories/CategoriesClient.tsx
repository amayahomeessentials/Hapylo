'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types/database.types'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

interface CategoriesClientProps {
  categories: Category[]
  productCounts: Record<string, number>
}

function slugify(val: string) {
  return val
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface FormState {
  name: string
  slug: string
}

export function CategoriesClient({ categories, productCounts }: CategoriesClientProps) {
  const router = useRouter()

  // ── Create form ─────────────────────────────────────────────────────────────
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState<FormState>({ name: '', slug: '' })
  const [createError, setCreateError] = useState('')
  const [createSaving, setCreateSaving] = useState(false)

  // ── Edit state ──────────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>({ name: '', slug: '' })
  const [editError, setEditError] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // ── Delete state ─────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError('')
    setCreateSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (!res.ok) { setCreateError(json.error ?? 'Failed to create'); return }
      setCreateForm({ name: '', slug: '' })
      setCreating(false)
      router.refresh()
    } finally {
      setCreateSaving(false)
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, slug: cat.slug })
    setEditError('')
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    setEditError('')
    setEditSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (!res.ok) { setEditError(json.error ?? 'Failed to update'); return }
      setEditingId(null)
      router.refresh()
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  const deleteCount = deleteTarget ? (productCounts[deleteTarget.id] ?? 0) : 0

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface md:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{categories.length} categories · organise your product catalogue</p>
        </div>
        {!creating && (
          <button
            onClick={() => { setCreating(true); setCreateForm({ name: '', slug: '' }); setCreateError('') }}
            className="btn-primary px-5 py-2.5 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Category
          </button>
        )}
      </div>

      {/* ── Create form ── */}
      {creating && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-xl border border-primary/30 bg-secondary-container/30 p-5"
        >
          <h2 className="mb-4 font-display text-base font-bold text-on-surface">New Category</h2>
          {createError && (
            <p className="mb-3 rounded-lg border border-error-container bg-error-container px-3 py-2 text-sm text-on-error-container">
              {createError}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input
                required
                value={createForm.name}
                onChange={e => {
                  const name = e.target.value
                  setCreateForm(f => ({ name, slug: slugify(name) }))
                }}
                placeholder="e.g. Laundry Care"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="label">Slug</label>
              <input
                required
                value={createForm.slug}
                onChange={e => setCreateForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="laundry-care"
                className="input mt-1 font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={createSaving}
              className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
            >
              {createSaving ? (
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
              ) : null}
              {createSaving ? 'Creating…' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-xl border border-outline-variant px-5 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Empty state ── */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-outline-variant bg-surface py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">category</span>
          <p className="font-semibold text-on-surface">No categories yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">Create your first category to organise products.</p>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              className="btn-primary mt-6 px-5 py-2.5 text-sm"
            >
              New Category
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm">
          {/* ── Desktop table ── */}
          <table className="hidden w-full text-sm md:table">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Slug</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Products</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {categories.map(cat => (
                <tr key={cat.id} className="transition-colors hover:bg-surface-container-low">
                  {editingId === cat.id ? (
                    <td colSpan={4} className="px-5 py-3">
                      <form onSubmit={handleEdit} className="flex flex-wrap items-end gap-3">
                        {editError && (
                          <p className="w-full text-xs text-error">{editError}</p>
                        )}
                        <div className="flex-1 min-w-[140px]">
                          <label className="label text-[11px]">Name</label>
                          <input
                            required
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="input mt-0.5 text-sm py-1.5"
                          />
                        </div>
                        <div className="flex-1 min-w-[140px]">
                          <label className="label text-[11px]">Slug</label>
                          <input
                            required
                            value={editForm.slug}
                            onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                            className="input mt-0.5 font-mono text-sm py-1.5"
                          />
                        </div>
                        <div className="flex gap-2 pb-0.5">
                          <button
                            type="submit"
                            disabled={editSaving}
                            className="btn-primary px-4 py-1.5 text-xs disabled:opacity-60"
                          >
                            {editSaving ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-outline-variant px-4 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td className="px-5 py-3.5 font-medium text-on-surface">{cat.name}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">{cat.slug}</td>
                      <td className="px-5 py-3.5 text-center text-on-surface-variant">
                        {productCounts[cat.id] ?? 0}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(cat)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                            aria-label="Edit category"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-error hover:text-error"
                            aria-label="Delete category"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Mobile card list ── */}
          <div className="divide-y divide-outline-variant md:hidden">
            {categories.map(cat => (
              <div key={cat.id} className="p-4">
                {editingId === cat.id ? (
                  <form onSubmit={handleEdit} className="space-y-3">
                    {editError && <p className="text-xs text-error">{editError}</p>}
                    <div>
                      <label className="label text-xs">Name</label>
                      <input
                        required
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="input mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Slug</label>
                      <input
                        required
                        value={editForm.slug}
                        onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                        className="input mt-1 font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={editSaving} className="btn-primary flex-1 py-2 text-sm disabled:opacity-60">
                        {editSaving ? 'Saving…' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="flex-1 rounded-xl border border-outline-variant py-2 text-sm font-semibold text-on-surface-variant">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container">
                      <span className="material-symbols-outlined text-[20px] text-primary">category</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-on-surface">{cat.name}</p>
                      <p className="text-xs text-on-surface-variant font-mono">{cat.slug}</p>
                      <p className="mt-0.5 text-xs text-on-surface-variant">{productCounts[cat.id] ?? 0} products</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => startEdit(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                        aria-label="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-error hover:text-error"
                        aria-label="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete category?"
        message={
          deleteCount > 0
            ? `"${deleteTarget?.name}" has ${deleteCount} product${deleteCount !== 1 ? 's' : ''} assigned to it. Those products will become uncategorised. This cannot be undone.`
            : `"${deleteTarget?.name}" will be permanently deleted. This cannot be undone.`
        }
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  )
}
