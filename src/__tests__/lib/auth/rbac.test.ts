import { RBAC } from '@/lib/auth/rbac'
import { Role } from '@prisma/client'

describe('RBAC', () => {
  describe('can', () => {
    it('allows Admin to perform all actions', () => {
      expect(RBAC.can(Role.Admin, 'ideas:create')).toBe(true)
      expect(RBAC.can(Role.Admin, 'ideas:moderate')).toBe(true)
      expect(RBAC.can(Role.Admin, 'users:manage')).toBe(true)
    })

    it('allows Student to create ideas', () => {
      expect(RBAC.can(Role.Student, 'ideas:create')).toBe(true)
    })

    it('denies Student from moderating ideas', () => {
      expect(RBAC.can(Role.Student, 'ideas:moderate')).toBe(false)
    })

    it('denies Student from managing users', () => {
      expect(RBAC.can(Role.Student, 'users:manage')).toBe(false)
    })

    it('allows Professor to create and moderate ideas', () => {
      expect(RBAC.can(Role.Professor, 'ideas:create')).toBe(true)
      expect(RBAC.can(Role.Professor, 'ideas:moderate')).toBe(true)
    })

    it('denies Professor from managing users', () => {
      expect(RBAC.can(Role.Professor, 'users:manage')).toBe(false)
    })

    it('handles invalid permissions gracefully', () => {
      expect(RBAC.can(Role.Student, 'invalid:permission' as any)).toBe(false)
    })
  })
})
