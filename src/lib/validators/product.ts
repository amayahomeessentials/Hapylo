import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  category_id: z.string().uuid('Invalid category'),
  price: z.number().min(0, 'Price must be positive'),
  compare_at_price: z.number().min(0, 'Compare price must be positive').optional(),
  cost_per_unit: z.number().min(0, 'Cost must be positive').optional(),
  stock: z.number().int().min(0, 'Stock must be positive'),
  low_stock_threshold: z.number().int().min(0).default(10),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
  images: z.array(z.string().url()).default([]),
  is_featured: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
  is_active: z.boolean().default(true),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  parent_id: z.string().uuid().optional(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
