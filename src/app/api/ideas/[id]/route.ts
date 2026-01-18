import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { RBAC } from '@/lib/auth/rbac'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const idea = await prisma.idea.findUnique({
      where: { id: params.id },
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
      return NextResponse.json(
        { error: 'Ideia não encontrada' },
        { status: 404 }
      )
    }

    const formattedIdea = {
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
      authorId: idea.user.id,
      tags: idea.tags.map(tag => tag.tag),
      interestCount: idea._count.interestSignals,
      interestedPersonIds: idea.interestSignals.map(signal => signal.userId),
      interestedPeople: idea.interestSignals.map(signal => ({
        id: signal.user.id,
        name: signal.user.name,
        role: signal.user.role,
        avatarUrl: signal.user.avatarUrl,
        interestTypeForIdea: signal.interestType
      })),
      openOpportunities: idea.openOpportunities
    }

    return NextResponse.json(formattedIdea)
  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ideia' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const idea = await prisma.idea.findUnique({
      where: { id: params.id }
    })

    if (!idea) {
      return NextResponse.json(
        { error: 'Ideia não encontrada' },
        { status: 404 }
      )
    }

    const canUpdate = idea.userId === session.user.id || 
                     RBAC.can(session.user.role, 'ideas:moderate')

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Sem permissão para atualizar esta ideia' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, shortDescription, category, stage, contactEmail, tags } = body

    const updatedIdea = await prisma.idea.update({
      where: { id: params.id },
      data: {
        title,
        description,
        shortDescription,
        category,
        stage,
        contactEmail,
        tags: {
          deleteMany: {},
          create: (tags || []).map((tag: string) => ({ tag }))
        }
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

    return NextResponse.json(updatedIdea)
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar ideia' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const idea = await prisma.idea.findUnique({
      where: { id: params.id }
    })

    if (!idea) {
      return NextResponse.json(
        { error: 'Ideia não encontrada' },
        { status: 404 }
      )
    }

    const canDelete = idea.userId === session.user.id || 
                     RBAC.can(session.user.role, 'ideas:delete')

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar esta ideia' },
        { status: 403 }
      )
    }

    await prisma.idea.update({
      where: { id: params.id },
      data: { deletedAt: new Date() }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar ideia' },
      { status: 500 }
    )
  }
}

