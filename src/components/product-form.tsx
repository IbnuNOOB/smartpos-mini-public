"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { formatRupiah } from "@/lib/utils"

interface Product {
  id: string
  sku: string
  name: string
  category: string
  costPrice: number
  sellingPrice: number
  stock: number
}

interface ProductFormData {
  sku: string
  name: string
  category: string
  costPrice: string
  sellingPrice: string
  stock: string
}

const emptyForm: ProductFormData = {
  sku: "",
  name: "",
  category: "",
  costPrice: "",
  sellingPrice: "",
  stock: "",
}

export default function ProductForm({
  product,
  onSave,
  onClose,
}: {
  product?: Product
  onSave: () => void
  onClose: () => void
}) {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          sku: product.sku,
          name: product.name,
          category: product.category,
          costPrice: String(product.costPrice),
          sellingPrice: String(product.sellingPrice),
          stock: String(product.stock),
        }
      : emptyForm
  )
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const url = product ? `/api/products/${product.id}` : "/api/products"
    const method = product ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: form.sku,
          name: form.name,
          category: form.category,
          costPrice: Number(form.costPrice),
          sellingPrice: Number(form.sellingPrice),
          stock: Number(form.stock),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan")
        return
      }

      onSave()
    } catch {
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  function setField(field: keyof ProductFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setField("sku", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
                required
                disabled={!!product}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
              <input
                type="number"
                value={form.costPrice}
                onChange={(e) => setField("costPrice", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
              <input
                type="number"
                value={form.sellingPrice}
                onChange={(e) => setField("sellingPrice", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setField("stock", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
              required
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
