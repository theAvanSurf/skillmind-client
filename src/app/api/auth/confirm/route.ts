import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { ConfirmRequest } from "@/features/auth/types/auth.types";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ConfirmRequest = await req.json();
        const response = await httpClient.post(
            API_ENDPOINTS.AUTH.CONFIRM,
            body
        );

        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = Number(err.code) || 400;
            return NextResponse.json(
                { message: err.message },
                { status: status >= 100 && status < 600 ? status : 400 }
            );
        }
        const message = err instanceof Error ? err.message : "Internal Server Error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
