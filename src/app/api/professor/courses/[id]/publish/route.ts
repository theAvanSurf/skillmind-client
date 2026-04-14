import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await params
  try {
    await httpClient.post(`/professor/courses/${id}/publish`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    const status = error?.response?.status ?? (Number(error?.code) || 500)
    const message = error?.message ?? "Internal Server Error"
    return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 })
  }
}
