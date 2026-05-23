"use client"

import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { formatRupiah } from "@/lib/utils"

interface CartPanelProps {
  onCheckout: () => void
}

export default function CartPanel({ onCheckout }: CartPanelProps) {
  const { items, removeItem, updateQuantity, total, totalQuantity } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-6">
        <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">Keranjang kosong</p>
        <p className="text-xs mt-1">Klik produk untuk menambahkannya</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
          Keranjang ({totalQuantity()} item)
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.productId}
            className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatRupiah(item.price)}</p>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-danger transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
              <span className="ml-auto text-sm font-semibold text-gray-900 dark:text-white">
                {formatRupiah(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{formatRupiah(total())}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition cursor-pointer"
        >
          Bayar
        </button>
      </div>
    </div>
  )
}
