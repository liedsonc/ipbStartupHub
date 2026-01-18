import { getSession, getCurrentUser } from '@/lib/auth/session'

jest.mock('@/lib/auth/config', () => ({
  auth: jest.fn(),
}))

import { auth } from '@/lib/auth/config'

const mockAuth = auth as jest.MockedFunction<typeof auth>

describe('getSession', () => {
  it('returns session when authenticated', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
      expires: '2024-12-31',
    }

    mockAuth.mockResolvedValue(mockSession as any)

    const session = await getSession()
    expect(session).toEqual(mockSession)
  })

  it('returns null when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)

    const session = await getSession()
    expect(session).toBeNull()
  })
})

describe('getCurrentUser', () => {
  it('returns user from session', async () => {
    const mockSession = {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
      expires: '2024-12-31',
    }

    mockAuth.mockResolvedValue(mockSession as any)

    const user = await getCurrentUser()
    expect(user).toEqual(mockSession.user)
  })

  it('returns null when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)

    const user = await getCurrentUser()
    expect(user).toBeNull()
  })
})

