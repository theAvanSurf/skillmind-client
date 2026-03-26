import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import type { Subscription } from "@/types/billing.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest): Promise<NextResponse> {
    try {
        const data = await httpClient.get<Subscription>(
            API_ENDPOINTS.PAYMENT.SUBSCRIPTION
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
