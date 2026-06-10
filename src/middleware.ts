// middleware.ts — Protect /admin routes
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. CRITICAL ALLOWANCE: If the request is for the login page, let it through!
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return NextResponse.next();
  }

  // 2. Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;

    // Token is a simple env-variable secret for MVP; swap for JWT in production
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};