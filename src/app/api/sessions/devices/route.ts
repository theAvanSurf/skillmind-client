import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { normalizeSession } from "@/app/api/sessions/normalizeSession";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const raw = await httpClient.post(API_ENDPOINTS.SESSIONS.ADD_DEVICE, body) as unknown;
        return NextResponse.json(normalizeSession(raw), { status: 200 });
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const message = error?.response?.data?.message ?? error?.message ?? "Internal Server Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}
