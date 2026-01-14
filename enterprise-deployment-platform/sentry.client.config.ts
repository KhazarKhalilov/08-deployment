import * as Sentry from '@sentry/nextjs'

const sentryOptions: Sentry.BrowserOptions = {
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  sentryOptions.dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
}

if (process.env.NODE_ENV) {
  sentryOptions.environment = process.env.NODE_ENV as 'development' | 'production' | 'test'
}

Sentry.init(sentryOptions)

