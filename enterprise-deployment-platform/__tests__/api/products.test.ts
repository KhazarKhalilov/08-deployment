/**
 * @jest-environment node
 */
import { GET } from '@/app/api/products/route'
import { NextRequest } from 'next/server'

// Mock rate limiter
jest.mock('@/lib/rateLimit', () => ({
  apiRateLimiter: {
    check: jest.fn(() => ({
      allowed: true,
      remaining: 99,
      resetTime: Date.now() + 60000,
    })),
  },
  getClientIdentifier: jest.fn(() => '127.0.0.1'),
}))

describe('/api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all products', async () => {
    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('products')
    expect(data).toHaveProperty('total')
    expect(data.products).toHaveLength(6)
    expect(data.total).toBe(6)
  })

  it('should filter products by category', async () => {
    const request = new NextRequest('http://localhost:3000/api/products?category=Electronics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.products.every((p: { category: string }) => p.category === 'Electronics')).toBe(true)
    expect(data.total).toBe(4)
  })

  it('should filter products by inStock status', async () => {
    const request = new NextRequest('http://localhost:3000/api/products?inStock=true')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.products.every((p: { inStock: boolean }) => p.inStock === true)).toBe(true)
    expect(data.total).toBe(5)
  })

  it('should combine filters', async () => {
    const request = new NextRequest('http://localhost:3000/api/products?category=Electronics&inStock=true')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.products.every((p: { category: string; inStock: boolean }) => 
      p.category === 'Electronics' && p.inStock === true
    )).toBe(true)
  })

  it('should include cache headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)

    expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=60, stale-while-revalidate=300')
    expect(response.headers.get('X-RateLimit-Limit')).toBe('100')
  })

  it('should return rate limit error when exceeded', async () => {
    const { apiRateLimiter } = require('@/lib/rateLimit')
    apiRateLimiter.check.mockReturnValueOnce({
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + 60000,
    })

    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.error).toBe('Too Many Requests')
    expect(response.headers.get('Retry-After')).toBeTruthy()
  })
})

