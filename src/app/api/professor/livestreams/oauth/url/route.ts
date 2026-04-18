import httpClient from "@/configurations/httpClient"
import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
    try {
        const data = await httpClient.get("/professor/livestreams/oauth/url")
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status: error?.response?.status ?? 500 })
    }
}
