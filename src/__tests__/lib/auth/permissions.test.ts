import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/auth/permissions'
import { Role } from '@prisma/client'

describe('Permission helpers', () => {
  describe('hasPermission', () => {
    it('returns true for valid permission', () => {
      expect(hasPermission(Role.Admin, 'ideas:create')).toBe(true)
    })

    it('returns false for invalid permission', () => {
      expect(hasPermission(Role.Student, 'users:manage')).toBe(false)
    })
  })

  describe('hasAnyPermission', () => {
    it('returns true if user has any of the permissions', () => {
      expect(hasAnyPermission(Role.Professor, ['ideas:create', 'users:manage'])).toBe(true)
    })

    it('returns false if user has none of the permissions', () => {
      expect(hasAnyPermission(Role.Student, ['users:manage', 'ideas:moderate'])).toBe(false)
    })
  })

  describe('hasAllPermissions', () => {
    it('returns true if user has all permissions', () => {
      expect(hasAllPermissions(Role.Admin, ['ideas:create', 'ideas:moderate'])).toBe(true)
    })

    it('returns false if user is missing any permission', () => {
      expect(hasAllPermissions(Role.Student, ['ideas:create', 'users:manage'])).toBe(false)
    })
  })
})

