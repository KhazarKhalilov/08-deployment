/**
 * @jest-environment node
 */
import { GET } from '@/app/api/health/route'

describe('/api/health', () => {
  it('should return healthy status', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('version')
  })

  it('should return valid timestamp', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.timestamp).toBeDefined()
    expect(new Date(data.timestamp).getTime()).not.toBeNaN()
  })

  it('should return environment information', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.environment).toBeDefined()
    expect(['development', 'production', 'test']).toContain(data.environment)
  })
})

