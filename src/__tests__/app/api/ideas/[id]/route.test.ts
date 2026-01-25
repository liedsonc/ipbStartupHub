import { GET, PUT, DELETE } from '@/app/api/ideas/[id]/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    idea: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

describe('GET /api/ideas/[id]', () => {
  it('returns idea with details', async () => {
    const mockIdea = {
      id: 'idea-1',
      title: 'Test Idea',
      description: 'Description',
      shortDescription: 'Short',
      category: 'Tech',
      stage: 'Idea',
      contactEmail: 'test@example.com',
      createdAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Test User',
        role: 'Student',
      },
      tags: [],
      interestSignals: [],
      _count: {
        interestSignals: 0,
      },
      openOpportunities: [],
    }

    mockPrisma.idea.findUnique.mockResolvedValue(mockIdea as any)

    const request = new NextRequest('http://localhost:3000/api/ideas/idea-1')
    const response = await GET(request, { params: { id: 'idea-1' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.title).toBe('Test Idea')
    expect(data.authorId).toBe('user-1')
  })

  it('returns 404 when idea not found', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/ideas/idea-999')
    const response = await GET(request, { params: { id: 'idea-999' } })

    expect(response.status).toBe(404)
  })
})

describe('PUT /api/ideas/[id]', () => {
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

  it('updates idea when user is owner', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-1',
    } as any)

    mockPrisma.idea.update.mockResolvedValue({
      id: 'idea-1',
      title: 'Updated Title',
    } as any)

    const request = new NextRequest('http://localhost:3000/api/ideas/idea-1', {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Updated Title',
        description: 'Updated Description',
        category: 'Tech',
        stage: 'Idea',
      }),
    })

    const response = await PUT(request, { params: { id: 'idea-1' } })
    expect(response.status).toBe(200)
  })

  it('returns 403 when user is not owner', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-2',
    } as any)

    const request = new NextRequest('http://localhost:3000/api/ideas/idea-1', {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Updated Title',
        description: 'Updated Description',
        category: 'Tech',
        stage: 'Idea',
      }),
    })

    const response = await PUT(request, { params: { id: 'idea-1' } })
    expect(response.status).toBe(403)
  })
})

describe('DELETE /api/ideas/[id]', () => {
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

  it('deletes idea when user is owner', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-1',
    } as any)

    const request = new NextRequest('http://localhost:3000/api/ideas/idea-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request, { params: { id: 'idea-1' } })
    expect(response.status).toBe(200)
    expect(mockPrisma.idea.delete).toHaveBeenCalled()
  })
})
