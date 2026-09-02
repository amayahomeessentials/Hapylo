import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !secret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    // Handle payment.captured event
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload.payment.entity
      const razorpayOrderId = paymentEntity.order_id
      const razorpayPaymentId = paymentEntity.id

      // Initialize Supabase admin client to bypass RLS for webhook
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      )

      // Update the order in the database
      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          razorpay_payment_id: razorpayPaymentId
        })
        .eq('razorpay_order_id', razorpayOrderId)

      if (error) {
        console.error('Error updating order:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
