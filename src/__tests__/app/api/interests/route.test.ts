import { POST } from '@/app/api/interests/route'
import { NextRequest } from 'next/server'

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

jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))

import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'
import { InterestType } from '@/types'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>

describe('POST /api/interests', () => {
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

    const request = new NextRequest('http://localhost:3000/api/interests', {
      method: 'POST',
      body: JSON.stringify({
        ideaId: 'idea-1',
        interestType: InterestType.Explore,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
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

    const request = new NextRequest('http://localhost:3000/api/interests', {
      method: 'POST',
      body: JSON.stringify({
        ideaId: 'idea-1',
        interestType: InterestType.Collaborate,
      }),
    })

    await POST(request)

    expect(mockPrisma.notification.create).toHaveBeenCalled()
  })

  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/interests', {
      method: 'POST',
      body: JSON.stringify({
        ideaId: 'idea-1',
        interestType: InterestType.Explore,
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('returns 404 when idea not found', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/interests', {
      method: 'POST',
      body: JSON.stringify({
        ideaId: 'idea-1',
        interestType: InterestType.Explore,
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(404)
  })
})
