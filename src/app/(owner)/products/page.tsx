"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { formatRupiah } from "@/lib/utils"
import ProductForm from "@/components/product-form"

interface Product {
  id: string
  sku: string
  name: string
  category: string
  costPrice: number
  sellingPrice: number
  stock: number
}

const ITEMS_PER_PAGE = 10

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)

    const res = await fetch(`/api/products?${params}`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }, [search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    setDeleteId(null)
    fetchProducts()
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const paginatedProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Produk</h1>
        <button
          onClick={() => {
            setEditProduct(undefined)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Cari produk berdasarkan nama atau SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">Memuat data...</div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            {search ? "Tidak ada produk yang cocok." : "Belum ada produk. Klik \"Tambah Produk\" untuk memulai."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">SKU</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nama</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Kategori</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Harga Beli</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Harga Jual</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Stok</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">{p.sku}</td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{p.category}</td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300 text-right">{formatRupiah(p.costPrice)}</td>
                      <td className="px-5 py-3 text-sm text-gray-900 dark:text-white font-medium text-right">{formatRupiah(p.sellingPrice)}</td>
                      <td className="px-5 py-3 text-sm text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.stock > 10
                              ? "bg-emerald-50 text-emerald-700"
                              : p.stock > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditProduct(p)
                              setShowForm(true)
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-danger transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Menampilkan {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(page * ITEMS_PER_PAGE, products.length)} dari {products.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition cursor-pointer ${
                        page === i + 1
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          onSave={() => {
            setShowForm(false)
            setEditProduct(undefined)
            fetchProducts()
          }}
          onClose={() => {
            setShowForm(false)
            setEditProduct(undefined)
          }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Produk</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-lg bg-danger hover:bg-red-600 text-white font-medium text-sm transition cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
