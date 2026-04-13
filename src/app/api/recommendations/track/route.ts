import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const activeProfileId = request.cookies.get("activeProfileId")?.value;

    if (!activeProfileId) {
        // Can't track personalized events without a profile. Fail silently.
        return NextResponse.json({ success: false, message: "No active profile" }, { status: 200 });
    }

    try {
        const body = await request.json();

        // Silently drop events for non-UUID course IDs (e.g. mock/legacy data)
        const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!body?.course_id || !UUID_RE.test(body.course_id)) {
            return NextResponse.json({ success: false, message: "Non-UUID course_id, skipping" }, { status: 200 });
        }

        // Inject profile_id automatically for security so client cant spoof others
        const payload = {
            ...body,
            profile_id: activeProfileId
        };

        const data = await httpClient.post(
            API_ENDPOINTS.RECOMMENDATIONS.TRACK,
            payload
        );

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const message = error?.response?.data?.message ?? error?.message ?? "Internal Server Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}
