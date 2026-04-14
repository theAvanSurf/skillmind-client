import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ templateId: string }> }): Promise<NextResponse> {
  const { templateId } = await params
  try {
    const body = await req.json()
    const data = await httpClient.put(`/professor/certificates/templates/${templateId}`, body)
    return NextResponse.json(data)
  } catch (error: any) {
    const status = error?.response?.status ?? (Number(error?.code) || 500)
    const message = error?.message ?? "Internal Server Error"
    return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 })
  }
}
