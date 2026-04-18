import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function GET(req: NextRequest) {
    try {
        const q = new URL(req.url).searchParams.get("q") ?? "";
        const response = await httpClient.get(`/courses/search?q=${encodeURIComponent(q)}`) as unknown;
        return NextResponse.json(response);
    } catch (err: unknown) {
        const error = err as { message?: string };
        return NextResponse.json({ message: error.message ?? "Error" }, { status: 500 });
    }
}
