import { Role } from '@prisma/client'
import { Permission } from './roles'
import { hasPermission, hasAnyPermission, hasAllPermissions } from './permissions'

export class RBAC {
  static can(role: Role, permission: Permission): boolean {
    return hasPermission(role, permission)
  }

  static canAny(role: Role, permissions: Permission[]): boolean {
    return hasAnyPermission(role, permissions)
  }

  static canAll(role: Role, permissions: Permission[]): boolean {
    return hasAllPermissions(role, permissions)
  }

  static isAdmin(role: Role): boolean {
    return role === Role.Admin
  }

  static canModerate(role: Role): boolean {
    return this.can(role, 'ideas:moderate') || this.isAdmin(role)
  }

  static canManageUsers(role: Role): boolean {
    return this.can(role, 'users:manage') || this.isAdmin(role)
  }
}

