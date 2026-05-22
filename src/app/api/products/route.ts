import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productSchema = z.object({
  sku: z.string().min(1, "SKU wajib diisi"),
  name: z.string().min(1, "Nama produk wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  costPrice: z.number().min(0, "Harga beli tidak boleh negatif"),
  sellingPrice: z.number().min(0, "Harga jual tidak boleh negatif"),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
})

export async function GET(request: NextRequest) {
  const role = request.headers.get("x-user-role")
  const search = request.nextUrl.searchParams.get("search") || ""
  const category = request.nextUrl.searchParams.get("category") || ""

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ]
  }

  if (category) {
    where.category = category
  }

  if (role === "cashier") {
    where.stock = { gt: 0 }
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const role = request.headers.get("x-user-role")
  if (role !== "owner") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data = productSchema.parse(body)

    const existing = await prisma.product.findUnique({ where: { sku: data.sku } })
    if (existing) {
      return NextResponse.json({ error: "SKU sudah digunakan" }, { status: 400 })
    }

    const product = await prisma.product.create({ data })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Gagal membuat produk" }, { status: 500 })
  }
}
