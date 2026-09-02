import { createClient } from '@/lib/supabase/server'

export interface Profile {
  id: string
  full_name?: string
  role: 'customer' | 'admin'
  phone?: string
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  address_type: 'home' | 'work' | 'other'
  is_default: boolean
  created_at: string
  updated_at: string
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
  full_name?: string
  phone?: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Get user addresses
 */
export async function getUserAddresses(): Promise<Address[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching addresses:', error)
    return []
  }

  return addresses || []
}

/**
 * Get address by ID
 */
export async function getAddressById(id: string): Promise<Address | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: address, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching address:', error)
    return null
  }

  return address
}

/**
 * Create new address
 */
export async function createAddress(data: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ address: Address | null; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { address: null, error: 'User not authenticated' }
  }

  // If this is set as default, unset other defaults
  if (data.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data: address, error } = await supabase
    .from('addresses')
    .insert({ ...data, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error('Error creating address:', error)
    return { address: null, error: error.message }
  }

  return { address }
}

/**
 * Update address
 */
export async function updateAddress(id: string, data: Partial<Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // If this is set as default, unset other defaults
  if (data.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .neq('id', id)
  }

  const { error } = await supabase
    .from('addresses')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating address:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Delete address
 */
export async function deleteAddress(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting address:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Set address as default
 */
export async function setDefaultAddress(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // Unset all defaults
  await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', user.id)

  // Set new default
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error setting default address:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
