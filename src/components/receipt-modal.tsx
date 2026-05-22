"use client"

import { CheckCircle, X } from "lucide-react"
import { formatRupiah, formatDate } from "@/lib/utils"

interface ReceiptItem {
  name: string
  quantity: number
  price: number
  subtotal: number
}

interface ReceiptModalProps {
  transactionCode: string
  items: ReceiptItem[]
  total: number
  paid: number
  change: number
  cashier: string
  createdAt: string
  onClose: () => void
}

export default function ReceiptModal({
  transactionCode,
  items,
  total,
  paid,
  change,
  cashier,
  createdAt,
  onClose,
}: ReceiptModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="text-center pt-8 pb-4 border-b border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
            <CheckCircle className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Transaksi Berhasil</h2>
          <p className="text-xs text-gray-400 font-mono mt-1">{transactionCode}</p>
        </div>

        <div className="px-6 py-4 border-b border-dashed border-gray-200 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.name} <span className="text-gray-400">x{item.quantity}</span>
              </span>
              <span className="text-gray-900 font-medium">{formatRupiah(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="text-gray-900 font-bold">{formatRupiah(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Dibayar</span>
            <span className="text-gray-900">{formatRupiah(paid)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Kembalian</span>
            <span className="text-accent font-bold">{formatRupiah(change)}</span>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
          <span>Kasir: {cashier}</span>
          <span>{formatDate(createdAt)}</span>
        </div>

        <div className="px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
