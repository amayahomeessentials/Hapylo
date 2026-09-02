import { createClient } from '@/lib/supabase/server'

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number
    images: string[]
    stock: number
    is_active: boolean
  }
}

export interface Cart {
  id: string
  user_id?: string
  session_id?: string
  created_at: string
  updated_at: string
  items?: CartItem[]
}

/**
 * Get or create cart for the current user or session
 */
export async function getOrCreateCart(sessionId?: string): Promise<Cart | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Try to find existing cart
  let query = supabase.from('carts').select('*')
  
  if (user) {
    query = query.eq('user_id', user.id)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  } else {
    return null
  }

  const { data: existingCart } = await query.single()

  if (existingCart) {
    return existingCart
  }

  // Create new cart
  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({
      user_id: user?.id || null,
      session_id: !user ? sessionId : null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating cart:', error)
    return null
  }

  return newCart
}

/**
 * Get cart with all items and product details
 */
export async function getCartWithItems(sessionId?: string): Promise<Cart | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('carts')
    .select(`
      *,
      items:cart_items(
        *,
        product:products(
          id,
          name,
          slug,
          price,
          compare_at_price,
          images,
          stock,
          is_active
        )
      )
    `)

  if (user) {
    query = query.eq('user_id', user.id)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  } else {
    return null
  }

  const { data: cart, error } = await query.single()

  if (error) {
    console.error('Error fetching cart:', error)
    return null
  }

  return cart
}

/**
 * Add item to cart or update quantity if exists
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
  sessionId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  // Get or create cart
  const cart = await getOrCreateCart(sessionId)
  if (!cart) {
    return { success: false, error: 'Could not create cart' }
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .single()

  if (existingItem) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)

    if (error) {
      console.error('Error updating cart item:', error)
      return { success: false, error: error.message }
    }
  } else {
    // Add new item
    const { error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      })

    if (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  if (quantity <= 0) {
    return removeFromCart(itemId)
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)

  if (error) {
    console.error('Error updating cart item:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Clear all items from cart
 */
export async function clearCart(sessionId?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase.from('carts').select('id')
  
  if (user) {
    query = query.eq('user_id', user.id)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  } else {
    return { success: false, error: 'No cart found' }
  }

  const { data: cart } = await query.single()

  if (!cart) {
    return { success: false, error: 'Cart not found' }
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id)

  if (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(cart: Cart | null) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      subtotal: 0,
      itemCount: 0,
      shipping: 0,
      discount: 0,
      tax: 0,
      total: 0,
    }
  }

  const subtotal = cart.items.reduce((sum, item) => {
    if (!item.product) return sum
    return sum + item.product.price * item.quantity
  }, 0)

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  // Free shipping over ₹500
  const shipping = subtotal >= 500 ? 0 : 50

  // Tax is 0 for now (or calculate GST if needed)
  const tax = 0

  const total = subtotal + shipping + tax

  return {
    subtotal,
    itemCount,
    shipping,
    discount: 0,
    tax,
    total,
  }
}

/**
 * Merge guest cart with user cart after login
 */
export async function mergeGuestCartToUser(sessionId: string): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false }
  }

  // Get guest cart
  const { data: guestCart } = await supabase
    .from('carts')
    .select('id')
    .eq('session_id', sessionId)
    .single()

  if (!guestCart) {
    return { success: true } // No guest cart to merge
  }

  // Get or create user cart
  const userCart = await getOrCreateCart()
  if (!userCart) {
    return { success: false }
  }

  // Get guest cart items
  const { data: guestItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', guestCart.id)

  if (!guestItems || guestItems.length === 0) {
    // Delete empty guest cart
    await supabase.from('carts').delete().eq('id', guestCart.id)
    return { success: true }
  }

  // Merge items into user cart
  for (const item of guestItems) {
    // Check if product already in user cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', userCart.id)
      .eq('product_id', item.product_id)
      .single()

    if (existingItem) {
      // Update quantity
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + item.quantity })
        .eq('id', existingItem.id)
    } else {
      // Insert new item
      await supabase
        .from('cart_items')
        .insert({
          cart_id: userCart.id,
          product_id: item.product_id,
          quantity: item.quantity,
        })
    }
  }

  // Delete guest cart
  await supabase.from('carts').delete().eq('id', guestCart.id)

  return { success: true }
}
