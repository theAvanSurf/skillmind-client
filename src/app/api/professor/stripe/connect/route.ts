import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const returnUrl = req.nextUrl.searchParams.get("returnUrl")
    const authorization = req.headers.get("authorization")

    if (!returnUrl) {
      return NextResponse.json({ message: "returnUrl is required" }, { status: 400 })
    }

    const data = await httpClient.post(
      `/professor/stripe/connect?returnUrl=${encodeURIComponent(returnUrl)}`,
      {},
      authorization ? { headers: { Authorization: authorization } } : undefined
    )
    return NextResponse.json(data)
  } catch (error: any) {
    const status = error?.response?.status ?? (Number(error?.code) || 500)
    const message = error?.message ?? "Internal Server Error"
    return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 })
  }
}
