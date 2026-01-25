import { addInterestAction } from '@/app/actions/interests'
import { InterestType } from '@/types'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    interestSignal: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    idea: {
      findUnique: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  },
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>

describe('addInterestAction', () => {
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

  it('creates interest signal successfully', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-2',
      title: 'Test Idea',
    } as any)

    mockPrisma.interestSignal.findFirst.mockResolvedValue(null)
    mockPrisma.interestSignal.create.mockResolvedValue({
      id: 'interest-1',
      ideaId: 'idea-1',
      userId: 'user-1',
      interestType: InterestType.Explore,
    } as any)

    const result = await addInterestAction('idea-1', InterestType.Explore)

    expect(result.success).toBe(true)
    expect(mockPrisma.interestSignal.create).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalled()
  })

  it('creates notification for collaboration interest', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-2',
      title: 'Test Idea',
    } as any)

    mockPrisma.interestSignal.findFirst.mockResolvedValue(null)
    mockPrisma.interestSignal.create.mockResolvedValue({
      id: 'interest-1',
      ideaId: 'idea-1',
      userId: 'user-1',
      interestType: InterestType.Collaborate,
    } as any)

    await addInterestAction('idea-1', InterestType.Collaborate)

    expect(mockPrisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-2',
          type: 'collaboration',
        }),
      })
    )
  })

  it('returns error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)

    const result = await addInterestAction('idea-1', InterestType.Explore)

    expect(result.error).toBe('Não autorizado')
  })

  it('returns error when idea not found', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue(null)

    const result = await addInterestAction('idea-1', InterestType.Explore)

    expect(result.error).toBe('Ideia não encontrada')
  })
})
