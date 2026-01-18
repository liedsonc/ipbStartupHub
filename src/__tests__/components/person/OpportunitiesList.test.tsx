import { render, screen } from '@/__tests__/utils/test-utils'
import { OpportunitiesList } from '@/components/person/OpportunitiesList'
import { OpportunityType } from '@/types'

describe('OpportunitiesList', () => {
  it('returns null when no opportunities', () => {
    const { container } = render(<OpportunitiesList />)
    expect(container.firstChild).toBeNull()
  })

  it('renders offering opportunities', () => {
    render(
      <OpportunitiesList
        offering={[OpportunityType.Developer, OpportunityType.Designer]}
      />
    )
    expect(screen.getByText(/oferece/i)).toBeInTheDocument()
    expect(screen.getByText(/desenvolvedor/i)).toBeInTheDocument()
    expect(screen.getByText(/designer/i)).toBeInTheDocument()
  })

  it('renders seeking opportunities', () => {
    render(
      <OpportunitiesList
        seeking={[OpportunityType.Investor, OpportunityType.Mentor]}
      />
    )
    expect(screen.getByText(/busca/i)).toBeInTheDocument()
    expect(screen.getByText(/investidor/i)).toBeInTheDocument()
    expect(screen.getByText(/mentor/i)).toBeInTheDocument()
  })

  it('renders both offering and seeking', () => {
    render(
      <OpportunitiesList
        offering={[OpportunityType.Developer]}
        seeking={[OpportunityType.Investor]}
      />
    )
    expect(screen.getByText(/oferece/i)).toBeInTheDocument()
    expect(screen.getByText(/busca/i)).toBeInTheDocument()
  })
})

