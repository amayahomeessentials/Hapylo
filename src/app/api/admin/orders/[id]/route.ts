import { NextResponse } from 'next/server'
import { getOrderByIdAdmin, updateOrderStatus } from '@/data/admin'
import { OrderStatus } from '@/types/database.types'
import { requireAdmin } from '@/lib/supabase/requireAdmin'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  try {
    const order = await getOrderByIdAdmin(id)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (error) {
    console.error('GET /api/admin/orders/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  try {
    const body = await request.json()
    const { status } = body as { status: OrderStatus }

    const validStatuses: OrderStatus[] = [
      'created', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
    ]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const ok = await updateOrderStatus(id, status)
    if (!ok) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('PATCH /api/admin/orders/[id] error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
