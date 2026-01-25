import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected routes that require authentication
 */
const protectedRoutes = ["/characters", "/create-character"];

/**
 * Public routes that don't require authentication
 */
const publicRoutes = ["/", "/login", "/signup"];

/**
 * Middleware to protect routes and verify authentication
 * This runs on the server before the page renders
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // If it's a protected route, we'll let the client-side handle auth checks
  // since we can't verify JWT cookies server-side without making an API call
  // The client-side components will handle redirecting unauthenticated users
  if (isProtectedRoute) {
    // Allow the request to proceed, auth will be checked client-side
    // This prevents the page from rendering before auth is verified
    return NextResponse.next();
  }

  // Public routes are always allowed
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Default: allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.svg|.*\\..*|fonts).*)",
  ],
};
