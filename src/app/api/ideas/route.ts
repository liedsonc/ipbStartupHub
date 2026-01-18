import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { RBAC } from '@/lib/auth/rbac'
import { IdeaCategory, IdeaStage, IdeaStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const stage = searchParams.get('stage')
    const searchQuery = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'newest'

    const where: any = {
      status: IdeaStatus.published,
      deletedAt: null
    }

    if (category) {
      where.category = category as IdeaCategory
    }

    if (stage) {
      where.stage = stage as IdeaStage
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }

    const orderBy = sortBy === 'mostInterest' 
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

    const formattedIdeas = ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      shortDescription: idea.shortDescription,
      category: idea.category,
      stage: idea.stage,
      contactEmail: idea.contactEmail,
      publishedAt: idea.createdAt.toISOString(),
      authorName: idea.user.name,
      authorRole: idea.user.role,
      tags: idea.tags.map(tag => tag.tag),
      interestCount: idea._count.interestSignals,
      openOpportunities: idea.openOpportunities
    }))

    return NextResponse.json(formattedIdeas)
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ideias' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    if (!RBAC.can(session.user.role, 'ideas:create')) {
      return NextResponse.json(
        { error: 'Sem permissão para criar ideias' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, shortDescription, category, stage, contactEmail, tags, openOpportunities } = body

    if (!title || !description || !category || !stage) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        shortDescription: shortDescription || null,
        category: category as IdeaCategory,
        stage: stage as IdeaStage,
        contactEmail: contactEmail || null,
        status: IdeaStatus.published,
        userId: session.user.id,
        tags: {
          create: (tags || []).map((tag: string) => ({ tag }))
        },
        openOpportunities: openOpportunities || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        tags: true
      }
    })

    return NextResponse.json({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      shortDescription: idea.shortDescription,
      category: idea.category,
      stage: idea.stage,
      contactEmail: idea.contactEmail,
      publishedAt: idea.createdAt.toISOString(),
      authorName: idea.user.name,
      authorRole: idea.user.role,
      tags: idea.tags.map(tag => tag.tag),
      interestCount: 0,
      interestedPersonIds: []
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { error: 'Erro ao criar ideia' },
      { status: 500 }
    )
  }
}

