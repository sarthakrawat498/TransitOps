import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME } from "@/constants";

const PUBLIC_ROUTES = ["/login"];
const PROTECTED_PREFIXES = ["/dashboard", "/analytics", "/trips"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(token);

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*", "/trips/:path*", "/login"],
};
