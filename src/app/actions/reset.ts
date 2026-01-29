'use server'

import { prisma } from '@/lib/db/prisma'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'
import bcrypt from 'bcryptjs'

export async function resetPasswordRequest(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (!existingUser) {
    return { error: 'Email não encontrado' }
  }

  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

  return { success: 'Email de recuperação enviado!' }
}

export async function newPassword(password: string, token: string | null) {
  if (!token) {
    return { error: 'Token faltando' }
  }

  if (password.length < 6) {
    return { error: 'A senha deve ter pelo menos 6 caracteres' }
  }

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  })

  if (!existingToken) {
    return { error: 'Token inválido' }
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

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { passwordHash }
  })

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id }
  })

  return { success: 'Senha atualizada com sucesso!' }
}
