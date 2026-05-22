"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Grid3X3, List } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { formatRupiah } from "@/lib/utils"
import CartPanel from "@/components/cart-panel"
import CheckoutModal from "@/components/checkout-modal"
import ReceiptModal from "@/components/receipt-modal"

interface Product {
  id: string
  sku: string
  name: string
  category: string
  costPrice: number
  sellingPrice: number
  stock: number
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [receipt, setReceipt] = useState<{
    transactionCode: string
    items: { name: string; quantity: number; price: number; subtotal: number }[]
    total: number
    paid: number
    change: number
    cashier: string
    createdAt: string
  } | null>(null)

  const { addItem, total, clearCart, items } = useCartStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !selectedCategory || p.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [products, search, selectedCategory])

  async function handleCheckout(paidAmount: number) {
    setProcessing(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          totalPaid: paidAmount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Transaksi gagal")
        return
      }

      const receiptItems = items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }))

      setReceipt({
        transactionCode: data.transactionCode,
        items: receiptItems,
        total: data.totalPrice,
        paid: data.totalPaid,
        change: data.change,
        cashier: data.cashier,
        createdAt: data.createdAt,
      })

      clearCart()
      setShowCheckout(false)
      fetchProducts()
    } catch {
      alert("Terjadi kesalahan")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                !selectedCategory
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Memuat produk...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Tidak ada produk ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map((p) => {
                const cartItem = items.find((i) => i.productId === p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (p.stock > 0) {
                        addItem({
                          productId: p.id,
                          sku: p.sku,
                          name: p.name,
                          price: p.sellingPrice,
                          stock: p.stock,
                        })
                      }
                    }}
                    disabled={p.stock === 0}
                    className={`relative p-4 rounded-xl border text-left transition cursor-pointer ${
                      p.stock === 0
                        ? "bg-gray-50 border-gray-100 opacity-50"
                        : cartItem
                        ? "bg-primary/5 border-primary/30 hover:border-primary/60"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {p.stock <= 5 && p.stock > 0 && (
                      <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Sisa {p.stock}
                      </span>
                    )}
                    {p.stock === 0 && (
                      <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Habis
                      </span>
                    )}
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{p.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
                    <p className="text-sm font-bold text-primary mt-1">{formatRupiah(p.sellingPrice)}</p>
                    {cartItem && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {cartItem.quantity}x
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="w-96 border-l border-gray-200 bg-white flex flex-col hidden lg:flex">
        <CartPanel onCheckout={() => setShowCheckout(true)} />
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <span className="text-xs text-gray-500">Total</span>
            <p className="text-lg font-bold text-gray-900">{formatRupiah(total())}</p>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={items.length === 0}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            Bayar ({items.length})
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          total={total()}
          onConfirm={handleCheckout}
          onClose={() => setShowCheckout(false)}
          loading={processing}
        />
      )}

      {receipt && (
        <ReceiptModal
          {...receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  )
}
