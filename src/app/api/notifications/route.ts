import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

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
    const read = searchParams.get('read')

    const where: any = {
      userId: session.user.id
    }

    if (read !== null) {
      where.read = read === 'true'
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const collaborationNotifications = notifications.filter(
      n => n.type === 'collaboration' || n.type === 'funding'
    )

    const formattedNotifications = await Promise.all(
      collaborationNotifications.map(async (notification) => {
        let interestSignal = null
        let idea = null

        if (notification.entityType === 'interest_signal' && notification.entityId) {
          interestSignal = await prisma.interestSignal.findUnique({
            where: { id: notification.entityId },
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
            }
          })

          if (interestSignal) {
            idea = interestSignal.idea
          }
        }

        return {
          id: notification.id,
          type: notification.type,
          entityType: notification.entityType,
          entityId: notification.entityId,
          message: notification.message,
          read: notification.read,
          createdAt: notification.createdAt.toISOString(),
          ideaId: idea?.id || null,
          ideaTitle: idea?.title || null,
          requesterId: interestSignal?.user?.id || null,
          requesterName: interestSignal?.user?.name || null,
          requesterRole: interestSignal?.user?.role || null,
          requesterAvatarUrl: interestSignal?.user?.avatarUrl || null,
          interestMessage: interestSignal?.message || null
        }
      })
    )

    return NextResponse.json(formattedNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar notificações' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { prisma } = await import('@/lib/db/prisma')
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, read } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID da notificação é obrigatório' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      )
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para atualizar esta notificação' },
        { status: 403 }
      )
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        read: read !== undefined ? read : notification.read
      }
    })

    return NextResponse.json({
      id: updated.id,
      read: updated.read
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar notificação' },
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da notificação é obrigatório' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      )
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar esta notificação' },
        { status: 403 }
      )
    }

    await prisma.notification.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar notificação' },
      { status: 500 }
    )
  }
}

