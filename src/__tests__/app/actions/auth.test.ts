import { registerAction } from '@/app/actions/auth'

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

describe('registerAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockBcrypt.hash.mockResolvedValue('hashed_password' as any)
  })

  it('creates a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Student' as const,
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

    const result = await registerAction(userData)

    expect(result.success).toBe(true)
    expect(mockPrisma.user.create).toHaveBeenCalled()
    expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10)
  })

  it('returns error when email already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    } as any)

    const result = await registerAction({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Student',
    })

    expect(result.error).toBe('Email já está em uso')
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it('validates password length', async () => {
    const result = await registerAction({
      name: 'Test User',
      email: 'test@example.com',
      password: '123',
      role: 'Student',
    })

    expect(result.error).toBe('Senha deve ter pelo menos 6 caracteres')
  })
})
