# SmartPOS Mini

Aplikasi Kasir Digital Berbasis Web SaaS — ringan, cepat, responsif untuk UMKM retail.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Fullstack | Next.js 16 (App Router) + TypeScript |
| Database | Prisma v7 + SQLite (libsql adapter) |
| Auth | JWT (jose) + Cookie Session |
| UI | Tailwind CSS |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Salin .env.example ke .env dan isi konfigurasi
cp .env.example .env
# Isi JWT_SECRET, OWNER_PASSWORD, CASHIER_PASSWORD di file .env

# 3. Generate Prisma client & jalankan migrasi
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed data awal
OWNER_PASSWORD=rahasia123 CASHIER_PASSWORD=kasir456 npx tsx prisma/seed.ts

# 5. Jalankan development server
npm run dev
```

Buka http://localhost:3000

## Akun Default

Setelah seed, login dengan username `owner` atau `cashier` menggunakan password yang kamu set di environment variable.

## Cara Mengubah Password

Edit `OWNER_PASSWORD` / `CASHIER_PASSWORD` di file `.env`, lalu jalankan ulang:

```bash
OWNER_PASSWORD=passwordbaru CASHIER_PASSWORD=kasirbaru npx tsx prisma/seed.ts
```

## Struktur Project

```
src/
├── app/
│   ├── (auth)/login/        # Halaman login
│   ├── (owner)/
│   │   ├── dashboard/       # Dashboard analitik
│   │   ├── products/        # CRUD produk
│   │   └── reports/         # Laporan transaksi
│   ├── (cashier)/
│   │   └── pos/             # Interface kasir
│   └── api/                 # REST API backend
├── components/              # UI components
├── lib/
│   ├── auth.ts              # JWT helpers
│   ├── prisma.ts            # Prisma singleton
│   ├── store.ts             # Zustand cart state
│   └── utils.ts             # Utilities
└── middleware.ts             # Role-based access guard
```

## Fitur

- Multi-user: Owner & Kasir dengan hak akses berbeda
- Manajemen produk: CRUD + pencarian + pagination
- POS Kasir: grid produk, keranjang, checkout, struk
- Dashboard: pendapatan, profit, riwayat transaksi
- Validasi stok real-time (backend)
- Kode transaksi unik otomatis: `TRX-YYYYMMDD-XXX`

## Deployment

```bash
npm run build
npm start
```

Untuk production, pastikan mengisi `JWT_SECRET` dengan string random yang kuat (`openssl rand -hex 32`).
