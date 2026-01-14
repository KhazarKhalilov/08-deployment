'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from './ProductCard'

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  inStock: boolean
}

export function ProductGrid(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts(): Promise<void> {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json() as { products: Product[] }
        setProducts(data.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-96 bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading products: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

