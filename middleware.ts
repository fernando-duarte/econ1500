import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Define which paths are considered public
    const isPublicPath = path === '/login';

    // Get the token from the cookies
    const token = request.cookies.get('session-token')?.value || '';

    // Redirect logic for protected routes
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect logic for public routes (if already logged in)
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
    matcher: ['/', '/login', '/game/:path*']
}; 