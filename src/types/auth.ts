import { Role } from '@prisma/client'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  emailVerified: boolean
}

export interface Session {
  user: SessionUser
  expires: string
}
