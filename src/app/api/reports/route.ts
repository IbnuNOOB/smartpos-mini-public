import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const role = request.headers.get("x-user-role")
  if (role !== "owner") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
  }

  const transactions = await prisma.transaction.findMany({
    include: {
      items: {
        include: {
          product: { select: { costPrice: true } },
        },
      },
    },
  })

  let totalRevenue = 0
  let totalProfit = 0

  for (const tx of transactions) {
    totalRevenue += tx.totalPrice
    for (const item of tx.items) {
      const cost = item.product.costPrice * item.quantity
      totalProfit += item.subtotal - cost
    }
  }

  return NextResponse.json({
    totalRevenue,
    totalProfit,
    totalTransactions: transactions.length,
  })
}
