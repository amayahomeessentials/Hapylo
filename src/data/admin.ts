import { createAdminClient } from '@/lib/supabase/admin'
import { Product, Category } from '@/types/database.types'

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

// ─── Dashboard stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  activeProducts: number
  recentOrders: RecentOrder[]
}

export interface RecentOrder {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient()

  const [ordersRes, productsRes, recentRes] = await Promise.all([
    supabase.from('orders').select('total, status'),
    supabase.from('products').select('id').eq('is_active', true),
    supabase
      .from('orders')
      .select('id, order_number, status, total, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const orders = ordersRes.data ?? []
  const totalRevenue = orders.reduce(
    (sum: number, o: { total: number }) => sum + (o.total ?? 0),
    0
  )

  return {
    totalRevenue,
    totalOrders: orders.length,
    activeProducts: productsRes.data?.length ?? 0,
    recentOrders: (recentRes.data ?? []) as RecentOrder[],
  }
}
