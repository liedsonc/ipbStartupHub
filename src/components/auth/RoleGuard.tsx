'use client'

import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Role } from '@prisma/client'
import { RBAC } from '@/lib/auth/rbac'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: Role[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return <>{fallback}</>
  }

  const userRole = session.user.role as Role

  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface PermissionGuardProps {
  children: ReactNode
  permission: string
  fallback?: ReactNode
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return <>{fallback}</>
  }

  const userRole = session.user.role as Role

  if (!RBAC.can(userRole, permission as any)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

