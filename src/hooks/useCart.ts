'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, CartItem } from '@/types/database.types'

export type { CartItem }

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, selectedScent?: string) => void
  removeItem: (productId: string, selectedScent?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedScent?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getCartTotal: () => number
  getShipping: () => number
  getTotal: () => number
}

const matchItem = (item: CartItem, productId: string, selectedScent?: string) => {
  if (selectedScent !== undefined) {
    return item.product.id === productId && (item.selectedScent || '') === (selectedScent || '')
  }
  return item.product.id === productId
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity = 1, selectedScent?: string) => {
        const items = get().items
        const scent = selectedScent || product.scents?.[0]?.name
        const existingIndex = items.findIndex((i) => matchItem(i, product.id, scent))

        if (existingIndex > -1) {
          const updatedItems = [...items]
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity,
          }
          set({ items: updatedItems, isOpen: true })
        } else {
          set({
            items: [
              ...items,
              {
                product,
                quantity: Math.max(1, quantity),
                selectedScent: scent,
              },
            ],
            isOpen: true,
          })
        }
      },

      removeItem: (productId: string, selectedScent?: string) => {
        set({
          items: get().items.filter((i) => !matchItem(i, productId, selectedScent)),
        })
      },

      updateQuantity: (productId: string, quantity: number, selectedScent?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedScent)
          return
        }

        set({
          items: get().items.map((i) =>
            matchItem(i, productId, selectedScent) ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.product?.price || 0) * item.quantity,
          0
        )
      },

      getCartTotal: () => {
        return get().getSubtotal()
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        if (subtotal === 0) return 0
        return subtotal >= 500 ? 0 : 50
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        return subtotal + shipping
      },
    }),
    {
      name: 'hapylo-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
