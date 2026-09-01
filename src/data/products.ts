import { Product, Category } from '@/types/database.types'
import { createClient } from '@/lib/supabase/server'

// ─── Data access functions (fetching from Supabase) ───

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data as Product[]
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(4)
  
  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
  return data as Product[]
}

export async function getBestSellers(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_best_seller', true)
    .limit(4)
  
  if (error) {
    console.error('Error fetching best sellers:', error)
    return []
  }
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching product by slug:', error)
    return undefined
  }
  return data as Product
}

export async function getRelatedProducts(productId: string, categoryId: string | null): Promise<Product[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*')
    .neq('id', productId)
    .eq('is_active', true)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query.limit(4)
  
  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }
  return data as Product[]
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data as Category[]
}

export async function searchProducts(queryText: string): Promise<Product[]> {
  const supabase = await createClient()
  
  // Note: For a real app, use Supabase Full Text Search or ilike
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .ilike('name', `%${queryText}%`)
  
  if (error) {
    console.error('Error searching products:', error)
    return []
  }
  return data as Product[]
}
