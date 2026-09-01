// Database types — shape matches the Supabase schema from the roadmap
// Generated via: supabase gen types typescript (when Supabase is connected)

export type UserRole = 'customer' | 'admin'
export type OrderStatus = 'created' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface Profile {
  id: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  category?: Category
  price: number
  compare_at_price: number | null
  stock: number
  images: string[]
  scents?: Scent[]
  rating?: number
  review_count?: number
  is_featured: boolean
  is_best_seller: boolean
  is_active: boolean
  created_at: string
  badge?: 'bestseller' | 'sale' | 'eco' | 'new' | null
}

export interface Scent {
  name: string
  color: string // CSS color string
}

export interface Address {
  id: string
  user_id: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  status: OrderStatus
  payment_status: PaymentStatus
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  subtotal: number
  shipping: number
  discount: number
  total: number
  address_id: string | null
  items?: OrderItem[]
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number // snapshot — never join live price
}

export interface CartItem {
  product: Product
  quantity: number
  selectedScent?: string
}
