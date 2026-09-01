import { NextResponse } from 'next/server'
import { getAllOrdersAdmin } from '@/data/admin'
import { requireAdmin } from '@/lib/supabase/requireAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const orders = await getAllOrdersAdmin()
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('GET /api/admin/orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
