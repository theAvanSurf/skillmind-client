import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = await httpClient.post(`/courses/${id}/confirm-enrollment`, body);
        return NextResponse.json(data);
    } catch (err: any) {
        const status = err?.response?.status ?? 500;
        const message = err?.response?.data?.message ?? err?.message ?? "Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}
