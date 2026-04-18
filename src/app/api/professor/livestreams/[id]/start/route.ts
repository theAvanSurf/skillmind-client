import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
        const { id } = await params
        const data = await httpClient.post(`/professor/livestreams/${id}/start`, {})
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status: error?.response?.status ?? 500 })
    }
}
