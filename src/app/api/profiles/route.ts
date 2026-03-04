import httpClient from "@/configurations/httpClient";
import { CreateProfileRequest, Profile } from "@/features/profiles/types/profile.types";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body: CreateProfileRequest = await request.json();
        const data = await httpClient.post<Profile>(
            API_ENDPOINTS.PROFILES.CREATE,
            [body]
        );

        return NextResponse.json(data, { status: 201 });
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