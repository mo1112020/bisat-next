import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_TOKEN = 'bisat_admin_secret_2026';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Tag request headers so root layout can hide Navbar/Footer
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-is-admin', '1');

    // Login page is always accessible
    if (pathname === '/admin/login') {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // All other admin routes require the session cookie
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
