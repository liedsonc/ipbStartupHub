import { render, screen } from '@/__tests__/utils/test-utils'
import { AuthGuard } from '@/components/auth/AuthGuard'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  redirect: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
    },
    status: 'authenticated',
  }),
}))

describe('AuthGuard', () => {
  it('renders children when user is authenticated', () => {
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
