import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ products: [] })
    }

    // Initialize Supabase admin client to fetch products
    // (Using admin to ensure we don't have RLS read issues if not configured publicly, though usually products are public)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Basic text search on name or description using ilike
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(20)

    if (error) {
      console.error('Error fetching search results:', error)
      return NextResponse.json({ error: 'Database search failed' }, { status: 500 })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Search processing error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
