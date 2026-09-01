import { createAdminClient } from '@/lib/supabase/admin'
import { Product, Category, OrderStatus } from '@/types/database.types'

// ─── Products ────────────────────────────────────────────────────────────────

/** Fetch ALL products (including inactive) for the admin panel. */
export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllProductsAdmin error:', error)
    return []
  }
  return data as Product[]
}

/** Fetch a single product by id (admin — bypasses is_active filter). */
export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getProductByIdAdmin error:', error)
    return null
  }
  return data as Product
}

export type ProductUpsertPayload = {
  id?: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  price: number
  compare_at_price: number | null
  stock: number
  images: string[]           // Cloudinary URLs
  is_featured: boolean
  is_best_seller: boolean
  is_active: boolean
  badge: Product['badge']
}

/** Create or update a product. Returns the saved row. */
export async function upsertProduct(
  payload: ProductUpsertPayload
): Promise<Product | null> {
  const supabase = createAdminClient()

  // Strip undefined id so Supabase auto-generates it on insert
  const row: Record<string, unknown> = { ...payload }
  if (!row.id) delete row.id

  const { data, error } = await supabase
    .from('products')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    console.error('upsertProduct error:', error)
    return null
  }
  return data as Product
}

/** Hard-delete a product by id. */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    console.error('deleteProduct error:', error)
    return false
  }
  return true
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('getAllCategoriesAdmin error:', error)
    return []
  }
  return data as Category[]
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface AdminOrder {
  id: string
  order_number: string
  status: OrderStatus
  payment_status: string
  total: number
  subtotal: number
  shipping: number
  discount: number
  created_at: string
  customer_name: string | null
  customer_email: string | null
  items_count: number
}

export interface AdminOrderDetail {
  id: string
  order_number: string
  status: OrderStatus
  payment_status: string
  total: number
  subtotal: number
  shipping: number
  discount: number
  created_at: string
  customer_name: string | null
  customer_email: string | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  address: {
    line1: string
    line2: string | null
    city: string
    state: string
    pincode: string
  } | null
  items: {
    id: string
    quantity: number
    unit_price: number
    product_name: string
    product_image: string | null
    product_slug: string
  }[]
}

/** Fetch all orders with customer info for the admin orders list. */
export async function getAllOrdersAdmin(): Promise<AdminOrder[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, payment_status, total, subtotal, shipping, discount, created_at,
      user_id,
      items:order_items(id)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllOrdersAdmin error:', error)
    return []
  }

  // Fetch profiles for users separately to get names/emails
  const userIds = [...new Set((data ?? []).map((o: { user_id: string | null }) => o.user_id).filter(Boolean))] as string[]
  const profilesMap: Record<string, { full_name: string | null }> = {}
  const authUsersMap: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)

    ;(profiles ?? []).forEach((p: { id: string; full_name: string | null }) => {
      profilesMap[p.id] = { full_name: p.full_name }
    })

    // Get emails via admin auth API
    const { data: usersData } = await supabase.auth.admin.listUsers()
    ;(usersData?.users ?? []).forEach((u: { id: string; email?: string }) => {
      if (u.id && u.email) authUsersMap[u.id] = u.email
    })
  }

  return (data ?? []).map((o: {
    id: string
    order_number: string
    status: OrderStatus
    payment_status: string
    total: number
    subtotal: number
    shipping: number
    discount: number
    created_at: string
    user_id: string | null
    items: { id: string }[]
  }) => ({
    id: o.id,
    order_number: o.order_number,
    status: o.status,
    payment_status: o.payment_status,
    total: o.total,
    subtotal: o.subtotal,
    shipping: o.shipping,
    discount: o.discount,
    created_at: o.created_at,
    customer_name: o.user_id ? (profilesMap[o.user_id]?.full_name ?? null) : null,
    customer_email: o.user_id ? (authUsersMap[o.user_id] ?? null) : null,
    items_count: Array.isArray(o.items) ? o.items.length : 0,
  }))
}

