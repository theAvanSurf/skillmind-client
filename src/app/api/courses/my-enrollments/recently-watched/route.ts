import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function GET(_req: NextRequest) {
    try {
        const data = await httpClient.get("/courses/my-enrollments/recently-watched");
        return NextResponse.json(data);
    } catch (err: any) {
        const status = err?.response?.status ?? 500;
        const message = err?.message ?? "Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}
