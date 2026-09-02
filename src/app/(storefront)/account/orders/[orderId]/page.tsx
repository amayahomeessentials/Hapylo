import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { notFound, redirect } from 'next/navigation'
import { Database } from '@/types/database.types'
import Link from 'next/link'
import Image from 'next/image'

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      addresses(*),
      order_items(*, products(*))
    `)
    .eq('id', params.orderId)
    .eq('user_id', session.user.id)
    .single()

  if (!order) {
    notFound()
  }

  const statuses = ['created', 'confirmed', 'processing', 'shipped', 'delivered']
  const currentStatusIndex = statuses.indexOf(order.status)
  // If cancelled, we handle separately
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/account/orders" className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-on-surface tracking-tight">Order #{order.order_number}</h1>
          <p className="text-on-surface-variant mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <div className="bg-surface border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Status Timeline */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-on-surface mb-6">Order Status</h3>
          
          {isCancelled ? (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px]">cancel</span>
              <div>
                <p className="font-bold">Order Cancelled</p>
                <p className="text-sm mt-0.5">This order has been cancelled and will not be fulfilled.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container rounded-full hidden sm:block">
                <div 
                  className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%` }}
                />
              </div>
              
              <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                {statuses.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex
                  
                  return (
                    <div key={status} className="flex sm:flex-col items-center sm:justify-center gap-4 sm:gap-2 relative z-10 flex-1">
                      {/* Vertical line for mobile */}
                      {index < statuses.length - 1 && (
                        <div className={`absolute left-[15px] top-8 w-0.5 h-full sm:hidden ${isCompleted ? 'bg-primary' : 'bg-surface-container'}`} />
                      )}
                      
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-surface transition-colors ${
                        isCompleted ? 'border-primary text-primary' : 'border-outline-variant text-outline'
                      } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                        {isCompleted ? (
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                        )}
                      </div>
                      <p className={`text-sm font-semibold capitalize ${isCompleted ? 'text-on-surface' : 'text-outline'}`}>
                        {status}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant pb-4">Items Summary</h3>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="h-20 w-20 bg-surface-container rounded-xl overflow-hidden shrink-0 border border-outline-variant">
                    {item.products?.images?.[0] ? (
                      <img src={item.products.images[0]} alt={item.products.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.products?.slug}`} className="text-base font-semibold text-on-surface hover:text-primary transition-colors truncate block">
                      {item.products?.name}
                    </Link>
                    <p className="text-sm text-on-surface-variant mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-on-surface">${Number(item.unit_price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Address */}
          <div className="space-y-8">
            <div className="bg-surface-container/30 rounded-2xl p-6 border border-outline-variant">
              <h3 className="text-base font-bold text-on-surface mb-4">Payment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span>${Number(order.shipping).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-${Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-outline-variant flex justify-between items-center">
                  <span className="font-bold text-on-surface text-base">Total</span>
                  <span className="font-bold text-on-surface text-lg">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2">
                <span className="text-sm font-semibold text-on-surface-variant">Payment Status:</span>
                <span className={`text-sm font-bold uppercase tracking-wider ${order.payment_status === 'paid' ? 'text-emerald-600' : order.payment_status === 'failed' ? 'text-error' : 'text-amber-600'}`}>
                  {order.payment_status}
                </span>
              </div>
            </div>

            {order.addresses && (
              <div>
                <h3 className="text-base font-bold text-on-surface mb-3 border-b border-outline-variant pb-2">Shipping Address</h3>
                <div className="text-sm text-on-surface-variant leading-relaxed">
                  <p>{order.addresses.line1}</p>
                  {order.addresses.line2 && <p>{order.addresses.line2}</p>}
                  <p>{order.addresses.city}, {order.addresses.state} {order.addresses.pincode}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
