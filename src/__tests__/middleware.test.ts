import { middleware } from '@/middleware'
import { NextRequest, NextResponse } from 'next/server'

jest.mock('@/lib/auth/config', () => ({
  auth: jest.fn(),
}))

import { auth } from '@/lib/auth/config'

const mockAuth = auth as jest.MockedFunction<typeof auth>

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('allows access to auth routes', async () => {
    mockAuth.mockResolvedValue(null as any)

    const request = new NextRequest('http://localhost:3000/api/auth/session')
    const response = await middleware(request)

    expect(response).toBeInstanceOf(NextResponse)
  })

  it('redirects authenticated users from login page', async () => {
    mockAuth.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/login')
    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/')
  })

  it('redirects unauthenticated users from protected pages', async () => {
    mockAuth.mockResolvedValue(null as any)

    const request = new NextRequest('http://localhost:3000/submit')
    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('allows admin access to admin routes', async () => {
    mockAuth.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'Admin',
        emailVerified: true,
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/admin')
    const response = await middleware(request)

    expect(response).toBeInstanceOf(NextResponse)
  })

  it('blocks non-admin users from admin routes', async () => {
    mockAuth.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/admin')
    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/')
  })

  it('blocks unauthenticated POST requests to protected APIs', async () => {
    mockAuth.mockResolvedValue(null as any)

    const request = new NextRequest('http://localhost:3000/api/ideas', {
      method: 'POST',
    })
    const response = await middleware(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Não autorizado')
  })
})
