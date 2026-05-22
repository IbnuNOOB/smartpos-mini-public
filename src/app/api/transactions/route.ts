import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateTransactionCode } from "@/lib/utils"
import { z } from "zod"

const transactionSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
    })
  ).min(1, "Keranjang tidak boleh kosong"),
  totalPaid: z.number().min(0, "Jumlah bayar tidak valid"),
})

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { items, totalPaid } = transactionSchema.parse(body)

    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Beberapa produk tidak ditemukan" }, { status: 400 })
    }

    let totalPrice = 0
    const transactionItems = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)!

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stok "${product.name}" tidak mencukupi (sisa: ${product.stock})` },
          { status: 400 }
        )
      }

      const subtotal = product.sellingPrice * item.quantity
      totalPrice += subtotal

      transactionItems.push({
        productId: product.id,
        quantity: item.quantity,
        subtotal,
      })
    }

    if (totalPaid < totalPrice) {
      return NextResponse.json(
        { error: "Uang yang dibayarkan kurang" },
        { status: 400 }
      )
    }

    const change = totalPaid - totalPrice

    const lastTransaction = await prisma.transaction.findFirst({
      orderBy: { createdAt: "desc" },
    })

    const transactionCode = generateTransactionCode(
      lastTransaction?.transactionCode
    )

    const transaction = await prisma.transaction.create({
      data: {
        transactionCode,
        totalPrice,
        totalPaid,
        change,
        cashierId: userId,
        items: {
          create: transactionItems,
        },
      },
      include: {
        items: true,
        cashier: { select: { username: true } },
      },
    })

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return NextResponse.json({
      id: transaction.id,
      transactionCode: transaction.transactionCode,
      totalPrice: transaction.totalPrice,
      totalPaid: transaction.totalPaid,
      change: transaction.change,
      cashier: transaction.cashier.username,
      createdAt: transaction.createdAt.toISOString(),
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Transaction error:", error)
    return NextResponse.json({ error: "Gagal memproses transaksi" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const role = request.headers.get("x-user-role")
  if (role !== "owner") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
  }

  const transactions = await prisma.transaction.findMany({
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
      cashier: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json(transactions)
}
