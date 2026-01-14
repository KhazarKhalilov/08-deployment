import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateStock, getProductStock } from '@/lib/products'
import { apiRateLimiter, getClientIdentifier } from '@/lib/rateLimit'
import { alertError, alertCritical } from '@/lib/alerts'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface PaymentRequest {
  productId: number
  quantity: number
  paymentMethod: {
    type: 'card' | 'paypal'
    last4?: string
    cardholderName?: string
  }
  amount: number
}

// Mock payment processing - in production, integrate with Stripe, PayPal, etc.
async function processPayment(
  amount: number,
  _paymentMethod: PaymentRequest['paymentMethod']
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock validation
  if (amount <= 0) {
    return { success: false, error: 'Invalid amount' }
  }

  // Mock payment gateway response
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  // In production, this would call actual payment gateway
  // For demo purposes, we'll simulate success
  // Note: paymentMethod parameter is kept for future implementation
  return { success: true, transactionId }
}

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
        },
      }
    )
  }

  // Authentication check
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json() as PaymentRequest
    const { productId, quantity, paymentMethod, amount } = body

    // Validation
    if (!productId || !quantity || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      )
    }

    // Check stock availability
    const currentStock = getProductStock(productId)
    if (currentStock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock', availableStock: currentStock },
        { status: 400 }
      )
    }

    // Process payment
    const paymentResult = await processPayment(amount, paymentMethod)

    if (!paymentResult.success) {
      // Alert on failed payment
      alertError('Payment processing failed', {
        endpoint: '/api/payments/process',
        userId: user.id,
        productId: productId.toString(),
      }, {
        amount,
        error: paymentResult.error,
      })

      return NextResponse.json(
        { error: paymentResult.error || 'Payment processing failed' },
        { status: 400 }
      )
    }

    // Update stock
    const stockUpdated = updateStock(productId, quantity)

    if (!stockUpdated) {
      // Critical alert - payment succeeded but stock update failed
      alertCritical('Stock update failed after payment', {
        endpoint: '/api/payments/process',
        userId: user.id,
        productId: productId.toString(),
        transactionId: paymentResult.transactionId || 'unknown',
      }, {
        amount,
        quantity,
      })

      return NextResponse.json(
        { error: 'Stock update failed' },
        { status: 500 }
      )
    }

    // Log successful transaction (using alert system instead of Sentry in edge runtime)
    alertError('Payment processed successfully', {
      endpoint: '/api/payments/process',
      userId: user.id,
      productId: productId.toString(),
      transactionId: paymentResult.transactionId || 'unknown',
    }, {
      amount,
      quantity,
    })

    const response = NextResponse.json({
      success: true,
      transactionId: paymentResult.transactionId,
      productId,
      quantity,
      amount,
      remainingStock: getProductStock(productId),
    })

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
    // No cache for payment transactions
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')

    return response
  } catch (error) {
    // Log error using alert system (edge runtime compatible)
    alertCritical('Payment processing error', {
      endpoint: '/api/payments/process',
      userId: user.id,
    }, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

