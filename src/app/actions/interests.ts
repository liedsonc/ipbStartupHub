'use server'

import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { RBAC } from '@/lib/auth/rbac'
import { InterestType, InterestStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createInterestAction(
  ideaId: string,
  interestType: InterestType,
  message?: string
) {
  const session = await getSession()

  if (!session?.user) {
    return { error: 'Não autorizado' }
  }

  if (!RBAC.can(session.user.role, 'interests:create')) {
    return { error: 'Sem permissão para expressar interesse' }
  }

  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    })

    if (!idea || idea.deletedAt) {
      return { error: 'Ideia não encontrada' }
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
      return { error: 'Você já expressou interesse nesta ideia' }
    }

    const interestSignal = await prisma.interestSignal.create({
      data: {
        ideaId,
        userId: session.user.id,
        interestType,
        message: message || null,
        status: InterestStatus.active
      }
    })

    if (interestType === InterestType.Collaborate) {
      await prisma.notification.create({
        data: {
          userId: idea.userId,
          type: 'collaboration',
          entityType: 'interest_signal',
          entityId: interestSignal.id,
          message: `${session.user.name} quer colaborar na sua ideia "${idea.title}"`
        }
      })
    }

    revalidatePath(`/idea/${ideaId}`)
    revalidatePath('/browse')

    return {
      success: true,
      interest: {
        id: interestSignal.id,
        ideaId: interestSignal.ideaId,
        personId: interestSignal.userId,
        interestType: interestSignal.interestType,
        message: interestSignal.message,
        createdAt: interestSignal.createdAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Error creating interest:', error)
    return { error: 'Erro ao expressar interesse' }
  }
}

export async function deleteInterestAction(ideaId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { error: 'Não autorizado' }
  }

  try {
    const interest = await prisma.interestSignal.findUnique({
      where: {
        ideaId_userId: {
          ideaId,
          userId: session.user.id
        }
      }
    })

    if (!interest) {
      return { error: 'Interesse não encontrado' }
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

    revalidatePath(`/idea/${ideaId}`)
    revalidatePath('/browse')

    return { success: true }
  } catch (error) {
    console.error('Error deleting interest:', error)
    return { error: 'Erro ao remover interesse' }
  }
}

