import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

const OWNER_ROUTES = ["/dashboard", "/products", "/reports"]
const CASHIER_ROUTES = ["/pos"]
const PUBLIC_ROUTES = ["/login", "/api/auth/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("smartpos_token")?.value

  if (pathname.startsWith("/api/auth/login")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 })
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.userId)
    requestHeaders.set("x-user-role", payload.role)

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  if (!token && !PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token) {
    const payload = await verifyToken(token)

    if (pathname === "/login" && payload) {
      if (payload.role === "owner") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return NextResponse.redirect(new URL("/pos", request.url))
    }

    if (!payload && !PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("smartpos_token")
      return response
    }

    if (payload) {
      const isOwnerRoute = OWNER_ROUTES.some((r) => pathname.startsWith(r))
      const isCashierRoute = CASHIER_ROUTES.some((r) => pathname.startsWith(r))

      if (isOwnerRoute && payload.role !== "owner") {
        if (payload.role === "cashier") {
          return NextResponse.redirect(new URL("/pos", request.url))
        }
        return NextResponse.redirect(new URL("/login", request.url))
      }

      if (pathname === "/") {
        if (payload.role === "owner") {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.redirect(new URL("/pos", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
