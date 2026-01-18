import { render, screen } from '@/__tests__/utils/test-utils'
import { Header } from '@/components/layout/Header'

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
  }),
  signOut: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/lib/hooks/useInbox', () => ({
  useInbox: () => ({
    unreadCount: 0,
  }),
}))

describe('Header', () => {
  it('renders logo', () => {
    render(<Header />)
    expect(screen.getByText('Startup Hub')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText(/explorar ideias/i)).toBeInTheDocument()
    expect(screen.getByText(/pessoas/i)).toBeInTheDocument()
    expect(screen.getByText(/sobre/i)).toBeInTheDocument()
  })

  it('renders login buttons when not authenticated', () => {
    render(<Header />)
    expect(screen.getByText(/entrar/i)).toBeInTheDocument()
    expect(screen.getByText(/criar conta/i)).toBeInTheDocument()
  })

  it('renders user menu when authenticated', () => {
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
      signOut: jest.fn(),
    }))

    render(<Header />)
    expect(screen.getByText(/enviar ideia/i)).toBeInTheDocument()
  })
})

