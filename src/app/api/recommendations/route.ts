import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import type { RecommendationResponse, RecommendedCourse } from "@/types/recommendations.types";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const activeProfileId = request.cookies.get("activeProfileId")?.value;

    try {
        if (!activeProfileId) {
            // Fallback to trending
            const trending = (await httpClient.get(API_ENDPOINTS.RECOMMENDATIONS.TRENDING)) as any as RecommendedCourse[];
            return NextResponse.json({
                profile_id: "",
                is_personalized: false,
                recommendations: trending
            } as RecommendationResponse, { status: 200 });
        }

        const data = (await httpClient.get(
            API_ENDPOINTS.RECOMMENDATIONS.GET(activeProfileId)
        )) as any as RecommendationResponse;

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        const status = error?.response?.status ?? 500;
        const message = error?.response?.data?.message ?? error?.message ?? "Internal Server Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}
