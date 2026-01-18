import { Person, PersonRole } from '@/types'
import { prisma } from '@/lib/db/prisma'

export async function fetchPeopleServer(): Promise<Person[]> {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      affiliation: true,
      avatarUrl: true,
      bio: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users.map(user => ({
    id: user.id,
    name: user.name,
    role: String(user.role) as PersonRole,
    affiliation: user.affiliation || '',
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    interests: [],
    interestType: 'Explore' as any,
    opportunitiesOffering: [],
    opportunitiesSeeking: []
  })) as Person[]
}

