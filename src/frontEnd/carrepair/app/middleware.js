import { NextResponse } from 'next/server';

export function middleware(req) {
    const accessToken = req.cookies.get('accessToken');

    const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');

    if (isProtectedRoute && !accessToken) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}