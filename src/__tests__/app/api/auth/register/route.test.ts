import { POST } from '@/app/api/auth/register/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}))

import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockBcrypt.hash.mockResolvedValue('hashed_password' as any)
  })

  it('creates a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Student',
      affiliation: 'Test Affiliation',
    }

    mockPrisma.user.create.mockResolvedValue({
      id: 'user-1',
      ...userData,
      passwordHash: 'hashed_password',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      lastLoginAt: null,
      avatarUrl: null,
      bio: null,
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.passwordHash).toBeUndefined()
  })

  it('returns 400 when email already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    } as any)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Student',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email já está em uso')
  })

  it('validates password length', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        role: 'Student',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('senha')
  })
})
