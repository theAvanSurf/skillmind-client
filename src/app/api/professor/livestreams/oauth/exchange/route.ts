import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json()
        await httpClient.post("/professor/livestreams/oauth/exchange", body)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status: error?.response?.status ?? 500 })
    }
}
