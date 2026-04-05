import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { normalizeSession } from "@/app/api/sessions/normalizeSession";

interface RouteContext {
    params: Promise<{ deviceId: string }>;
}

export async function DELETE(
    _request: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    try {
        const { deviceId } = await context.params;
        const raw = await httpClient.delete(
            API_ENDPOINTS.SESSIONS.REMOVE_DEVICE(deviceId)
        ) as unknown;
        return NextResponse.json(normalizeSession(raw), { status: 200 });
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const message = error?.response?.data?.message ?? error?.message ?? "Internal Server Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}
