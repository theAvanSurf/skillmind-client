import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import type { SessionStatusResponse } from "@/types/billing.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const sessionId = request.nextUrl.searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json({ message: "sessionId is required" }, { status: 400 });
        }

        const data = await httpClient.get<SessionStatusResponse>(
            `${API_ENDPOINTS.PAYMENT.SESSION_STATUS}?sessionId=${sessionId}`
        );

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        const status =
            error?.response?.status ??
            (Number(error?.code) || 500);

        const message =
            error?.response?.data?.message ??
            error?.message ??
            "Internal Server Error";

        return NextResponse.json(
            { message },
            { status: status >= 100 && status < 600 ? status : 500 }
        );
    }
}
