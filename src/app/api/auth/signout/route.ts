import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
    const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"));

    // Clear all auth cookies
    const cookieOptions = {
        path: "/",
        expires: new Date(0),
        httpOnly: true,
        sameSite: "lax" as const,
    };

    response.cookies.set("token", "", cookieOptions);
    response.cookies.set("activeProfileId", "", cookieOptions);

    return response;
}
