import { GET } from '@/app/api/users/[id]/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))

import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetSession.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
    } as any)
  })

  it('returns user data', async () => {
    const mockUser = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'Student',
      affiliation: 'Test Affiliation',
      bio: 'Test Bio',
      avatarUrl: null,
      createdAt: new Date(),
      profile: null,
      passwordHash: 'hashed',
      deletedAt: null,
    }

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)

    const request = new NextRequest('http://localhost:3000/api/users/user-1')
    const response = await GET(request, { params: { id: 'user-1' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.name).toBe('Test User')
    expect(data.passwordHash).toBeUndefined()
    expect(data.deletedAt).toBeUndefined()
  })

  it('returns 404 when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/users/user-999')
    const response = await GET(request, { params: { id: 'user-999' } })

    expect(response.status).toBe(404)
  })

  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/users/user-1')
    const response = await GET(request, { params: { id: 'user-1' } })

    expect(response.status).toBe(401)
  })
})

