import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { IdeaForm } from '@/components/idea/IdeaForm'
import userEvent from '@testing-library/user-event'
import { IdeaCategory, IdeaStage } from '@/types'

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

describe('IdeaForm', () => {
  it('renders all form fields', () => {
    render(<IdeaForm />)
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição curta/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição completa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/estágio/i)).toBeInTheDocument()
  })

  it('pre-fills form when initialData is provided', () => {
    const initialData = {
      title: 'Test Idea',
      shortDescription: 'Short desc',
      description: 'Full description',
      category: IdeaCategory.Tech,
      stage: IdeaStage.Idea,
      contactEmail: 'test@example.com',
      tags: ['tag1', 'tag2'],
    }

    render(<IdeaForm ideaId="idea-1" initialData={initialData} />)
    
    expect(screen.getByDisplayValue('Test Idea')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Short desc')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Full description')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<IdeaForm />)

    const submitButton = screen.getByRole('button', { name: /enviar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument()
    })
  })

  it('handles form submission', async () => {
    const user = userEvent.setup()
    render(<IdeaForm />)

    await user.type(screen.getByLabelText(/título/i), 'New Idea')
    await user.type(screen.getByLabelText(/descrição curta/i), 'Short')
    await user.type(screen.getByLabelText(/descrição completa/i), 'Full description')
    await user.type(screen.getByLabelText(/email de contato/i), 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /enviar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
