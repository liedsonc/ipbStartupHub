import { render, screen } from '@/__tests__/utils/test-utils'
import { IdeaCard } from '@/components/idea/IdeaCard'
import { mockIdea } from '@/__tests__/utils/__mocks__'

describe('IdeaCard', () => {
  it('renders idea title', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText(mockIdea.title)).toBeInTheDocument()
  })

  it('renders short description', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText(mockIdea.shortDescription)).toBeInTheDocument()
  })

  it('renders author name and role', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText(new RegExp(mockIdea.authorName))).toBeInTheDocument()
  })

  it('renders interest count', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText(/0 interessado/i)).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText(/tecnologia/i)).toBeInTheDocument()
  })

  it('renders stage badge', () => {
    render(<IdeaCard idea={mockIdea} />)
    expect(screen.getByText(/ideia/i)).toBeInTheDocument()
  })

  it('links to idea detail page', () => {
    render(<IdeaCard idea={mockIdea} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/idea/${mockIdea.id}`)
  })
})

