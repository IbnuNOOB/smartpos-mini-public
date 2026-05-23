"use client"

import { useState } from "react"
import { Menu, User } from "lucide-react"
import OwnerSidebar from "@/components/owner-sidebar"
import CashierHeader from "@/components/cashier-header"
import ThemeToggle from "@/components/theme-toggle"

export default function PosLayoutClient({ children, role }: { children: React.ReactNode; role: string | null }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (role === "owner") {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <OwnerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="hidden lg:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              POS Kasir
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                Owner
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <CashierHeader />
      <div className="flex items-center justify-end px-4 py-1.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <User className="w-4 h-4" />
            Kasir
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
