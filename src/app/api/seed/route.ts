import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (authHeader !== `Bearer ${process.env.SEED_SECRET || 'seed-secret-change-in-production'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting database seed...')

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@startuphub.edu'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminName = process.env.ADMIN_NAME || 'Admin User'
    const adminAffiliation = process.env.ADMIN_AFFILIATION || 'Startup Hub'

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD environment variable is required' },
        { status: 400 }
      )
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

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully' 
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

