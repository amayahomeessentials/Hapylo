import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/database.types'

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isWishlisted: (productId: string) => boolean
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((p) => p.id === product.id)) return state
          return { items: [...state.items, product] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        }))
      },

      toggleItem: (product) => {
        const { isWishlisted, addItem, removeItem } = get()
        if (isWishlisted(product.id)) {
          removeItem(product.id)
        } else {
          addItem(product)
        }
      },

      isWishlisted: (productId) => {
        return get().items.some((p) => p.id === productId)
      },
    }),
    {
      name: 'hapylo-wishlist-storage',
    }
  )
)
