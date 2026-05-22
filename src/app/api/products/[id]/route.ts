import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productUpdateSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  costPrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get("x-user-role")
  if (role !== "owner") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const data = productUpdateSchema.parse(body)

    if (data.sku) {
      const existing = await prisma.product.findFirst({
        where: { sku: data.sku, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json({ error: "SKU sudah digunakan" }, { status: 400 })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Gagal mengupdate produk" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get("x-user-role")
  if (role !== "owner") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 })
  }

  const { id } = await params

  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 })
  }
}
