import { NextResponse } from 'next/server'

// Edge runtime for better performance
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  // Edge runtime-də process.uptime() mövcud deyil, ona görə də sadə health check
  const response = NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  })

  // Cache health checks for 10 seconds at edge
  response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')
  
  return response
}

