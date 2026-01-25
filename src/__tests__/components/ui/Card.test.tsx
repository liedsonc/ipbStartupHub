import { render, screen } from '@/__tests__/utils/test-utils'
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies base styles', () => {
    render(<Card>Content</Card>)
    const card = screen.getByText('Content').parentElement
    expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')
  })

  it('handles onClick when provided', async () => {
    const handleClick = jest.fn()
    const { container } = render(<Card onClick={handleClick}>Clickable</Card>)
    const card = container.firstChild as HTMLElement
    
    card.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies interactive styles when onClick is provided', () => {
    const { container } = render(<Card onClick={() => {}}>Clickable</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('cursor-pointer')
  })
})

describe('CardBody', () => {
  it('renders children', () => {
    render(<CardBody>Body content</CardBody>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('applies padding classes', () => {
    const { container } = render(<CardBody>Content</CardBody>)
    const body = container.firstChild as HTMLElement
    expect(body).toHaveClass('px-6', 'py-4')
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('applies border classes', () => {
    const { container } = render(<CardHeader>Header</CardHeader>)
    const header = container.firstChild as HTMLElement
    expect(header).toHaveClass('border-b')
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('applies background and border classes', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>)
    const footer = container.firstChild as HTMLElement
    expect(footer).toHaveClass('bg-gray-50', 'border-t')
  })
})
