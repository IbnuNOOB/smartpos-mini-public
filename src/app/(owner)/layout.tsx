"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, ChevronRight, User } from "lucide-react"
import OwnerSidebar from "@/components/owner-sidebar"
import ThemeToggle from "@/components/theme-toggle"

const navLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Produk",
  "/reports": "Laporan",
  "/pos": "POS Kasir",
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const activeLabel = Object.entries(navLabels).find(([href]) =>
    pathname.startsWith(href)
  )?.[1] || ""

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

          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3" />
              {activeLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              <User className="w-4 h-4" />
              Owner
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
