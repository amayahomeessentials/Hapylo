'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types/database.types'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

const CARD_STYLE = {
  border: '1px solid #E0E4E0',
  boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)',
}

function slugify(val: string) {
  return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface FormState { name: string; slug: string }

interface CategoriesClientProps {
  categories: Category[]
  productCounts: Record<string, number>
}

export function CategoriesClient({ categories, productCounts }: CategoriesClientProps) {
  const router = useRouter()

  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState<FormState>({ name: '', slug: '' })
  const [createError, setCreateError] = useState('')
  const [createSaving, setCreateSaving] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>({ name: '', slug: '' })
  const [editError, setEditError] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

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
    } finally { setCreateSaving(false) }
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
    } finally { setEditSaving(false) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      router.refresh()
    } finally { setDeleting(false) }
  }

  const deleteCount = deleteTarget ? (productCounts[deleteTarget.id] ?? 0) : 0

  return (
    <>
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">Categories</h1>
          <p className="mt-1.5 text-sm text-on-surface-variant">
            {categories.length} categories · organise your product catalogue
          </p>
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

      {/* Create form */}
      {creating && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-2xl border-2 border-primary/20 bg-white p-6"
          style={{ boxShadow: '0 4px 16px rgba(18,60,62,0.08)' }}
        >
          <h2 className="mb-5 font-display text-base font-bold text-on-surface">New Category</h2>
          {createError && (
            <p className="mb-4 rounded-xl bg-error-container px-4 py-2.5 text-sm text-on-error-container">{createError}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label mb-1">Name</label>
              <input
                required
                value={createForm.name}
                onChange={e => { const name = e.target.value; setCreateForm(f => ({ name, slug: slugify(name) })) }}
                placeholder="e.g. Laundry Care"
                className="input"
              />
            </div>
            <div>
              <label className="label mb-1">Slug</label>
              <input
                required
                value={createForm.slug}
                onChange={e => setCreateForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="laundry-care"
                className="input font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={createSaving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
              {createSaving && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
              {createSaving ? 'Creating…' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Empty */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant bg-white py-20 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">category</span>
          <p className="font-bold text-on-surface">No categories yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">Create your first category to organise products.</p>
          {!creating && (
            <button onClick={() => setCreating(true)} className="btn-primary mt-6 px-5 py-2.5 text-sm">
              New Category
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white" style={CARD_STYLE}>
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead style={{ background: '#F7F9F7', borderBottom: '1px solid #E8ECE8' }}>
              <tr>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Name</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Slug</th>
                <th className="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Products</th>
                <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#F0F2EC' }}>
              {categories.map(cat => (
                <tr key={cat.id} className="transition-colors hover:bg-surface-container-low">
                  {editingId === cat.id ? (
                    <td colSpan={4} className="px-6 py-4">
                      <form onSubmit={handleEdit} className="flex flex-wrap items-end gap-3">
                        {editError && <p className="w-full text-xs text-error">{editError}</p>}
                        <div className="flex-1 min-w-[140px]">
                          <label className="label text-xs mb-0.5">Name</label>
                          <input
                            required
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="input py-1.5 text-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-[140px]">
                          <label className="label text-xs mb-0.5">Slug</label>
                          <input
                            required
                            value={editForm.slug}
                            onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                            className="input py-1.5 font-mono text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" disabled={editSaving} className="btn-primary px-4 py-1.5 text-xs disabled:opacity-60">
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
                      <td className="px-6 py-4 font-semibold text-on-surface">{cat.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{cat.slug}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-bold text-on-surface-variant">
                          {productCounts[cat.id] ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(cat)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                            aria-label="Edit"
                          >
                            <span className="material-symbols-outlined text-[17px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-error hover:bg-red-50 hover:text-error transition-colors"
                            aria-label="Delete"
                          >
                            <span className="material-symbols-outlined text-[17px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y md:hidden" style={{ borderColor: '#F0F2EC' }}>
            {categories.map(cat => (
              <div key={cat.id} className="p-4">
                {editingId === cat.id ? (
                  <form onSubmit={handleEdit} className="space-y-3">
                    {editError && <p className="text-xs text-error">{editError}</p>}
                    <div>
                      <label className="label text-xs">Name</label>
                      <input required value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="input mt-1 text-sm" />
                    </div>
                    <div>
                      <label className="label text-xs">Slug</label>
                      <input required value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} className="input mt-1 font-mono text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={editSaving} className="btn-primary flex-1 py-2 text-sm disabled:opacity-60">{editSaving ? 'Saving…' : 'Save'}</button>
                      <button type="button" onClick={() => setEditingId(null)} className="flex-1 rounded-xl border border-outline-variant py-2 text-sm font-semibold text-on-surface-variant">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: '#E4F0EC' }}>
                      <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface">{cat.name}</p>
                      <p className="text-xs font-mono text-on-surface-variant">{cat.slug}</p>
                      <p className="mt-0.5 text-xs text-on-surface-variant">{productCounts[cat.id] ?? 0} products</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => startEdit(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                        aria-label="Edit"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-error hover:text-error"
                        aria-label="Delete"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete category?"
        message={
          deleteCount > 0
            ? `"${deleteTarget?.name}" has ${deleteCount} product${deleteCount !== 1 ? 's' : ''} assigned. They'll become uncategorised. This cannot be undone.`
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
