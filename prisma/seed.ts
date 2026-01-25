import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
  console.log('Seeding database...')

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@startuphub.edu'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminName = process.env.ADMIN_NAME || 'Admin User'
  const adminAffiliation = process.env.ADMIN_AFFILIATION || 'Startup Hub'

  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD environment variable is required')
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: Role.Admin,
      affiliation: adminAffiliation,
      emailVerified: true,
      profileComplete: true
    }
  })

  console.log('Created admin user:', admin.email)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

