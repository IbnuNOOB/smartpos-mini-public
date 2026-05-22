"use client"

import { useState } from "react"
import { formatRupiah } from "@/lib/utils"

interface CheckoutModalProps {
  total: number
  onConfirm: (paidAmount: number) => void
  onClose: () => void
  loading: boolean
}

export default function CheckoutModal({
  total,
  onConfirm,
  onClose,
  loading,
}: CheckoutModalProps) {
  const [paid, setPaid] = useState("")
  const paidAmount = Number(paid) || 0
  const change = paidAmount - total
  const canConfirm = paidAmount >= total

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Pembayaran</h2>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Belanja</span>
              <span className="text-lg font-bold text-gray-900">{formatRupiah(total)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Jumlah Uang Dibayar
            </label>
            <input
              type="number"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-2xl font-bold text-gray-900 text-center focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="0"
              autoFocus
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Kembalian</span>
              <span
                className={`text-xl font-bold ${
                  change >= 0 ? "text-accent" : "text-danger"
                }`}
              >
                {paid ? formatRupiah(Math.max(0, change)) : "-"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => onConfirm(paidAmount)}
              disabled={!canConfirm || loading}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Memproses..." : "Selesaikan Transaksi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
