// Authentication utilities for enterprise platform
import { getClientIdentifier } from './rateLimit'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'guest'
}

const SESSION_COOKIE_NAME = 'auth_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Re-export for convenience
export { getClientIdentifier }

// Mock user database - in production, use real database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
  },
]

// Simple session storage - in production, use Redis or database
const sessions = new Map<string, { user: User; expiresAt: number }>()

// Helper function to parse cookies from request headers (edge runtime compatible)
function getCookieFromRequest(
  request: { headers: { get: (name: string) => string | null } } | null | undefined,
  name: string
): string | null {
  if (!request) return null
  
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) {
    return null
  }
  
  // Parse cookies - handle multiple cookies separated by semicolon
  const cookies = cookieHeader.split(';').map(c => c.trim())
  for (const cookie of cookies) {
    const equalIndex = cookie.indexOf('=')
    if (equalIndex === -1) continue
    
    const key = cookie.substring(0, equalIndex).trim()
    const value = cookie.substring(equalIndex + 1).trim()
    
    if (key === name) {
      // Decode URI component if needed
      try {
        return decodeURIComponent(value)
      } catch {
        return value
      }
    }
  }
  return null
}

// Helper function to create Set-Cookie header value
function createCookieHeader(name: string, value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Path=/${secure}`
}

export async function login(
  email: string,
  password: string,
  _request?: { headers: { get: (name: string) => string | null } }
): Promise<{ success: boolean; user?: User; error?: string; cookieHeader?: string }> {
  // Mock authentication - in production, verify password hash
  const user = mockUsers.find(u => u.email === email)
  
  if (!user) {
    return Promise.resolve({ success: false, error: 'Invalid credentials' })
  }

  // Mock password check - in production, use bcrypt
  if (password !== 'password123') {
    return Promise.resolve({ success: false, error: 'Invalid credentials' })
  }

  // Create session
  const sessionId = crypto.randomUUID()
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000
  
  sessions.set(sessionId, { user, expiresAt })

  // Create cookie header for edge runtime
  const cookieHeader = createCookieHeader(SESSION_COOKIE_NAME, sessionId, SESSION_MAX_AGE)

  return Promise.resolve({ success: true, user, cookieHeader })
}

export async function logout(request?: { headers: { get: (name: string) => string | null } }): Promise<{ cookieHeader: string }> {
  const sessionId = request ? getCookieFromRequest(request, SESSION_COOKIE_NAME) : null

  if (sessionId) {
    sessions.delete(sessionId)
  }

  // Create delete cookie header
  const cookieHeader = `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/`

  return Promise.resolve({ cookieHeader })
}

export async function getCurrentUser(request: { headers: { get: (name: string) => string | null } }): Promise<User | null> {
  if (!request) return Promise.resolve(null)
  const sessionId = getCookieFromRequest(request, SESSION_COOKIE_NAME)

  if (!sessionId) {
    return Promise.resolve(null)
  }

  const session = sessions.get(sessionId)
  
  if (!session) {
    return Promise.resolve(null)
  }

  // Check if session expired
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId)
    return Promise.resolve(null)
  }

  return Promise.resolve(session.user)
}

export function requireAuth(user: User | null): asserts user is User {
  if (!user) {
    throw new Error('Authentication required')
  }
}

export function requireRole(user: User | null, role: User['role']): asserts user is User {
  requireAuth(user)
  if (user.role !== role && user.role !== 'admin') {
    throw new Error(`Role ${role} required`)
  }
}

// Cleanup expired sessions periodically
setInterval(() => {
  const now = Date.now()
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(sessionId)
    }
  }
}, 60 * 60 * 1000) // Run every hour

