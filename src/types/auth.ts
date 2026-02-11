import { Role } from '@prisma/client'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  emailVerified: Date | null
}

export interface Session {
  user: SessionUser
  expires: string
}
