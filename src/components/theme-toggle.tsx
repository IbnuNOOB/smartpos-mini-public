"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "./theme-provider"

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition cursor-pointer"
      title={theme === "light" ? "Mode gelap" : "Mode terang"}
    >
      {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  )
}
