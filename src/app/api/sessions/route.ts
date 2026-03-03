import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";

export async function GET(_request: NextRequest): Promise<NextResponse> {
    try {
        // httpClient's request interceptor already reads the "token" cookie
        // via next/headers and attaches it as "Authorization: Bearer <token>"
        // — so we do NOT need to manually extract it here.
        const session = await httpClient.get(
            API_ENDPOINTS.SESSIONS.GET_USER_SESSION
        ) as unknown;

        return NextResponse.json(session, { status: 200 });
    } catch (error: any) {
        const status = error?.response?.status ?? Number(error?.code) ?? 500;
        const message = error?.message ?? "Internal Server Error";

        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}
