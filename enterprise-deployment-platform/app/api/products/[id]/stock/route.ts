import { NextResponse } from 'next/server'
import { getProductStock, getAllProducts } from '@/lib/products'
import { apiRateLimiter, getClientIdentifier } from '@/lib/rateLimit'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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
        },
      }
    )
  }

  const productId = parseInt(params.id, 10)

  if (isNaN(productId)) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    )
  }

  const stock = getProductStock(productId)

  if (stock === 0 && !getAllProducts().find(p => p.id === productId)) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  }

  const response = NextResponse.json({
    productId,
    stock,
    inStock: stock > 0,
  })

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
  // Cache stock info for 30 seconds (stock changes frequently)
  response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')

  return response
}

