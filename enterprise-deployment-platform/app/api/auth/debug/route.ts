import { NextResponse } from 'next/server'
import { apiRateLimiter, getClientIdentifier } from '@/lib/rateLimit'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Debug endpoint to check cookies
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = apiRateLimiter.check(identifier)

  if (!rateLimitResult.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'API rate limit exceeded. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  const cookieHeader = request.headers.get('cookie')
  
  // Parse all cookies
  const cookies: Record<string, string> = {}
  if (cookieHeader) {
    const cookieParts = cookieHeader.split(';').map(c => c.trim())
    for (const cookie of cookieParts) {
      const equalIndex = cookie.indexOf('=')
      if (equalIndex !== -1) {
        const key = cookie.substring(0, equalIndex).trim()
        const value = cookie.substring(equalIndex + 1).trim()
        try {
          cookies[key] = decodeURIComponent(value)
        } catch {
          cookies[key] = value
        }
      }
    }
  }
  
  const response = NextResponse.json({
    cookieHeader,
    cookies,
    hasAuthSession: cookies['auth_session'] !== undefined,
    authSessionValue: cookies['auth_session'] || null,
    allHeaders: {
      cookie: cookieHeader,
      'user-agent': request.headers.get('user-agent'),
    },
  })

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
  // No cache for debug endpoint
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  
  return response
}

