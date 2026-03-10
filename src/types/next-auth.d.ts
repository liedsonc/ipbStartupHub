import { Role } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      image?: string | null
      emailVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: Role
    image?: string | null
    emailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    emailVerified: boolean
  }
}
