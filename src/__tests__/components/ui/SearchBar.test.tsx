import { render, screen } from '@/__tests__/utils/test-utils'
import { SearchBar } from '@/components/ui/SearchBar'
import userEvent from '@testing-library/user-event'

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar />)
    const input = screen.getByRole('searchbox')
    expect(input).toBeInTheDocument()
  })

  it('calls onSearch when typing', async () => {
    const onSearch = jest.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByRole('searchbox')
    await user.type(input, 'test query')

    expect(onSearch).toHaveBeenCalledWith('test query')
  })

  it('applies placeholder text', () => {
    render(<SearchBar placeholder="Search ideas..." />)
    const input = screen.getByPlaceholderText('Search ideas...')
    expect(input).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<SearchBar className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
