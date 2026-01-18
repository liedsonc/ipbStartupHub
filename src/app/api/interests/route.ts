import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { RBAC } from '@/lib/auth/rbac'
import { InterestType, InterestStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

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

    if (!RBAC.can(session.user.role, 'interests:create')) {
      return NextResponse.json(
        { error: 'Sem permissão para expressar interesse' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { ideaId, interestType, message } = body

    if (!ideaId || !interestType) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    })

    if (!idea || idea.deletedAt) {
      return NextResponse.json(
        { error: 'Ideia não encontrada' },
        { status: 404 }
      )
    }

    const existingInterest = await prisma.interestSignal.findUnique({
      where: {
        ideaId_userId: {
          ideaId,
          userId: session.user.id
        }
      }
    })

    if (existingInterest) {
      return NextResponse.json(
        { error: 'Você já expressou interesse nesta ideia' },
        { status: 400 }
      )
    }

    const interestSignal = await prisma.interestSignal.create({
      data: {
        ideaId,
        userId: session.user.id,
        interestType: interestType as InterestType,
        message: message || null,
        status: InterestStatus.active
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    if ((interestType === InterestType.Collaborate || interestType === InterestType.Fund) && idea.userId !== session.user.id) {
      const notificationType = interestType === InterestType.Collaborate ? 'collaboration' : 'funding'
      const actionText = interestType === InterestType.Collaborate ? 'quer colaborar' : 'quer financiar'
      
      await prisma.notification.create({
        data: {
          userId: idea.userId,
          type: notificationType,
          entityType: 'interest_signal',
          entityId: interestSignal.id,
          message: `${session.user.name} ${actionText} na sua ideia "${idea.title}"`
        }
      })
    }

    return NextResponse.json({
      id: interestSignal.id,
      ideaId: interestSignal.ideaId,
      personId: interestSignal.userId,
      interestType: interestSignal.interestType,
      message: interestSignal.message,
      createdAt: interestSignal.createdAt.toISOString()
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating interest:', error)
    return NextResponse.json(
      { error: 'Erro ao expressar interesse' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get('ideaId')
    const userId = searchParams.get('userId')

    const where: any = {
      status: InterestStatus.active
    }

    if (ideaId) {
      where.ideaId = ideaId
    }

    if (userId) {
      where.userId = userId
    }

    const interests = await prisma.interestSignal.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true
          }
        },
        idea: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(interests)
  } catch (error) {
    console.error('Error fetching interests:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar interesses' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get('ideaId')

    if (!ideaId) {
      return NextResponse.json(
        { error: 'ideaId é obrigatório' },
        { status: 400 }
      )
    }

    const interest = await prisma.interestSignal.findUnique({
      where: {
        ideaId_userId: {
          ideaId,
          userId: session.user.id
        }
      }
    })

    if (!interest) {
      return NextResponse.json(
        { error: 'Interesse não encontrado' },
        { status: 404 }
      )
    }

    await prisma.interestSignal.update({
      where: {
        ideaId_userId: {
          ideaId,
          userId: session.user.id
        }
      },
      data: {
        status: InterestStatus.withdrawn
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting interest:', error)
    return NextResponse.json(
      { error: 'Erro ao remover interesse' },
      { status: 500 }
    )
  }
}

