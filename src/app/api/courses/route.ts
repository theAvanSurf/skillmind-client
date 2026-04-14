import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function GET(req: NextRequest) {
    try {
        const qs = new URL(req.url).searchParams.toString();
        const response = await httpClient.get(`/courses${qs ? `?${qs}` : ""}`) as unknown;
        return NextResponse.json(response);
    } catch (err: unknown) {
        const error = err as { message?: string };
        return NextResponse.json({ message: error.message ?? "Error" }, { status: 500 });
    }
}
