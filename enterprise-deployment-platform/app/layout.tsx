import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Enterprise E-commerce Platform',
  description: 'Production-grade enterprise e-commerce platform with advanced deployment',
  keywords: ['e-commerce', 'enterprise', 'deployment', 'production'],
  authors: [{ name: 'Enterprise Platform Team' }],
  openGraph: {
    title: 'Enterprise E-commerce Platform',
    description: 'Production-grade enterprise e-commerce platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
          <Analytics />
          <SpeedInsights />
        </ErrorBoundary>
      </body>
    </html>
  )
}

