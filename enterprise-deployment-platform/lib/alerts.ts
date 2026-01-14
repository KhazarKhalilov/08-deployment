// Alerting system for production monitoring
// Edge runtime compatible - Sentry is optional and only used in Node.js runtime
type SentryType = {
  captureMessage: (message: string, options?: {
    level?: 'error' | 'warning' | 'info'
    tags?: Record<string, string>
    extra?: Record<string, unknown>
  }) => void
}

let Sentry: SentryType | null = null

// Only try to load Sentry in Node.js runtime (not edge)
// Use a function to check runtime environment
function initializeSentry(): SentryType | null {
  // Skip in edge runtime or browser
  if (typeof process === 'undefined' || typeof window !== 'undefined') {
    return null
  }
  
  try {
    // Dynamic require to avoid edge runtime issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const sentryModule = require('@sentry/nextjs') as SentryType | null
    if (sentryModule && typeof sentryModule.captureMessage === 'function') {
      return sentryModule
    }
  } catch {
    // Sentry not available or edge runtime - continue without it
  }
  
  return null
}

// Initialize Sentry only in Node.js runtime
Sentry = initializeSentry()

export interface AlertConfig {
  level: 'info' | 'warning' | 'error' | 'critical'
  message: string
  tags?: Record<string, string> | undefined
  context?: Record<string, unknown> | undefined
}

class AlertManager {
  private alertThresholds = {
    error: 10, // Alert after 10 errors
    warning: 50, // Alert after 50 warnings
  }

  private errorCounts: Map<string, number> = new Map()

  sendAlert(config: AlertConfig): void {
    const { level, message, tags, context } = config

    // Track error counts
    if (level === 'error' || level === 'critical') {
      const key = tags?.endpoint || 'unknown'
      const count = (this.errorCounts.get(key) || 0) + 1
      this.errorCounts.set(key, count)

      // Send alert if threshold exceeded
      if (count >= this.alertThresholds.error && Sentry) {
        const sentryOptions: {
          level: 'error'
          tags?: Record<string, string>
          extra?: Record<string, unknown>
        } = {
          level: 'error',
        }
        
        if (tags) {
          sentryOptions.tags = {
            ...tags,
            alertType: 'threshold_exceeded',
            errorCount: count.toString(),
          }
        }
        
        if (context) {
          sentryOptions.extra = {
            ...context,
            threshold: this.alertThresholds.error,
          }
        }
        
        Sentry.captureMessage(`Alert: ${message}`, sentryOptions)
      }
    }

    // Always capture critical alerts
    if (level === 'critical' && Sentry) {
      const sentryOptions: {
        level: 'error'
        tags?: Record<string, string>
        extra?: Record<string, unknown>
      } = {
        level: 'error',
      }
      
      if (tags) {
        sentryOptions.tags = {
          ...tags,
          alertType: 'critical',
        }
      }
      
      if (context) {
        sentryOptions.extra = context
      }
      
      Sentry.captureMessage(`Critical: ${message}`, sentryOptions)
    }

    // Capture warnings for monitoring
    if (level === 'warning' && Sentry) {
      const sentryOptions: {
        level: 'warning'
        tags?: Record<string, string>
        extra?: Record<string, unknown>
      } = {
        level: 'warning',
      }
      
      if (tags) {
        sentryOptions.tags = tags
      }
      
      if (context) {
        sentryOptions.extra = context
      }
      
      Sentry.captureMessage(`Warning: ${message}`, sentryOptions)
    }
  }

  resetCounts(): void {
    this.errorCounts.clear()
  }
}

export const alertManager = new AlertManager()

// Convenience functions
export function alertError(message: string, tags?: Record<string, string>, context?: Record<string, unknown>): void {
  alertManager.sendAlert({
    level: 'error',
    message,
    tags,
    context,
  })
}

export function alertWarning(message: string, tags?: Record<string, string>, context?: Record<string, unknown>): void {
  alertManager.sendAlert({
    level: 'warning',
    message,
    tags,
    context,
  })
}

export function alertCritical(message: string, tags?: Record<string, string>, context?: Record<string, unknown>): void {
  alertManager.sendAlert({
    level: 'critical',
    message,
    tags,
    context,
  })
}

// Reset counts periodically (every hour)
setInterval(() => {
  alertManager.resetCounts()
}, 60 * 60 * 1000)

