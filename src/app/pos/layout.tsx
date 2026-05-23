import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import PosLayoutClient from "./pos-layout-client"

export default async function PosLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("smartpos_token")?.value
  let role: string | null = null

  if (token) {
    const payload = await verifyToken(token)
    if (payload) {
      role = payload.role
    }
  }

  return <PosLayoutClient role={role}>{children}</PosLayoutClient>
}
