import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { RBAC } from '@/lib/auth/rbac'

export const dynamic = 'force-dynamic'

export async function GET(
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

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        profile: true
      }
    })

    if (!user || user.deletedAt) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const { passwordHash, deletedAt, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
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

    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user || user.deletedAt) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const canDelete = session.user.id === params.id || 
                     RBAC.can(session.user.role, 'users:delete')

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Sem permissão para apagar esta conta' },
        { status: 403 }
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.idea.updateMany({
        where: { userId: params.id },
        data: { deletedAt: new Date() }
      })

      await tx.user.update({
        where: { id: params.id },
        data: { deletedAt: new Date() }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Erro ao apagar conta' },
      { status: 500 }
    )
  }
}

