import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const accelerateUrl = process.env.PRISMA_DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!databaseUrl && process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is not set')
  }

  const clientOptions: any = {
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  }

  if (accelerateUrl) {
    clientOptions.accelerateUrl = accelerateUrl
  }

  const client = new PrismaClient(clientOptions)

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = getPrismaClient()

