// Enterprise monitoring and alerting utilities

interface Metric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string> | undefined
}

class MetricsCollector {
  private metrics: Metric[] = []
  private readonly maxMetrics = 1000

  record(metric: Metric): void {
    this.metrics.push({
      ...metric,
      timestamp: Date.now(),
    })

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  getMetrics(name?: string): Metric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name)
    }
    return [...this.metrics]
  }

  clear(): void {
    this.metrics = []
  }
}

export const metricsCollector = new MetricsCollector()

// Performance monitoring
export function trackPerformance(name: string, duration: number, tags?: Record<string, string>): void {
  const metric: Metric = {
    name: `performance.${name}`,
    value: duration,
    timestamp: Date.now(),
  }
  if (tags !== undefined) {
    metric.tags = tags
  }
  metricsCollector.record(metric)

  // Log slow operations
  if (duration > 1000) {
    console.warn(`Slow operation detected: ${name} took ${duration}ms`, tags || {})
  }
}

// Error tracking
export function trackError(error: Error, context?: Record<string, unknown>): void {
  const tags: Record<string, string> = {
    errorType: error.name,
    errorMessage: error.message.substring(0, 100),
  }
  
  if (context) {
    Object.entries(context).forEach(([key, value]) => {
      tags[key] = String(value)
    })
  }
  
  const metric: Metric = {
    name: 'error.count',
    value: 1,
    timestamp: Date.now(),
    tags,
  }
  metricsCollector.record(metric)
}

// API request tracking
export function trackApiRequest(
  endpoint: string,
  statusCode: number,
  duration: number
): void {
  const metric: Metric = {
    name: 'api.request',
    value: duration,
    timestamp: Date.now(),
    tags: {
      endpoint,
      statusCode: statusCode.toString(),
      status: statusCode >= 400 ? 'error' : 'success',
    },
  }
  metricsCollector.record(metric)
}

// Business metrics
export function trackBusinessMetric(name: string, value: number, tags?: Record<string, string>): void {
  const metric: Metric = {
    name: `business.${name}`,
    value,
    timestamp: Date.now(),
  }
  if (tags !== undefined) {
    metric.tags = tags
  }
  metricsCollector.record(metric)
}

