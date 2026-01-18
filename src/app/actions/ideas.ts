'use server'

import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { RBAC } from '@/lib/auth/rbac'
import { IdeaCategory, IdeaStage, IdeaStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createIdeaAction(data: {
  title: string
  description: string
  shortDescription?: string
  category: IdeaCategory
  stage: IdeaStage
  contactEmail?: string
  tags?: string[]
  openOpportunities?: any
}) {
  const session = await getSession()

  if (!session?.user) {
    return { error: 'Não autorizado' }
  }

  if (!RBAC.can(session.user.role, 'ideas:create')) {
    return { error: 'Sem permissão para criar ideias' }
  }

  try {
    const idea = await prisma.idea.create({
      data: {
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription || null,
        category: data.category,
        stage: data.stage,
        contactEmail: data.contactEmail || null,
        status: IdeaStatus.published,
        userId: session.user.id,
        tags: {
          create: (data.tags || []).map((tag: string) => ({ tag }))
        },
        openOpportunities: data.openOpportunities || null
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

    revalidatePath('/browse')
    revalidatePath('/')

    return {
      success: true,
      idea: {
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
      }
    }
  } catch (error) {
    console.error('Error creating idea:', error)
    return { error: 'Erro ao criar ideia' }
  }
}

export async function updateIdeaAction(
  ideaId: string,
  data: {
    title: string
    description: string
    shortDescription?: string
    category: IdeaCategory
    stage: IdeaStage
    contactEmail?: string
    tags?: string[]
  }
) {
  const session = await getSession()

  if (!session?.user) {
    return { error: 'Não autorizado' }
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId }
  })

  if (!idea) {
    return { error: 'Ideia não encontrada' }
  }

  const canUpdate = idea.userId === session.user.id || 
                   RBAC.can(session.user.role, 'ideas:moderate')

  if (!canUpdate) {
    return { error: 'Sem permissão para atualizar esta ideia' }
  }

  try {
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription || null,
        category: data.category,
        stage: data.stage,
        contactEmail: data.contactEmail || null,
        tags: {
          deleteMany: {},
          create: (data.tags || []).map((tag: string) => ({ tag }))
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

    revalidatePath('/browse')
    revalidatePath('/')
    revalidatePath(`/idea/${ideaId}`)

    return {
      success: true,
      idea: {
        id: updatedIdea.id,
        title: updatedIdea.title,
        description: updatedIdea.description,
        shortDescription: updatedIdea.shortDescription,
        category: updatedIdea.category,
        stage: updatedIdea.stage,
        contactEmail: updatedIdea.contactEmail,
        publishedAt: updatedIdea.createdAt.toISOString(),
        authorName: updatedIdea.user.name,
        authorRole: updatedIdea.user.role,
        tags: updatedIdea.tags.map(tag => tag.tag),
        interestCount: 0,
        interestedPersonIds: []
      }
    }
  } catch (error) {
    console.error('Error updating idea:', error)
    return { error: 'Erro ao atualizar ideia' }
  }
}

export async function deleteIdeaAction(ideaId: string) {
  const session = await getSession()

  if (!session?.user) {
    return { error: 'Não autorizado' }
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId }
  })

  if (!idea) {
    return { error: 'Ideia não encontrada' }
  }

  const canDelete = idea.userId === session.user.id || 
                   RBAC.can(session.user.role, 'ideas:delete')

  if (!canDelete) {
    return { error: 'Sem permissão para deletar esta ideia' }
  }

  try {
    await prisma.idea.update({
      where: { id: ideaId },
      data: { deletedAt: new Date() }
    })

    revalidatePath('/browse')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error deleting idea:', error)
    return { error: 'Erro ao deletar ideia' }
  }
}

