import { GET, POST } from '@/app/api/ideas/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    idea: {
      findMany: jest.fn(),
      create: jest.fn(),
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

describe('GET /api/ideas', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns list of ideas', async () => {
    const mockIdeas = [
      {
        id: 'idea-1',
        title: 'Test Idea',
        description: 'Description',
        shortDescription: 'Short',
        category: 'Tech',
        stage: 'Idea',
        contactEmail: 'test@example.com',
        createdAt: new Date(),
        user: {
          name: 'Test User',
          role: 'Student',
        },
        tags: [],
        _count: {
          interestSignals: 0,
        },
        interestSignals: [],
        openOpportunities: [],
      },
    ]

    mockPrisma.idea.findMany.mockResolvedValue(mockIdeas as any)

    const request = new NextRequest('http://localhost:3000/api/ideas')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].title).toBe('Test Idea')
  })

  it('filters by category', async () => {
    mockPrisma.idea.findMany.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/ideas?category=Tech')
    await GET(request)

    expect(mockPrisma.idea.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: 'Tech',
        }),
      })
    )
  })
})

describe('POST /api/ideas', () => {
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

  it('creates a new idea', async () => {
    const ideaData = {
      title: 'New Idea',
      description: 'Description',
      shortDescription: 'Short',
      category: 'Tech',
      stage: 'Idea',
      contactEmail: 'test@example.com',
      tags: ['tag1'],
    }

    mockPrisma.idea.create.mockResolvedValue({
      id: 'idea-1',
      ...ideaData,
      userId: 'user-1',
      createdAt: new Date(),
    } as any)

    const request = new NextRequest('http://localhost:3000/api/ideas', {
      method: 'POST',
      body: JSON.stringify(ideaData),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.title).toBe('New Idea')
  })

  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/ideas', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })
})

