import { NextResponse, type NextRequest } from 'next/server';

// Validate environment variables at startup
const requiredEnvVars = ['NEXT_PUBLIC_LOGIN_REDIRECT', 'NEXT_PUBLIC_LOGOUT_REDIRECT'];
const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
    console.warn(
        `Warning: Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
}

// Get environment variables with fallback values
// const loginRedirect = process.env.NEXT_PUBLIC_LOGIN_REDIRECT || '/';
const logoutRedirect = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || '/';

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Get the token from the cookies
    const token = request.cookies.get('session-token')?.value || '';

    // Redirect logic for protected routes
    if (path !== '/' && !token) {
        return NextResponse.redirect(new URL(logoutRedirect, request.url));
    }

    return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
    matcher: ['/', '/game/:path*']
}; 