import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generalRateLimiter, getClientIdentifier } from './lib/rateLimit'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip rate limiting for static assets and API health checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Real rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = generalRateLimiter.check(identifier)

  if (!rateLimitResult.allowed) {
    // Log rate limit violation (only in production to avoid spam)
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage('Rate limit exceeded', {
        level: 'warning',
        tags: {
          path: pathname,
          ip: identifier,
        },
      })
    }

    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '200',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  const response = NextResponse.next()

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '200')
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())

  // Log errors only (not every request) in production
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/api/')) {
    // Only log API requests, and only errors will be captured by Sentry
    // This reduces logging overhead
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

