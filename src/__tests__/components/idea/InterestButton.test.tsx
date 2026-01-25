import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { InterestButton } from '@/components/idea/InterestButton'
import { InterestType } from '@/types'
import { mockIdea } from '@/__tests__/utils/__mocks__'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
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
  }),
}))

jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}))

global.fetch = jest.fn()

describe('InterestButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders button with label', () => {
    render(
      <InterestButton
        ideaId="idea-1"
        idea={mockIdea}
        interestType={InterestType.Explore}
        label="Tenho interesse"
      />
    )
    expect(screen.getByText('Tenho interesse')).toBeInTheDocument()
  })

  it('shows confirmation modal on click', async () => {
    const user = userEvent.setup()
    render(
      <InterestButton
        ideaId="idea-1"
        idea={mockIdea}
        interestType={InterestType.Collaborate}
        label="Quero colaborar"
      />
    )

    const button = screen.getByText('Quero colaborar')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/confirmar interesse/i)).toBeInTheDocument()
    })
  })

  it('redirects to login when user is not authenticated', async () => {
    jest.mock('next-auth/react', () => ({
      useSession: () => ({ data: null }),
    }))

    const user = userEvent.setup()
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }))

    render(
      <InterestButton
        ideaId="idea-1"
        idea={mockIdea}
        interestType={InterestType.Explore}
        label="Tenho interesse"
      />
    )

    const button = screen.getByText('Tenho interesse')
    await user.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})

