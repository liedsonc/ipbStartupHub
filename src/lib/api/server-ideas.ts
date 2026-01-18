import { Idea, IdeaFilters, IdeaWithInterests, IdeaCategory, IdeaStage } from '@/types'
import { prisma } from '@/lib/db/prisma'
import { IdeaStatus } from '@prisma/client'

export async function fetchIdeasServer(filters?: IdeaFilters): Promise<Idea[]> {
  const where: any = {
    status: IdeaStatus.published,
    deletedAt: null
  }

  if (filters?.category) {
    where.category = filters.category as IdeaCategory
  }

  if (filters?.stage) {
    where.stage = filters.stage as IdeaStage
  }

  if (filters?.searchQuery) {
    where.OR = [
      { title: { contains: filters.searchQuery, mode: 'insensitive' } },
      { description: { contains: filters.searchQuery, mode: 'insensitive' } }
    ]
  }

  const orderBy = filters?.sortBy === 'mostInterest' 
    ? [{ interestSignals: { _count: 'desc' as const } }]
    : [{ createdAt: 'desc' as const }]

  const ideas = await prisma.idea.findMany({
    where,
    orderBy,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          avatarUrl: true
        }
      },
      tags: true,
      _count: {
        select: {
          interestSignals: true
        }
      }
    }
  })

  return ideas.map(idea => ({
    id: idea.id,
    title: idea.title,
    description: idea.description,
    shortDescription: idea.shortDescription || '',
    category: String(idea.category) as IdeaCategory,
    stage: String(idea.stage) as IdeaStage,
    contactEmail: idea.contactEmail || '',
    publishedAt: idea.createdAt.toISOString(),
    authorName: idea.user.name,
    authorRole: String(idea.user.role),
    tags: idea.tags.map(tag => tag.tag),
    interestCount: idea._count.interestSignals,
    interestedPersonIds: [],
    openOpportunities: idea.openOpportunities as any
  })) as Idea[]
}

export async function fetchIdeaByIdServer(id: string): Promise<Idea | null> {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          avatarUrl: true
        }
      },
      tags: true,
      _count: {
        select: {
          interestSignals: true
        }
      }
    }
  })

  if (!idea || idea.deletedAt) {
    return null
  }

  return {
    id: idea.id,
    title: idea.title,
    description: idea.description,
    shortDescription: idea.shortDescription || '',
    category: String(idea.category) as IdeaCategory,
    stage: String(idea.stage) as IdeaStage,
    contactEmail: idea.contactEmail || '',
    publishedAt: idea.createdAt.toISOString(),
    authorName: idea.user.name,
    authorRole: String(idea.user.role),
    tags: idea.tags.map(tag => tag.tag),
    interestCount: idea._count.interestSignals,
    interestedPersonIds: [],
    openOpportunities: idea.openOpportunities as any
  } as Idea
}

export async function fetchIdeaWithInterestsServer(id: string): Promise<(IdeaWithInterests & { authorId: string }) | null> {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          avatarUrl: true
        }
      },
      tags: true,
      interestSignals: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              avatarUrl: true
            }
          }
        }
      },
      _count: {
        select: {
          interestSignals: true
        }
      }
    }
  })

  if (!idea || idea.deletedAt) {
    return null
  }

  return {
    id: idea.id,
    title: idea.title,
    description: idea.description,
    shortDescription: idea.shortDescription || '',
    category: String(idea.category) as IdeaCategory,
    stage: String(idea.stage) as IdeaStage,
    contactEmail: idea.contactEmail || '',
    publishedAt: idea.createdAt.toISOString(),
    authorName: idea.user.name,
    authorRole: String(idea.user.role),
    authorId: idea.user.id,
    tags: idea.tags.map(tag => tag.tag),
    interestCount: idea._count.interestSignals,
    interestedPersonIds: idea.interestSignals.map(signal => signal.userId),
    interestedPeople: idea.interestSignals.map(signal => ({
      id: signal.user.id,
      name: signal.user.name,
      role: String(signal.user.role) as any,
      affiliation: '',
      email: '',
      interests: [],
      interestType: String(signal.interestType) as any,
      interestTypeForIdea: String(signal.interestType) as any,
      avatarUrl: signal.user.avatarUrl
    })),
    openOpportunities: idea.openOpportunities as any
  } as IdeaWithInterests & { authorId: string }
}
