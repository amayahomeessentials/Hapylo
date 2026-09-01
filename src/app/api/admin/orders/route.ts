import { NextResponse } from 'next/server'
import { getAllOrdersAdmin } from '@/data/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const orders = await getAllOrdersAdmin()
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('GET /api/admin/orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
