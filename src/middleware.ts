import { NextResponse, type NextRequest } from "next/server";

// Protected professor routes
const PROFESSOR_ROUTES = ["/professor"];

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/professor/:path*"],
};
