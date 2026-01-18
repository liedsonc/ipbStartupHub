import { getRolePermissions, Role } from '@/lib/auth/roles'
import { Permission } from '@/lib/auth/permissions'

describe('getRolePermissions', () => {
  it('returns correct permissions for Admin', () => {
    const permissions = getRolePermissions(Role.Admin)
    expect(permissions).toContain('ideas:create')
    expect(permissions).toContain('ideas:moderate')
    expect(permissions).toContain('users:manage')
  })

  it('returns correct permissions for Student', () => {
    const permissions = getRolePermissions(Role.Student)
    expect(permissions).toContain('ideas:create')
    expect(permissions).not.toContain('ideas:moderate')
    expect(permissions).not.toContain('users:manage')
  })

  it('returns correct permissions for Professor', () => {
    const permissions = getRolePermissions(Role.Professor)
    expect(permissions).toContain('ideas:create')
    expect(permissions).toContain('ideas:moderate')
    expect(permissions).not.toContain('users:manage')
  })

  it('returns permissions for all roles', () => {
    const roles = Object.values(Role)
    roles.forEach(role => {
      const permissions = getRolePermissions(role)
      expect(Array.isArray(permissions)).toBe(true)
      expect(permissions.length).toBeGreaterThan(0)
    })
  })
})

