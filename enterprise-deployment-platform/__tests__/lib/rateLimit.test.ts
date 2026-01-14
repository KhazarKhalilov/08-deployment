/**
 * @jest-environment node
 */
import { apiRateLimiter, authRateLimiter, getClientIdentifier } from '@/lib/rateLimit'

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear rate limiter state between tests
    jest.clearAllMocks()
  })

  describe('apiRateLimiter', () => {
    it('should allow requests within limit', () => {
      const result = apiRateLimiter.check('test-ip-1')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(99)
    })

    it('should track request count', () => {
      apiRateLimiter.check('test-ip-2')
      apiRateLimiter.check('test-ip-2')
      const result = apiRateLimiter.check('test-ip-2')
      
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(97)
    })

    it('should block requests exceeding limit', () => {
      const identifier = 'test-ip-3'
      
      // Make 100 requests (the limit)
      for (let i = 0; i < 100; i++) {
        apiRateLimiter.check(identifier)
      }
      
      // 101st request should be blocked
      const result = apiRateLimiter.check(identifier)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })
  })

  describe('authRateLimiter', () => {
    it('should have stricter limits for auth endpoints', () => {
      const identifier = 'test-ip-4'
      
      // Make 5 requests (the limit for auth)
      for (let i = 0; i < 5; i++) {
        authRateLimiter.check(identifier)
      }
      
      // 6th request should be blocked
      const result = authRateLimiter.check(identifier)
      expect(result.allowed).toBe(false)
    })
  })

  describe('getClientIdentifier', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost:3000', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      })
      
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('192.168.1.1')
    })

    it('should extract IP from x-real-ip header', () => {
      const request = new Request('http://localhost:3000', {
        headers: {
          'x-real-ip': '192.168.1.2',
        },
      })
      
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('192.168.1.2')
    })

    it('should extract IP from cf-connecting-ip header', () => {
      const request = new Request('http://localhost:3000', {
        headers: {
          'cf-connecting-ip': '192.168.1.3',
        },
      })
      
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('192.168.1.3')
    })

    it('should return unknown if no IP headers found', () => {
      const request = new Request('http://localhost:3000')
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('unknown')
    })
  })
})

