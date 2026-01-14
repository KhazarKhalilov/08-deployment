import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/ProductCard'

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  description: 'Test description',
  image: '/images/test.jpg',
  category: 'Electronics',
  inStock: true,
}

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('should show "In Stock" badge when product is in stock', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('In Stock')).toBeInTheDocument()
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  it('should show "Out of Stock" badge when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(<ProductCard product={outOfStockProduct} />)
    
    // Check badge (span element)
    const badge = screen.getByText('Out of Stock', { selector: 'span' })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    
    // Check button is disabled
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Out of Stock')
  })

  it('should disable button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(<ProductCard product={outOfStockProduct} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:opacity-50')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Out of Stock')
  })
})

