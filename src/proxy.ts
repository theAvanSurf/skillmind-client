import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect professor routes — redirect to login if no auth cookie
  if (pathname.startsWith("/professor")) {
    const token = request.cookies.get("token");
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/professor/:path*"],
};
