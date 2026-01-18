import { GET, PATCH, DELETE } from '@/app/api/notifications/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    interestSignal: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))

import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>

describe('GET /api/notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetSession.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
    } as any)
  })

  it('returns notifications for authenticated user', async () => {
    const mockNotifications = [
      {
        id: 'notif-1',
        userId: 'user-1',
        type: 'collaboration',
        entityType: 'interest_signal',
        entityId: 'interest-1',
        message: 'Test message',
        read: false,
        createdAt: new Date(),
      },
    ]

    mockPrisma.notification.findMany.mockResolvedValue(mockNotifications as any)
    mockPrisma.interestSignal.findUnique.mockResolvedValue({
      id: 'interest-1',
      user: {
        id: 'user-2',
        name: 'Requester',
        role: 'Student',
        avatarUrl: null,
        email: 'requester@example.com',
      },
      idea: {
        id: 'idea-1',
        title: 'Test Idea',
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/notifications')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/notifications')
    const response = await GET(request)

    expect(response.status).toBe(401)
  })
})

describe('PATCH /api/notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetSession.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
    } as any)
  })

  it('marks notification as read', async () => {
    mockPrisma.notification.findUnique.mockResolvedValue({
      id: 'notif-1',
      userId: 'user-1',
      read: false,
    } as any)

    mockPrisma.notification.update.mockResolvedValue({
      id: 'notif-1',
      read: true,
    } as any)

    const request = new NextRequest('http://localhost:3000/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id: 'notif-1', read: true }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.read).toBe(true)
  })

  it('returns 403 when user does not own notification', async () => {
    mockPrisma.notification.findUnique.mockResolvedValue({
      id: 'notif-1',
      userId: 'user-2',
      read: false,
    } as any)

    const request = new NextRequest('http://localhost:3000/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id: 'notif-1', read: true }),
    })

    const response = await PATCH(request)
    expect(response.status).toBe(403)
  })
})

describe('DELETE /api/notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetSession.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Student',
        emailVerified: true,
      },
    } as any)
  })

  it('deletes notification', async () => {
    mockPrisma.notification.findUnique.mockResolvedValue({
      id: 'notif-1',
      userId: 'user-1',
    } as any)

    const request = new NextRequest('http://localhost:3000/api/notifications?id=notif-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockPrisma.notification.delete).toHaveBeenCalled()
  })

  it('returns 403 when user does not own notification', async () => {
    mockPrisma.notification.findUnique.mockResolvedValue({
      id: 'notif-1',
      userId: 'user-2',
    } as any)

    const request = new NextRequest('http://localhost:3000/api/notifications?id=notif-1', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    expect(response.status).toBe(403)
  })
})

