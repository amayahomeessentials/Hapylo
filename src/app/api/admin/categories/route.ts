import { NextRequest, NextResponse } from 'next/server'
import { getAllCategoriesAdmin, createCategory } from '@/data/admin'
import { requireAdmin } from '@/lib/supabase/requireAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const categories = await getAllCategoriesAdmin()
  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { name, slug } = await req.json()
  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
  }

  const category = await createCategory(name.trim(), slug.trim())
  if (!category) {
    return NextResponse.json({ error: 'Failed to create category (slug may already exist)' }, { status: 500 })
  }
  return NextResponse.json(category, { status: 201 })
}
