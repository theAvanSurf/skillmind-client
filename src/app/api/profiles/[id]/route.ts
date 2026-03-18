import httpClient from "@/configurations/httpClient";
import { CreateProfileRequest, Profile, UpdateProfileRequest } from "@/features/profiles/types/profile.types";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const body: UpdateProfileRequest = await request.json();

        const data = await httpClient.patch<Profile>(
            API_ENDPOINTS.PROFILES.UPDATE(id),
            body
        );

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        const status = error?.response?.status ?? (Number(error?.code) || 500);
        const message = error?.response?.data?.message ?? error?.message ?? "Internal Server Error";

        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;

        const data = await httpClient.delete(
            API_ENDPOINTS.PROFILES.DELETE(id)
        );

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        const status = error?.response?.status ?? (Number(error?.code) || 500);
        const message = error?.response?.data?.message ?? error?.message ?? "Internal Server Error";

        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}