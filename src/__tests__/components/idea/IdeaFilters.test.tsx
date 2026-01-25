import { render, screen } from '@/__tests__/utils/test-utils'
import { IdeaFilters } from '@/components/idea/IdeaFilters'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => null),
    toString: jest.fn(() => ''),
  }),
}))

describe('IdeaFilters', () => {
  it('renders search bar', () => {
    render(<IdeaFilters />)
    expect(screen.getByPlaceholderText(/buscar ideias/i)).toBeInTheDocument()
  })

  it('renders category and stage selects', () => {
    render(<IdeaFilters />)
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/estágio/i)).toBeInTheDocument()
  })

  it('renders clear filters button when filters are active', () => {
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: jest.fn(),
      }),
      useSearchParams: () => ({
        get: jest.fn((key) => key === 'category' ? 'Tech' : null),
        toString: jest.fn(() => 'category=Tech'),
      }),
    }))

    render(<IdeaFilters />)
    expect(screen.getByText(/limpar filtros/i)).toBeInTheDocument()
  })
})
