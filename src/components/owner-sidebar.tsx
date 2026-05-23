"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  LogOut,
  X,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produk", icon: Package },
  { href: "/reports", label: "Laporan", icon: FileText },
  { href: "/pos", label: "POS Kasir", icon: ShoppingCart },
]

interface OwnerSidebarProps {
  open: boolean
  onClose: () => void
}

export default function OwnerSidebar({ open, onClose }: OwnerSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(open)
  }, [open])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <>
      {visible && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-white flex flex-col transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          visible ? "translate-x-0" : "-translate-x-full"
        } dark:bg-gray-950`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">SmartPOS</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href)
                  onClose()
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
