import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const { prisma } = await import('@/lib/db/prisma')
        const bcrypt = await import('bcryptjs')

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
            emailVerified: true,
            deletedAt: true
          }
        })

        if (!user || user.deletedAt) {
          return null
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)

        if (!isValid) {
          return null
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
})

if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  console.warn(
    'NEXTAUTH_SECRET or AUTH_SECRET environment variable is missing. ' +
    'Authentication might not work correctly in production.'
  )
}
