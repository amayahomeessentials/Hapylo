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

// ─── Low stock products ───────────────────────────────────────────────────────

export interface LowStockProduct {
  id: string
  name: string
  stock: number
  images: string[]
}

/** Products with stock at or below the threshold (default 5). */
export async function getLowStockProducts(threshold = 5): Promise<LowStockProduct[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, stock, images')
    .lte('stock', threshold)
    .eq('is_active', true)
    .order('stock', { ascending: true })
    .limit(10)

  if (error) {
    console.error('getLowStockProducts error:', error)
    return []
  }
  return (data ?? []) as LowStockProduct[]
}

// ─── Revenue chart data (last 7 days) ────────────────────────────────────────

export interface DailyRevenue {
  date: string   // 'YYYY-MM-DD'
  revenue: number
  orders: number
}

/** Revenue and order counts for the last N days (default 7). */
export async function getRevenueChart(days = 7): Promise<DailyRevenue[]> {
  const supabase = createAdminClient()

  const since = new Date()
  since.setDate(since.getDate() - (days - 1))
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getRevenueChart error:', error)
    return []
  }

  // Build a map keyed by date string
  const map: Record<string, { revenue: number; orders: number }> = {}

  // Pre-fill every day with zeros
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    map[key] = { revenue: 0, orders: 0 }
  }

  ;(data ?? []).forEach((o: { total: number; created_at: string }) => {
    const key = o.created_at.slice(0, 10)
    if (map[key]) {
      map[key].revenue += o.total ?? 0
      map[key].orders += 1
    }
  })

  return Object.entries(map).map(([date, v]) => ({ date, ...v }))
}

// ─── Top selling products ─────────────────────────────────────────────────────

export interface TopProduct {
  product_id: string
  product_name: string
  product_image: string | null
  total_sold: number
  revenue: number
}

/** Top N products by units sold. */
export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('order_items')
    .select('quantity, unit_price, product_id, product:products(id, name, images)')
    .limit(500)

  if (error) {
    console.error('getTopProducts error:', error)
    return []
  }

  const map: Record<string, TopProduct> = {}

  ;(data ?? []).forEach((item: {
    quantity: number
    unit_price: number
    product_id: string
    product: { id: string; name: string; images: string[] }[] | { id: string; name: string; images: string[] } | null
  }) => {
    const prod = Array.isArray(item.product) ? item.product[0] : item.product
    if (!prod) return
    if (!map[item.product_id]) {
      map[item.product_id] = {
        product_id: item.product_id,
        product_name: prod.name,
        product_image: prod.images?.[0] ?? null,
        total_sold: 0,
        revenue: 0,
      }
    }
    map[item.product_id].total_sold += item.quantity
    map[item.product_id].revenue += item.quantity * item.unit_price
  })

  return Object.values(map)
    .sort((a, b) => b.total_sold - a.total_sold)
    .slice(0, limit)
}

// ─── Order status breakdown ───────────────────────────────────────────────────

export interface StatusBreakdown {
  status: string
  count: number
}

export async function getOrderStatusBreakdown(): Promise<StatusBreakdown[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('status')

  if (error) {
    console.error('getOrderStatusBreakdown error:', error)
    return []
  }

  const map: Record<string, number> = {}
  ;(data ?? []).forEach((o: { status: string }) => {
    map[o.status] = (map[o.status] ?? 0) + 1
  })

  return Object.entries(map)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count)
}

// ─── Categories ── CRUD ───────────────────────────────────────────────────────

export async function createCategory(name: string, slug: string): Promise<{ id: string; name: string; slug: string } | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug })
    .select()
    .single()

  if (error) {
    console.error('createCategory error:', error)
    return null
  }
  return data
}

export async function updateCategory(id: string, name: string, slug: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id)

  if (error) {
    console.error('updateCategory error:', error)
    return false
  }
  return true
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteCategory error:', error)
    return false
  }
  return true
}

export async function getCategoryProductCount(): Promise<Record<string, number>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('category_id')

  if (error) return {}

  const map: Record<string, number> = {}
  ;(data ?? []).forEach((p: { category_id: string | null }) => {
    if (p.category_id) {
      map[p.category_id] = (map[p.category_id] ?? 0) + 1
    }
  })
  return map
}
