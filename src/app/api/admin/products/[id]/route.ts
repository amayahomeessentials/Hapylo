import { NextRequest, NextResponse } from 'next/server'
import { deleteProduct } from '@/data/admin'
import { requireAdmin } from '@/lib/supabase/requireAdmin'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const ok = await deleteProduct(id)
  if (!ok) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
