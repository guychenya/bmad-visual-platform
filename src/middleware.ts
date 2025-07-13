import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if authentication is bypassed - be more explicit
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
  
  console.log('[Middleware] Auth bypass status:', bypassAuth)
  console.log('[Middleware] Environment variable:', process.env.NEXT_PUBLIC_BYPASS_AUTH)
  console.log('[Middleware] Current pathname:', req.nextUrl.pathname)
  
  if (bypassAuth) {
    console.log('[Middleware] Auth bypassed, handling route:', req.nextUrl.pathname)
    
    // Redirect root to chat when auth is bypassed
    if (req.nextUrl.pathname === '/') {
      console.log('[Middleware] Redirecting root to chat')
      return NextResponse.redirect(new URL('/chat?template=Custom%20Project&project=new', req.url))
    }
    
    // Skip auth routes when bypassed
    if (req.nextUrl.pathname.startsWith('/auth')) {
      console.log('[Middleware] Redirecting auth routes to chat')
      return NextResponse.redirect(new URL('/chat', req.url))
    }
    
    // Allow all dashboard routes without authentication
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('[Middleware] Allowing dashboard access without auth')
      return res
    }
    
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  // Auth routes (redirect if already logged in)
  if (req.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Redirect root to dashboard if logged in
  if (req.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/']
}