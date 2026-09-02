import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'


export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Fetch the order and its items
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items(*, products(*)),
      addresses(*)
    `)
    .eq('id', orderId)

  if (session?.user?.id) {
    query = query.eq('user_id', session.user.id)
  }

  const { data: order, error } = await query.single()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h1 className="text-4xl font-display font-extrabold text-on-surface tracking-tight">Thank you for your order!</h1>
        <p className="mt-4 text-lg text-on-surface-variant">
          Your order number is <span className="font-bold text-on-surface">#{order.order_number}</span>. We've emailed you a confirmation.
        </p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 border-b border-outline-variant bg-surface-container/30">
          <h2 className="text-xl font-bold text-on-surface mb-6">Order Details</h2>
          
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="h-20 w-20 bg-surface-container rounded-xl overflow-hidden border border-outline-variant shrink-0">
                  {item.products?.images?.[0] ? (
                    <img src={item.products.images[0]} alt={item.products.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-on-surface">{item.products?.name}</h3>
                  <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-on-surface">${(item.unit_price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 sm:p-8 bg-surface">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Shipping Address</h3>
              {order.addresses ? (
                <div className="text-sm text-on-surface space-y-1">
                  <p>{order.addresses.line1}</p>
                  {order.addresses.line2 && <p>{order.addresses.line2}</p>}
                  <p>{order.addresses.city}, {order.addresses.state} {order.addresses.pincode}</p>
                </div>
              ) : (
                <p className="text-sm text-on-surface">No shipping address found.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="text-on-surface">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-on-surface">${order.shipping.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 mt-2 border-t border-outline-variant">
                  <span className="font-bold text-on-surface text-base">Total</span>
                  <span className="font-bold text-on-surface text-base">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/account/orders" className="btn-primary rounded-xl px-8 py-3.5 text-sm font-bold w-full sm:w-auto text-center">
          View My Orders
        </Link>
        <Link href="/" className="px-8 py-3.5 rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors w-full sm:w-auto text-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
