import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
    try {
        const data = await httpClient.get("/professor/livestreams")
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status: error?.response?.status ?? 500 })
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json()
        const data = await httpClient.post("/professor/livestreams", body)
        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status: error?.response?.status ?? 500 })
    }
}
