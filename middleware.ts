import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/register']
const AUTH_ROUTES = ['/login', '/register']

// NextAuth v5 with database strategy stores a session token (not a JWT) in the cookie.
// Edge Runtime cannot query the database to verify it, so we check cookie presence here.
// The real session verification (with DB lookup) happens in DashboardLayout via auth().
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ??
    req.cookies.get('__Secure-authjs.session-token')?.value

  const isAuthenticated = !!sessionToken

  // If authenticated and hitting an auth page, redirect to dashboard
  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If not authenticated and hitting a protected route, redirect to login
  const isPublic = PUBLIC_ROUTES.includes(pathname)
  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|api/health|api/billing/webhook|_next/static|_next/image|favicon.ico).*)',
  ],
}
