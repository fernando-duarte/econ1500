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

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Get the token from the cookies
    const token = request.cookies.get('session-token')?.value || '';

    // If user is already logged in and tries to access the root (login) page,
    // redirect them to the game
    if (path === '/' && token) {
        return NextResponse.redirect(new URL('/game', request.url));
    }

    // If user is not logged in and tries to access protected routes,
    // redirect them to the root (login) page
    if (path !== '/' && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
    matcher: ['/', '/game/:path*']
}; 