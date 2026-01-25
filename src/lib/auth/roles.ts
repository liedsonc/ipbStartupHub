import { Role } from '@prisma/client'

export { Role }

export type Permission =
  | 'ideas:create'
  | 'ideas:read'
  | 'ideas:update'
  | 'ideas:delete'
  | 'ideas:moderate'
  | 'interests:create'
  | 'interests:read'
  | 'interests:delete'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'users:manage'
  | 'admin:access'
  | 'admin:manage_users'
  | 'admin:moderate_content'

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.Student]: [
    'ideas:create',
    'ideas:read',
    'ideas:update',
    'interests:create',
    'interests:read',
    'interests:delete',
    'users:read'
  ],
  [Role.Alumni]: [
    'ideas:create',
    'ideas:read',
    'ideas:update',
    'interests:create',
    'interests:read',
    'interests:delete',
    'users:read'
  ],
  [Role.Professor]: [
    'ideas:create',
    'ideas:read',
    'ideas:update',
    'ideas:moderate',
    'interests:create',
    'interests:read',
    'interests:delete',
    'users:read'
  ],
  [Role.Mentor]: [
    'ideas:create',
    'ideas:read',
    'ideas:update',
    'interests:create',
    'interests:read',
    'interests:delete',
    'users:read'
  ],
  [Role.Investor]: [
    'ideas:create',
    'ideas:read',
    'ideas:update',
    'interests:create',
    'interests:read',
    'interests:delete',
    'users:read'
  ],
  [Role.External]: [
    'ideas:read',
    'interests:create',
    'interests:read',
    'users:read'
  ],
  [Role.Admin]: [
    'ideas:create',
    'ideas:read',
    'ideas:update',
    'ideas:delete',
    'ideas:moderate',
    'interests:create',
    'interests:read',
    'interests:delete',
    'users:read',
    'users:update',
    'users:delete',
    'users:manage',
    'admin:access',
    'admin:manage_users',
    'admin:moderate_content'
  ]
}

export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] || []
}

