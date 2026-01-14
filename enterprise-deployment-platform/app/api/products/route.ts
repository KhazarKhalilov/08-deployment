import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiRateLimiter, getClientIdentifier } from '@/lib/rateLimit'
import { getAllProducts, getProductsByCategory, getProductsInStock } from '@/lib/products'

// Edge runtime for better performance and lower latency
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Rate limiting for API
  const identifier = getClientIdentifier(request)
  const rateLimitResult = apiRateLimiter.check(identifier)

  if (!rateLimitResult.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'API rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
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

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const inStock = searchParams.get('inStock')

  let filteredProducts = getAllProducts()

  if (category) {
    filteredProducts = getProductsByCategory(category)
  }

  if (inStock === 'true') {
    filteredProducts = getProductsInStock().filter(p => 
      !category || p.category === category
    )
  }

  // Simulate API delay for testing
  await new Promise(resolve => setTimeout(resolve, 100))

  // Return products with stock information
  const response = NextResponse.json({
    products: filteredProducts.map(({ stock, sku, ...product }) => ({
      ...product,
      stock, // Include stock for inventory management
      sku, // Include SKU for tracking
    })),
    total: filteredProducts.length,
  })

  // Edge caching headers - Cache for 1 minute, revalidate in background
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())

  return response
}

