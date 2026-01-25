import { Role } from '@prisma/client'
import { Permission, getRolePermissions } from './roles'

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}
