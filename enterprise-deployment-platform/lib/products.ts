// Product management utilities

export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  inStock: boolean
  sku: string
}

// Mock product data - in production, this would come from a database
const products: Product[] = [
  {
    id: 1,
    name: 'Enterprise Laptop Pro',
    price: 1299.99,
    description: 'High-performance laptop for enterprise use',
    image: '/images/img1.webp',
    category: 'Electronics',
    stock: 15,
    inStock: true,
    sku: 'LAP-001',
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    price: 199.99,
    description: 'Premium noise-cancelling headphones',
    image: '/images/img2.jpg',
    category: 'Electronics',
    stock: 42,
    inStock: true,
    sku: 'AUD-002',
  },
  {
    id: 3,
    name: 'Smart Watch',
    price: 349.99,
    description: 'Advanced fitness and health tracking',
    image: '/images/img3.webp',
    category: 'Electronics',
    stock: 0,
    inStock: false,
    sku: 'WAT-003',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 149.99,
    description: 'Professional mechanical keyboard',
    image: '/images/img4.webp',
    category: 'Accessories',
    stock: 28,
    inStock: true,
    sku: 'KEY-004',
  },
  {
    id: 5,
    name: '4K Monitor',
    price: 599.99,
    description: 'Ultra HD display for professionals',
    image: '/images/img5.png',
    category: 'Electronics',
    stock: 12,
    inStock: true,
    sku: 'MON-005',
  },
  {
    id: 6,
    name: 'USB-C Hub',
    price: 79.99,
    description: 'Multi-port connectivity hub',
    image: '/images/img6.jpg',
    category: 'Accessories',
    stock: 35,
    inStock: true,
    sku: 'HUB-006',
  },
]

// Stock management functions
export function updateStock(productId: number, quantity: number): boolean {
  const product = products.find(p => p.id === productId)
  if (!product) return false
  
  const newStock = product.stock - quantity
  if (newStock < 0) return false
  
  product.stock = newStock
  product.inStock = newStock > 0
  return true
}

export function getProductStock(productId: number): number {
  const product = products.find(p => p.id === productId)
  return product?.stock ?? 0
}

export function getAllProducts(): Product[] {
  return products
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getProductsInStock(): Product[] {
  return products.filter(p => p.inStock)
}

