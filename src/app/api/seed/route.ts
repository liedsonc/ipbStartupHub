import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { Role, IdeaCategory, IdeaStage } from '@prisma/client'
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

    const passwordHash = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@startuphub.edu' },
      update: {},
      create: {
        email: 'admin@startuphub.edu',
        passwordHash,
        name: 'Admin User',
        role: Role.Admin,
        affiliation: 'Startup Hub',
        emailVerified: true,
        profileComplete: true
      }
    })

    console.log('Created admin user:', admin.email)

    const testUser = await prisma.user.upsert({
      where: { email: 'test@startuphub.edu' },
      update: {},
      create: {
        email: 'test@startuphub.edu',
        passwordHash: await bcrypt.hash('test123', 10),
        name: 'Test User',
        role: Role.Student,
        affiliation: 'Departamento de Ciência da Computação',
        emailVerified: true,
        profileComplete: true
      }
    })

    console.log('Created test user:', testUser.email)

    const existingIdeas = await prisma.idea.count()
    
    if (existingIdeas === 0) {
      const idea1 = await prisma.idea.create({
        data: {
          title: 'Navegação no Campus com IA para Estudantes com Deficiência Visual',
          description: 'Um aplicativo móvel que usa visão computacional e IA para ajudar estudantes com deficiência visual a navegar pelo campus de forma independente. O app fornece direções de áudio em tempo real, identifica obstáculos e reconhece pontos de referência usando câmeras de smartphones e modelos de machine learning treinados com dados específicos do campus.',
          shortDescription: 'App móvel usando IA e visão computacional para ajudar estudantes com deficiência visual a navegar pelo campus de forma independente.',
          category: IdeaCategory.Tech,
          stage: IdeaStage.Prototype,
          contactEmail: 'sarah.chen@universidade.edu',
          status: 'published',
          userId: testUser.id,
          tags: {
            create: [
              { tag: 'acessibilidade' },
              { tag: 'IA' },
              { tag: 'mobile' },
              { tag: 'visão-computacional' }
            ]
          }
        }
      })

      console.log('Created idea:', idea1.title)

      const idea2 = await prisma.idea.create({
        data: {
          title: 'Plataforma de Redução de Desperdício de Alimentos Sustentável',
          description: 'Uma plataforma conectando refeitórios universitários com bancos de alimentos locais e instalações de compostagem. Usa sensores IoT para rastrear desperdício de alimentos, análise preditiva para otimizar pedidos e um app móvel para estudantes reivindicarem refeições excedentes. Inclui gamificação para incentivar hábitos alimentares sustentáveis.',
          shortDescription: 'Plataforma conectando refeitórios com bancos de alimentos usando sensores IoT e análise preditiva para reduzir desperdício.',
          category: IdeaCategory.Sustainability,
          stage: IdeaStage.EarlyDevelopment,
          contactEmail: 'marcus.rodriguez@universidade.edu',
          status: 'published',
          userId: testUser.id,
          tags: {
            create: [
              { tag: 'sustentabilidade' },
              { tag: 'desperdício-alimentar' },
              { tag: 'IoT' },
              { tag: 'impacto-social' }
            ]
          }
        }
      })

      console.log('Created idea:', idea2.title)
    }

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

