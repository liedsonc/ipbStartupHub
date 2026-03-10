'use server'

import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(data: {
  name?: string
  affiliation?: string
  bio?: string
  avatarUrl?: string
}) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return { error: 'Não autorizado' }
    }

    const userId = session.user.id

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        affiliation: data.affiliation,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      }
    })

    revalidatePath('/profile')
    revalidatePath('/people')

    return { success: true }
  } catch (error) {
    console.error('Update profile error:', error)
    return { error: 'Erro ao atualizar perfil' }
  }
}
