import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params
    try {
        const data = await httpClient.get(`/professor/livestreams/${id}/stream-key`)
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status: error?.response?.status ?? 500 })
    }
}
