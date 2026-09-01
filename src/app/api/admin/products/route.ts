import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { upsertProduct, ProductUpsertPayload } from '@/data/admin'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body: ProductUpsertPayload = await req.json()
  const product = await upsertProduct(body)
  if (!product) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
  return NextResponse.json(product, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

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
