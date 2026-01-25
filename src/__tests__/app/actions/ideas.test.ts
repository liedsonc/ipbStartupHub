import { createIdeaAction, updateIdeaAction } from '@/app/actions/ideas'
import { IdeaCategory, IdeaStage } from '@/types'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    idea: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>

describe('createIdeaAction', () => {
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

  it('creates an idea successfully', async () => {
    const ideaData = {
      title: 'Test Idea',
      description: 'Test Description',
      shortDescription: 'Short',
      category: IdeaCategory.Tech,
      stage: IdeaStage.Idea,
      contactEmail: 'test@example.com',
      tags: ['tag1'],
    }

    mockPrisma.idea.create.mockResolvedValue({
      id: 'idea-1',
      ...ideaData,
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Test User',
        role: 'Student',
      },
      tags: [{ tag: 'tag1' }],
    } as any)

    const result = await createIdeaAction(ideaData)

    expect(result.success).toBe(true)
    expect(mockPrisma.idea.create).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalled()
  })

  it('returns error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)

    const result = await createIdeaAction({
      title: 'Test',
      description: 'Test',
      category: IdeaCategory.Tech,
      stage: IdeaStage.Idea,
    })

    expect(result.error).toBe('Não autorizado')
  })
})

describe('updateIdeaAction', () => {
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

  it('updates an idea successfully', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-1',
      title: 'Old Title',
    } as any)

    mockPrisma.idea.update.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-1',
      title: 'New Title',
      description: 'New Description',
      shortDescription: null,
      category: IdeaCategory.Tech,
      stage: IdeaStage.Idea,
      contactEmail: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Test User',
        role: 'Student',
      },
      tags: [],
    } as any)

    const result = await updateIdeaAction('idea-1', {
      title: 'New Title',
      description: 'New Description',
      category: IdeaCategory.Tech,
      stage: IdeaStage.Idea,
    })

    expect(result.success).toBe(true)
    expect(mockPrisma.idea.update).toHaveBeenCalled()
  })

  it('returns error when user is not the owner', async () => {
    mockPrisma.idea.findUnique.mockResolvedValue({
      id: 'idea-1',
      userId: 'user-2',
    } as any)

    const result = await updateIdeaAction('idea-1', {
      title: 'New Title',
      description: 'New Description',
      category: IdeaCategory.Tech,
      stage: IdeaStage.Idea,
    })

    expect(result.error).toBe('Sem permissão para atualizar esta ideia')
  })
})

