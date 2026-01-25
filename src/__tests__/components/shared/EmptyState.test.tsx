import { render, screen } from '@/__tests__/utils/test-utils'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/Button'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items" />)
    expect(screen.getByText('No items')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="No items" description="Try again later" />)
    expect(screen.getByText('Try again later')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<EmptyState title="No items" />)
    expect(screen.queryByText(/try again/i)).not.toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="No items"
        action={<Button>Create Item</Button>}
      />
    )
    expect(screen.getByText('Create Item')).toBeInTheDocument()
  })

  it('does not render action when not provided', () => {
    render(<EmptyState title="No items" />)
    expect(screen.queryByText(/create/i)).not.toBeInTheDocument()
  })
})
