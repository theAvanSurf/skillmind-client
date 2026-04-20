import { NextRequest, NextResponse } from "next/server";
import { AppConfiguration } from "@/configurations/app.config";
import { cookies } from "next/headers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uniqueCode: string }> }
) {
  const { uniqueCode } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const activeProfileId = cookieStore.get("activeProfileId")?.value;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (activeProfileId) headers["X-Profile-Id"] = activeProfileId;

  try {
    const res = await fetch(
      `${AppConfiguration.API_URL}/courses/my-certificates/${encodeURIComponent(uniqueCode)}/render`,
      { headers }
    );
    if (!res.ok) {
      return NextResponse.json({ message: "Not found" }, { status: res.status });
    }
    const html = await res.text();
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
