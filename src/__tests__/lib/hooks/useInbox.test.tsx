import { renderHook, waitFor } from '@testing-library/react'
import { useInbox, InboxProvider } from '@/lib/hooks/useInbox'
import { ReactNode } from 'react'

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
    },
  }),
}))

global.fetch = jest.fn()

describe('useInbox', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    })
  })

  it('provides inbox context', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <InboxProvider>{children}</InboxProvider>
    )

    const { result } = renderHook(() => useInbox(), { wrapper })

    expect(result.current).toHaveProperty('requests')
    expect(result.current).toHaveProperty('unreadCount')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('markAsRead')
    expect(result.current).toHaveProperty('markAllAsRead')
    expect(result.current).toHaveProperty('removeRequest')
  })

  it('fetches notifications on mount', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <InboxProvider>{children}</InboxProvider>
    )

    renderHook(() => useInbox(), { wrapper })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/notifications')
    })
  })

  it('marks notification as read', async () => {
    const mockNotifications = [
      {
        id: 'notif-1',
        read: false,
        ideaId: 'idea-1',
        ideaTitle: 'Test Idea',
        requesterId: 'user-2',
        requesterName: 'Requester',
        requesterRole: 'Student',
        createdAt: new Date().toISOString(),
        type: 'collaboration',
      },
    ]

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotifications,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'notif-1', read: true }),
      })

    const wrapper = ({ children }: { children: ReactNode }) => (
      <InboxProvider>{children}</InboxProvider>
    )

    const { result } = renderHook(() => useInbox(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.requests.length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    result.current.markAsRead('notif-1')

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'notif-1', read: true }),
      })
    })
  })
})

