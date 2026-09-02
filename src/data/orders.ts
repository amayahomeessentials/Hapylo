import { createClient } from '@/lib/supabase/server'

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: 'created' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  subtotal: number
  shipping: number
  discount: number
  tax: number
  total: number
  shipping_name: string
  shipping_phone: string
  shipping_line1: string
  shipping_line2?: string
  shipping_city: string
  shipping_state: string
  shipping_pincode: string
  shipping_country: string
  customer_notes?: string
  admin_notes?: string
  tracking_number?: string
  tracking_url?: string
  paid_at?: string
  shipped_at?: string
  delivered_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  product_slug: string
  product_image?: string
  sku?: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

/**
 * Create a new order from cart
 */
export async function createOrder(data: {
  address_id: string
  customer_notes?: string
}): Promise<{ order: Order | null; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { order: null, error: 'User not authenticated' }
  }

  // Get cart with items
  const { data: cart } = await supabase
    .from('carts')
    .select(`
      *,
      items:cart_items(
        *,
        product:products(*)
      )
    `)
    .eq('user_id', user.id)
    .single()

  if (!cart || !cart.items || cart.items.length === 0) {
    return { order: null, error: 'Cart is empty' }
  }

  // Get address
  const { data: address } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', data.address_id)
    .eq('user_id', user.id)
    .single()

  if (!address) {
    return { order: null, error: 'Address not found' }
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum: number, item: any) => {
    return sum + item.product.price * item.quantity
  }, 0)

  const shipping = subtotal >= 500 ? 0 : 50
  const discount = 0
  const tax = 0
  const total = subtotal + shipping - discount + tax

  // Generate order number using database function
  const { data: orderNumberData } = await supabase.rpc('generate_order_number')
  const orderNumber = orderNumberData || `HPL${Date.now()}`

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: 'created',
      payment_status: 'pending',
      payment_method: 'razorpay',
      subtotal,
      shipping,
      discount,
      tax,
      total,
      shipping_name: address.full_name,
      shipping_phone: address.phone,
      shipping_line1: address.line1,
      shipping_line2: address.line2,
      shipping_city: address.city,
      shipping_state: address.state,
      shipping_pincode: address.pincode,
      shipping_country: address.country || 'India',
      customer_notes: data.customer_notes,
    })
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    return { order: null, error: orderError.message }
  }

  // Create order items
  const orderItems = cart.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_slug: item.product.slug,
    product_image: item.product.images?.[0] || null,
    sku: item.product.sku,
    quantity: item.quantity,
    unit_price: item.product.price,
    total_price: item.product.price * item.quantity,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    // Rollback order
    await supabase.from('orders').delete().eq('id', order.id)
    return { order: null, error: itemsError.message }
  }

  // Clear cart after successful order creation
  await supabase.from('cart_items').delete().eq('cart_id', cart.id)

  return { order, error: undefined }
}

/**
 * Get order by ID with items
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return order
}

/**
 * Get user orders with items
 */
export async function getUserOrders(limit: number = 10): Promise<Order[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return orders || []
}

/**
 * Update order payment status after successful payment
 */
export async function updateOrderPayment(
  orderId: string,
  paymentData: {
    razorpay_payment_id: string
    razorpay_signature: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order payment:', error)
    return { success: false, error: error.message }
  }

  // Update stock for each product
  const { data: order } = await supabase
    .from('orders')
    .select('items:order_items(*)')
    .eq('id', orderId)
    .single()

  if (order?.items) {
    for (const item of order.items) {
      if (item.product_id) {
        await supabase.rpc('decrement_product_stock', {
          product_id: item.product_id,
          quantity: item.quantity
        })
      }
    }
  }

  return { success: true }
}

/**
 * Admin: Get all orders with filters
 */
export async function getAllOrders(filters?: {
  status?: string
  payment_status?: string
  limit?: number
}): Promise<Order[]> {
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.payment_status) {
    query = query.eq('payment_status', filters.payment_status)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data: orders, error } = await query

  if (error) {
    console.error('Error fetching all orders:', error)
    return []
  }

  return orders || []
}

/**
 * Admin: Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const updateData: any = { status, admin_notes: adminNotes }

  if (status === 'shipped') {
    updateData.shipped_at = new Date().toISOString()
  } else if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString()
  } else if (status === 'cancelled') {
    updateData.cancelled_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Admin: Update tracking information
 */
export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string,
  trackingUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating tracking:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
