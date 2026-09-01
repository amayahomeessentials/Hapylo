import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: NextRequest) {
  try {
    const { items, address } = await req.json()
    
    // In a real app, you MUST verify the prices of the items from the database here
    // rather than trusting the client-side totals.
    
    // Calculate total (dummy calculation for now based on incoming items)
    const subtotal = items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0)
    const shipping = subtotal >= 50 ? 0 : 5
    const totalAmount = subtotal + shipping
    
    // Razorpay expects amount in paise (multiply by 100)
    // We'll multiply by 100 to convert dollars to cents (or rupees to paise depending on currency config)
    const amountInSmallestUnit = Math.round(totalAmount * 100)

    // Check if razorpay credentials exist
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
      return NextResponse.json(
        { error: 'Razorpay is not configured yet. This is a dummy response.' },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    })

    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency: 'USD',
      receipt: `receipt_${Date.now()}`,
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
