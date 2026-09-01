import { NextRequest, NextResponse } from 'next/server'
import { updateCategory, deleteCategory } from '@/data/admin'
import { requireAdmin } from '@/lib/supabase/requireAdmin'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const { name, slug } = await req.json()

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
  }

  const ok = await updateCategory(id, name.trim(), slug.trim())
  if (!ok) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const ok = await deleteCategory(id)
  if (!ok) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
