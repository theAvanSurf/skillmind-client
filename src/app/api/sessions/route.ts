import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { normalizeSession } from "@/app/api/sessions/normalizeSession";

export async function GET(_request: NextRequest): Promise<NextResponse> {
    try {
        const raw = await httpClient.get(
            API_ENDPOINTS.SESSIONS.GET_USER_SESSION
        ) as unknown;

        return NextResponse.json(normalizeSession(raw), { status: 200 });
    } catch (error: any) {
        const status = error?.response?.status ?? Number(error?.code) ?? 500;
        const message = error?.message ?? "Internal Server Error";

        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}

