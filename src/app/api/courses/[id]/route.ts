import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const response = await httpClient.get(`/courses/${id}`) as unknown;
        return NextResponse.json(response);
    } catch (err: unknown) {
        const error = err as { message?: string };
        return NextResponse.json({ message: error.message ?? "Error" }, { status: 500 });
    }
}