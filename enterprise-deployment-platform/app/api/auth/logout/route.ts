import { NextResponse } from 'next/server'
import { logout } from '@/lib/auth'
import { apiRateLimiter, getClientIdentifier } from '@/lib/rateLimit'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
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

  const result = await logout(request)
  
  const response = NextResponse.json({ success: true })
  response.headers.set('Set-Cookie', result.cookieHeader)
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
  // No cache for logout
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  
  return response
}

