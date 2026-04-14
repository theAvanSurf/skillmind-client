import httpClient from "@/configurations/httpClient"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params
    try {
        const data = await httpClient.get(`/courses/${id}/live`)
        return NextResponse.json(data)
    } catch (error: any) {
        const status = error?.response?.status ?? 500
        if (status === 404) return NextResponse.json(null, { status: 200 })
        return NextResponse.json({ message: error?.message ?? "Internal Server Error" }, { status })
    }
}
