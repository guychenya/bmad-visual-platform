import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if authentication is bypassed
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
  
  if (bypassAuth) {
    // Redirect root to chat when auth is bypassed
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/chat?template=Custom%20Project&project=new', req.url))
    }
    
    // Skip auth routes when bypassed
    if (req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/chat', req.url))
    }
    
    // Allow all dashboard routes without authentication
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
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