/** Fetch a single order with full detail for the admin order detail page. */
export async function getOrderByIdAdmin(id: string): Promise<AdminOrderDetail | null> {
  const supabase = createAdminClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, payment_status, total, subtotal, shipping, discount, created_at,
      user_id, address_id, razorpay_order_id, razorpay_payment_id,
      items:order_items(id, quantity, unit_price, product_id, product:products(id, name, slug, images))
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    console.error('getOrderByIdAdmin error:', error)
    return null
  }

  // Fetch address if exists
  let address = null
  if (order.address_id) {
    const { data: addr } = await supabase
      .from('addresses')
      .select('line1, line2, city, state, pincode')
      .eq('id', order.address_id)
      .single()
    address = addr ?? null
  }

  // Fetch customer info
  let customer_name: string | null = null
  let customer_email: string | null = null
  if (order.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', order.user_id)
      .single()
    customer_name = profile?.full_name ?? null

    const { data: authUser } = await supabase.auth.admin.getUserById(order.user_id)
    customer_email = authUser?.user?.email ?? null
  }

  const items = (order.items ?? []).map((item: {
    id: string
    quantity: number
    unit_price: number
    product: { name: string; slug: string; images: string[] }[] | { name: string; slug: string; images: string[] } | null
  }) => {
    // Supabase may return product as array or object depending on join type
    const prod = Array.isArray(item.product) ? item.product[0] : item.product
    return {
      id: item.id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      product_name: prod?.name ?? 'Unknown Product',
      product_image: prod?.images?.[0] ?? null,
      product_slug: prod?.slug ?? '',
    }
  })

  return {
    id: order.id,
    order_number: order.order_number,
    status: order.status as OrderStatus,
    payment_status: order.payment_status,
    total: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    created_at: order.created_at,
    customer_name,
    customer_email,
    razorpay_order_id: order.razorpay_order_id,
    razorpay_payment_id: order.razorpay_payment_id,
    address,
    items,
  }
}

/** Update the status of an order. */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
  if (error) {
    console.error('updateOrderStatus error:', error)
    return false
  }
  return true
}

// ─── Dashboard stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  activeProducts: number
  pendingOrders: number
  recentOrders: RecentOrder[]
}

export interface RecentOrder {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  customer_name: string | null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient()

  const [ordersRes, productsRes, recentRes] = await Promise.all([
    supabase.from('orders').select('total, status'),
    supabase.from('products').select('id').eq('is_active', true),
    supabase
      .from('orders')
      .select(`
        id, order_number, status, total, created_at, user_id
      `)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const orders = ordersRes.data ?? []
  const totalRevenue = orders.reduce(
    (sum: number, o: { total: number }) => sum + (o.total ?? 0),
    0
  )
  const pendingOrders = orders.filter(
    (o: { status: string }) => o.status === 'created' || o.status === 'confirmed' || o.status === 'processing'
  ).length

  // Fetch customer names for recent orders
  const recentRaw = (recentRes.data ?? []) as Array<{
    id: string; order_number: string; status: string; total: number; created_at: string; user_id: string | null
  }>
  const userIds = [...new Set(recentRaw.map(o => o.user_id).filter(Boolean))] as string[]
  const profilesMap: Record<string, string | null> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)
    ;(profiles ?? []).forEach((p: { id: string; full_name: string | null }) => {
      profilesMap[p.id] = p.full_name
    })
  }

  return {
    totalRevenue,
    totalOrders: orders.length,
    activeProducts: productsRes.data?.length ?? 0,
    pendingOrders,
    recentOrders: recentRaw.map(o => ({
      id: o.id,
      order_number: o.order_number,
      status: o.status,
      total: o.total,
      created_at: o.created_at,
      customer_name: o.user_id ? (profilesMap[o.user_id] ?? null) : null,
    })),
  }
}
