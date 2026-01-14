import { ProductGrid } from '@/components/ProductGrid'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'

// Enable ISR (Incremental Static Regeneration) with edge caching
export const revalidate = 60
export const dynamic = 'force-static'

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Hero />
      <Features />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Products
        </h2>
        <ProductGrid />
      </section>

      {/* Enterprise Section */}
      <section className="bg-neutral-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Enterprise-Grade Platform
          </h2>
          <p className="text-lg text-neutral-400 mb-10">
            Deployed with production-ready CI/CD, monitoring, and security
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-xl">
              <h3 className="font-semibold text-xl mb-2">
                CI/CD Pipeline
              </h3>
              <p className="text-neutral-400">
                Automated testing and deployment
              </p>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-xl">
              <h3 className="font-semibold text-xl mb-2">
                Performance Monitoring
              </h3>
              <p className="text-neutral-400">
                Real-time analytics and optimization
              </p>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-xl">
              <h3 className="font-semibold text-xl mb-2">
                Security & Compliance
              </h3>
              <p className="text-neutral-400">
                Enterprise-grade security headers
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
