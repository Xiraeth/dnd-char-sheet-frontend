import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/signup"];
const protectedPaths = ["/characters", "/characters/**", "/characters/[id]"];

/**
 * Checks if a path matches any of the protected path patterns
 * @param path - The path to check
 * @param patterns - Array of path patterns to match against
 * @returns boolean indicating if the path is protected
 */
function isPathProtected(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    // Convert Next.js dynamic route pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, ".*") // Replace ** with .* for regex
      .replace(/\[.*?\]/g, "[^/]+"); // Replace [param] with regex for any non-slash characters

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  });
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const pathname = request.nextUrl.pathname;

  const isPublicPath = publicPaths.includes(pathname);
  const isProtectedPath = isPathProtected(pathname, protectedPaths);

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

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
