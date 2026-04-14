import { AppConfiguration } from "@/configurations/app.config";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { CreateProfessorProfileRequest } from "@/features/auth/types/auth.types";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: CreateProfessorProfileRequest = await req.json();
        const authHeader = req.headers.get("Authorization");

        const response = await axios.post(
            `${AppConfiguration.API_URL}${API_ENDPOINTS.PROFESSOR.PROFILE}`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeader ? { Authorization: authHeader } : {}),
                },
            }
        );

        return NextResponse.json(response.data, { status: 201 });
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
