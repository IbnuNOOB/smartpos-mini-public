"use client"

import { useState, useEffect } from "react"
import { formatRupiah, formatDate } from "@/lib/utils"
import { TrendingUp, DollarSign, Receipt } from "lucide-react"

interface Summary {
  totalRevenue: number
  totalProfit: number
  totalTransactions: number
}

interface Transaction {
  id: string
  transactionCode: string
  totalPrice: number
  totalPaid: number
  change: number
  cashier: { username: string }
  items: { product: { name: string }; quantity: number }[]
  createdAt: string
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/reports").then((r) => r.json()),
      fetch("/api/transactions").then((r) => r.json()),
    ]).then(([summaryData, txData]) => {
      setSummary(summaryData)
      setTransactions(txData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        Memuat dashboard...
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pendapatan Kotor</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatRupiah(summary?.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Keuntungan Bersih</p>
          </div>
          <p className="text-2xl font-bold text-accent">
            {formatRupiah(summary?.totalProfit || 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Transaksi</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary?.totalTransactions || 0}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Riwayat Transaksi Terbaru</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Kode</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Kasir</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Items</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Total</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-3 text-sm font-mono text-primary font-medium">
                      {tx.transactionCode}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {tx.cashier.username}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {tx.items.map((i) => `${i.product.name} x${i.quantity}`).join(", ")}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                      {formatRupiah(tx.totalPrice)}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400 dark:text-gray-500">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
