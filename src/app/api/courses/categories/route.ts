import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function GET(_req: NextRequest) {
    try {
        const response = await httpClient.get("/courses/categories") as unknown;
        return NextResponse.json(response);
    } catch (err: unknown) {
        const error = err as { message?: string };
        return NextResponse.json({ message: error.message ?? "Error" }, { status: 500 });
    }
}
