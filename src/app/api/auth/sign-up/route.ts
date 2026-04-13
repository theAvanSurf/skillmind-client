import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { SignUpRequest, SignUpResponse } from "@/features/auth/types/auth.types";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: SignUpRequest = await req.json();
        const response = await httpClient.post<SignUpResponse>(
            API_ENDPOINTS.AUTH.SIGN_UP,
            body
        ) as unknown as SignUpResponse;

        return NextResponse.json(response, { status: 201 });
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status || 400;
            return NextResponse.json(
                err.response?.data || { message: err.message },
                { status }
            );
        }
        const message = err instanceof Error ? err.message : "Internal Server Error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
