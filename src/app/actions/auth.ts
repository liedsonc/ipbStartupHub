'use server'

import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export async function loginAction(email: string, password: string) {
  return { error: 'Use the LoginForm component instead' }
}

export async function logoutAction() {
  return { error: 'Use signOut from next-auth/react instead' }
}

export async function registerAction(data: {
  name: string
  email: string
  password: string
  role: Role
  affiliation?: string
}) {
  try {
    if (!data.name || !data.email || !data.password || !data.role) {
      return { error: 'Campos obrigatórios faltando' }
    }

    if (data.password.length < 6) {
      return { error: 'Senha deve ter pelo menos 6 caracteres' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { error: 'Email já está em uso' }
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        affiliation: data.affiliation || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Erro ao criar conta' }
  }
}

