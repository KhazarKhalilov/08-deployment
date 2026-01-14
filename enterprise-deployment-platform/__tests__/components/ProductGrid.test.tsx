import { render, screen, waitFor } from '@testing-library/react'
import { ProductGrid } from '@/components/ProductGrid'

// Mock fetch
global.fetch = jest.fn()

describe('ProductGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    )

    render(<ProductGrid />)
    expect(screen.getAllByRole('generic').some(el => el.className.includes('skeleton'))).toBeTruthy()
  })

  it('should display products after loading', async () => {
    const mockProducts = {
      products: [
        {
          id: 1,
          name: 'Test Product',
          price: 99.99,
          description: 'Test',
          image: '/test.jpg',
          category: 'Electronics',
          inStock: true,
        },
      ],
      total: 1,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    })

    render(<ProductGrid />)

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })

  it('should display error message on fetch failure', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<ProductGrid />)

    await waitFor(() => {
      expect(screen.getByText(/Error loading products/i)).toBeInTheDocument()
    })
  })

  it('should call products API endpoint', async () => {
    const mockProducts = {
      products: [],
      total: 0,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    })

    render(<ProductGrid />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/products')
    })
  })
})

