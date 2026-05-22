export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function generateTransactionCode(lastCode?: string): string {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "")

  if (!lastCode) {
    return `TRX-${dateStr}-001`
  }

  const parts = lastCode.split("-")
  const seq = parseInt(parts[2] || "0", 10)
  const next = String(seq + 1).padStart(3, "0")
  return `TRX-${dateStr}-${next}`
}
