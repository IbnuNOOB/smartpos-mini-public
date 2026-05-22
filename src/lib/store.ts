import { create } from "zustand"

export interface CartItem {
  productId: string
  sku: string
  name: string
  price: number
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  totalQuantity: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId)
      if (existing) {
        const newQty = existing.quantity + quantity
        if (newQty > item.stock) return state
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: newQty } : i
          ),
        }
      }
      if (quantity > item.stock) return state
      return { items: [...state.items, { ...item, quantity }] }
    })
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }))
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
