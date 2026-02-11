'use server'

import { prisma } from '@/lib/db/prisma'

export async function verifyEmail(token: string) {
  const existingToken = await prisma.verificationToken.findUnique({
    where: { token }
  })

  if (!existingToken) {
    return { error: 'Token não encontrado' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token expirado' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email }
  })

  if (!existingUser) {
    return { error: 'Email não encontrado' }
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email // In case they changed email, but usually it's the same
    }
  })

  await prisma.verificationToken.delete({
    where: { id: existingToken.id }
  })

  return { success: 'Email verificado com sucesso!' }
}
