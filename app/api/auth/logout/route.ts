import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const res = NextResponse.json({ success: true });

        // Clear the session token cookie
        res.cookies.set({
            name: 'session-token',
            value: '',
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return res;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        );
    }
} 