import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const accelerateUrl = process.env.PRISMA_DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Please check your .env file.')
}

const clientOptions: any = {
  log: ['info', 'warn', 'error'],
}

if (accelerateUrl) {
  clientOptions.accelerateUrl = accelerateUrl
}

const prisma = new PrismaClient(clientOptions)

async function main() {
  console.log('Deleting test users and all associated ideas...')

  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: 'test',
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: 'test',
            mode: 'insensitive'
          }
        }
      ],
      deletedAt: null,
      role: {
        not: 'Admin'
      }
    }
  })

  if (testUsers.length === 0) {
    console.log('No test users found in database')
    return
  }

  console.log(`Found ${testUsers.length} test user(s):`)
  testUsers.forEach(user => {
    console.log(`  - ${user.email} (${user.name})`)
  })

  let totalIdeas = 0
  for (const testUser of testUsers) {
    const ideaCount = await prisma.idea.count({
      where: {
        userId: testUser.id,
        deletedAt: null
      }
    })
    totalIdeas += ideaCount
    console.log(`  ${testUser.name}: ${ideaCount} ideas`)
  }

  console.log(`Total: ${totalIdeas} ideas to delete`)

  for (const testUser of testUsers) {
    await prisma.$transaction(async (tx) => {
      await tx.idea.updateMany({
        where: { userId: testUser.id },
        data: { deletedAt: new Date() }
      })

      await tx.user.update({
        where: { id: testUser.id },
        data: { deletedAt: new Date() }
      })
    })
  }

  console.log('Successfully deleted all test users and their associated ideas')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
