import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { normalizeSession } from "@/app/api/sessions/normalizeSession";

/**
 * POST /api/sessions/select-profile
 * Body: { deviceId: string, profileId: string }
 *
 * 1. Registers the device with the chosen profile on the backend
 * 2. Sets an `activeProfileId` HTTP-only cookie so the authenticated
 *    layout (Server Component) can read the selected profile on every request
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { deviceId, profileId } = await request.json();

        // Register device ↔ profile on NestJS
        const raw = await httpClient.post(API_ENDPOINTS.SESSIONS.ADD_DEVICE, {
            DeviceId: deviceId,
            ProfileId: profileId,
        }) as unknown;

        const response = NextResponse.json(normalizeSession(raw), { status: 200 });

        // Persist the active profile so server components can read it
        response.cookies.set("activeProfileId", profileId, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days — matches typical auth token lifetime
        });

        return response;
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const message = error?.response?.data?.message ?? error?.message ?? "Internal Server Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}

/**
 * DELETE /api/sessions/select-profile
 * Clears the activeProfileId cookie (used on logout / profile switch)
 */
export async function DELETE(_request: NextRequest): Promise<NextResponse> {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("activeProfileId", "", { maxAge: 0, path: "/" });
    return response;
}
