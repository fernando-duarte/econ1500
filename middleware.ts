import { NextResponse, type NextRequest } from "next/server";

// Validate environment variables at startup
const requiredEnvVars = ["NEXT_PUBLIC_LOGIN_REDIRECT", "NEXT_PUBLIC_LOGOUT_REDIRECT"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

// Get environment variables with fallback values
// const loginRedirect = process.env.NEXT_PUBLIC_LOGIN_REDIRECT || '/';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Debug logging to help diagnose issues
  //console.log(`[Middleware] Path: ${path}`);

  // Check for authentication
  const token = request.cookies.get("session-token")?.value || "";
  //console.log(`[Middleware] Session token: ${token ? "exists" : "missing"}`);

  // If user is already logged in and tries to access the root (login) page,
  // redirect them to the game
  if (path === "/" && token) {
    //console.log("[Middleware] Authenticated user trying to access login page, redirecting to /game");
    return NextResponse.redirect(new URL("/game", request.url));
  }

  // If user is not logged in and tries to access protected routes,
  // redirect them to the root (login) page with returnUrl
  if (path.startsWith("/game") && !token) {
    //console.log("[Middleware] Unauthenticated user trying to access protected route, redirecting to login");
    const url = new URL("/", request.url);
    url.searchParams.set("returnUrl", path);
    return NextResponse.redirect(url);
  }

  // Special handling for the logout redirect
  if (path === "/api/auth/logout" && !token) {
    //console.log("[Middleware] Already logged out, redirecting to login");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  matcher: ["/", "/game/:path*", "/api/auth/logout"],
};
