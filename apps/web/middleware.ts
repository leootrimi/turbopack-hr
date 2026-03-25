import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccess } from './config/rbac';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    let role = '';
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw new Error("Invalid token format");
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      role = payload.role;
    } catch (e) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    if (!canAccess(role, pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
