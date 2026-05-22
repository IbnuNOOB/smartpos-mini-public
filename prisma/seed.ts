import { PrismaClient } from "../src/generated/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const adapter = new PrismaLibSql({
  url: "file:./dev.db",
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const ownerPassword = process.env.OWNER_PASSWORD
  const cashierPassword = process.env.CASHIER_PASSWORD

  if (!ownerPassword || !cashierPassword) {
    console.error("ERROR: OWNER_PASSWORD and CASHIER_PASSWORD environment variables must be set.")
    console.error("Example:")
    console.error("  OWNER_PASSWORD=rahasia123 CASHIER_PASSWORD=kasir456 npx tsx prisma/seed.ts")
    process.exit(1)
  }

  const owner = await prisma.user.upsert({
    where: { username: "owner" },
    update: { passwordHash: ownerPassword },
    create: {
      username: "owner",
      passwordHash: ownerPassword,
      role: "owner",
    },
  })

  const cashier = await prisma.user.upsert({
    where: { username: "cashier" },
    update: { passwordHash: cashierPassword },
    create: {
      username: "cashier",
      passwordHash: cashierPassword,
      role: "cashier",
    },
  })

  console.log("Seeded users:", { owner: owner.username, cashier: cashier.username })

  const products = [
    { sku: "SKU001", name: "Kopi Hitam", category: "Minuman", costPrice: 8000, sellingPrice: 15000, stock: 50 },
    { sku: "SKU002", name: "Teh Manis", category: "Minuman", costPrice: 5000, sellingPrice: 10000, stock: 40 },
    { sku: "SKU003", name: "Nasi Goreng", category: "Makanan", costPrice: 12000, sellingPrice: 20000, stock: 20 },
    { sku: "SKU004", name: "Mie Goreng", category: "Makanan", costPrice: 8000, sellingPrice: 15000, stock: 30 },
    { sku: "SKU005", name: "Roti Bakar", category: "Makanan", costPrice: 6000, sellingPrice: 12000, stock: 25 },
    { sku: "SKU006", name: "Air Mineral", category: "Minuman", costPrice: 3000, sellingPrice: 5000, stock: 100 },
    { sku: "SKU007", name: "Es Kopi Susu", category: "Minuman", costPrice: 10000, sellingPrice: 18000, stock: 35 },
    { sku: "SKU008", name: "Kentang Goreng", category: "Snack", costPrice: 7000, sellingPrice: 13000, stock: 15 },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    })
  }

  console.log(`Seeded ${products.length} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
