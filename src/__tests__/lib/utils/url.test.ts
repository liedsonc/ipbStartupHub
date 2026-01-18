import { getAbsoluteUrl } from '@/lib/utils/url'

describe('getAbsoluteUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns absolute URL with VERCEL_URL', () => {
    process.env.VERCEL_URL = 'example.vercel.app'
    const url = getAbsoluteUrl('/api/test')
    expect(url).toBe('https://example.vercel.app/api/test')
  })

  it('returns absolute URL with NEXTAUTH_URL', () => {
    process.env.NEXTAUTH_URL = 'https://example.com'
    delete process.env.VERCEL_URL
    const url = getAbsoluteUrl('/api/test')
    expect(url).toBe('https://example.com/api/test')
  })

  it('returns localhost URL when no env vars are set', () => {
    delete process.env.VERCEL_URL
    delete process.env.NEXTAUTH_URL
    const url = getAbsoluteUrl('/api/test')
    expect(url).toBe('http://localhost:3000/api/test')
  })

  it('handles URLs that are already absolute', () => {
    process.env.VERCEL_URL = 'example.vercel.app'
    const url = getAbsoluteUrl('https://example.com/api/test')
    expect(url).toBe('https://example.com/api/test')
  })
})

