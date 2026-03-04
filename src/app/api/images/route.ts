import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { MediaResponse } from "@/types/assets.type";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    try {
        const response = await httpClient.get<MediaResponse[]>(
            API_ENDPOINTS.ASSETS.MEDIA_GET_IMAGES
        );

        return NextResponse.json(
            { images: response },
            { status: 200 }
        );

    } catch (error: any) {
        const status =
            error?.response?.status ??
            Number(error?.code) ??
            500;

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