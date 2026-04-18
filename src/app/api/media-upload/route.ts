import { NextRequest, NextResponse } from "next/server";
import { AppConfiguration } from "@/configurations/app.config";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${AppConfiguration.API_URL}/media-upload/upload`, {
            method: "POST",
            headers,
            body: formData,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
