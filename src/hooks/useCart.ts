import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types/database.types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number, selectedScent?: string) => void
  removeItem: (productId: string, selectedScent?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedScent?: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity, selectedScent) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedScent === selectedScent
          )

          if (existingItemIndex > -1) {
            // Update quantity if item exists with same scent
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += quantity
            return { items: newItems }
          }

          // Add new item
          return {
            items: [...state.items, { product, quantity, selectedScent }]
          }
        })
      },

      removeItem: (productId, selectedScent) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedScent === selectedScent)
          )
        }))
      },

      updateQuantity: (productId, quantity, selectedScent) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.selectedScent === selectedScent) {
              return { ...item, quantity: Math.max(0, quantity) }
            }
            return item
          }).filter((item) => item.quantity > 0) // Remove if quantity becomes 0
        }))
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'hapylo-cart-storage',
    }
  )
)
