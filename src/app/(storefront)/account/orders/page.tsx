import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

import Link from 'next/link'

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-on-surface tracking-tight">Order History</h1>
        <p className="text-on-surface-variant mt-1">View and track your previous orders.</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-2xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-outline mb-4">shopping_bag</span>
          <h2 className="text-lg font-bold text-on-surface">No orders yet</h2>
          <p className="text-on-surface-variant mt-2 mb-6">Looks like you haven't made your first purchase.</p>
          <Link href="/shop" className="btn-primary rounded-xl px-6 py-3 text-sm font-medium">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-outline-variant bg-surface-container/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Order Placed</p>
                  <p className="text-sm font-medium text-on-surface mt-1">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Total</p>
                  <p className="text-sm font-medium text-on-surface mt-1">${order.total}</p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Order #</p>
                  <p className="text-sm font-medium text-on-surface mt-1">{order.order_number}</p>
                </div>
                <div>
                  <Link href={`/account/orders/${order.id}`} className="text-primary hover:text-primary-fixed text-sm font-semibold transition-colors flex items-center gap-1">
                    View Details
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                    order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'cancelled' ? 'bg-error-container text-on-error-container' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-on-surface-variant font-medium">
                    Payment: <span className={order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>{order.payment_status}</span>
                  </span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="shrink-0 flex items-center gap-4 border border-outline-variant rounded-xl p-3 w-72">
                      <div className="h-16 w-16 bg-surface-container rounded-lg overflow-hidden shrink-0">
                        {item.products?.images?.[0] ? (
                          <img src={item.products.images[0]} alt={item.products.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-outline">
                            <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-on-surface truncate">{item.products?.name}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
