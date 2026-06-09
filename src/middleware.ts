// middleware.ts — Protect /admin routes
// Uses a simple signed cookie set by a /api/admin/login route.
// For production, replace with Supabase Auth or NextAuth.

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
