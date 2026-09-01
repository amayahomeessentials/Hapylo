import { NextRequest, NextResponse } from 'next/server'
import { upsertProduct, ProductUpsertPayload } from '@/data/admin'
import { requireAdmin } from '@/lib/supabase/requireAdmin'

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body: ProductUpsertPayload = await req.json()
  const product = await upsertProduct(body)
  if (!product) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
  return NextResponse.json(product, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body: ProductUpsertPayload = await req.json()
  if (!body.id) {
    return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
  }
  const product = await upsertProduct(body)
  if (!product) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
  return NextResponse.json(product)
}
