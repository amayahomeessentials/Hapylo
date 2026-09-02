import { z } from 'zod'

export const addressSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number').regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits').regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),
  country: z.string().default('India'),
  address_type: z.enum(['home', 'work', 'other']).default('home'),
  is_default: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  address_id: z.string().uuid('Please select a delivery address'),
  customer_notes: z.string().optional(),
})

export const cartItemSchema = z.object({
  product_id: z.string().uuid('Invalid product'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
})

export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
