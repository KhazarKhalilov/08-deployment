import { ProductGrid } from '@/components/ProductGrid'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'

// Enable ISR (Incremental Static Regeneration) with edge caching
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamic = 'force-static' // Prefer static generation

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <ProductGrid />
      </section>
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Platform</h2>
          <p className="text-lg text-gray-600 mb-8">
            Deployed with production-ready CI/CD, monitoring, and security
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">CI/CD Pipeline</h3>
              <p className="text-gray-600">Automated testing and deployment</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">Performance Monitoring</h3>
              <p className="text-gray-600">Real-time analytics and optimization</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">Security & Compliance</h3>
              <p className="text-gray-600">Enterprise-grade security headers</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

