import httpClient from "@/configurations/httpClient"
import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  try {
    const data = await httpClient.get("/professor/dashboard")
    return NextResponse.json(data)
  } catch (error: any) {
    const status = error?.response?.status ?? (Number(error?.code) || 500)
    const message = error?.message ?? "Internal Server Error"
    return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 })
  }
}
