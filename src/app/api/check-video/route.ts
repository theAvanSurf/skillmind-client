import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ status: 400 }, { status: 400 });

    try {
        const res = await fetch(url, { method: "HEAD", cache: "no-store" });
        return NextResponse.json({ status: res.status });
    } catch {
        return NextResponse.json({ status: 0 });
    }
}
