import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const isPublicPath =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  // Create a response object
  const response = NextResponse.next();

  // Add a custom header to indicate authentication status
  if (token) {
    response.headers.set("x-auth-status", "authenticated");
  } else {
    response.headers.set("x-auth-status", "unauthenticated");
  }

  // Redirect if authenticated user tries to access public paths
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
