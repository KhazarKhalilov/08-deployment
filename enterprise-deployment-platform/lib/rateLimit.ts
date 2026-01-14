// In-memory rate limiting for production use
// For enterprise scale, consider Redis-based rate limiting

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const key in this.store) {
      const record = this.store[key]
      if (record && record.resetTime < now) {
        delete this.store[key]
      }
    }
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const record = this.store[identifier]

    if (!record || record.resetTime < now) {
      // New window or expired
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs,
      }
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      }
    }

    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      }
    }

    record.count++
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      resetTime: record.resetTime,
    }
  }
}

// Create rate limiter instances
export const apiRateLimiter = new RateLimiter(100, 60000) // 100 requests per minute
export const authRateLimiter = new RateLimiter(5, 60000) // 5 requests per minute for auth
export const generalRateLimiter = new RateLimiter(200, 60000) // 200 requests per minute for general

export function getClientIdentifier(request: { headers: { get: (name: string) => string | null } }): string {
  // Try to get IP from various headers (for proxy/load balancer scenarios)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0]?.trim() || realIp || cfConnectingIp || 'unknown'
  return ip
}

