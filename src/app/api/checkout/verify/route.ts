import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const isDemo =
      orderId.startsWith('order_') ||
      orderId.startsWith('demo_') ||
      razorpayOrderId?.startsWith('order_demo_')

    if (isDemo) {
      return NextResponse.json({ success: true, verified: true, isDemo: true })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json(
        { error: 'Razorpay key secret not configured on server' },
        { status: 500 }
      )
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Update order in Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      )

      await supabaseAdmin
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)
    }

    return NextResponse.json({ success: true, verified: true })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error?.message || 'Verification failed' },
      { status: 500 }
    )
  }
}
