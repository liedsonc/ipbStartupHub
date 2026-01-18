import { render, screen } from '@/__tests__/utils/test-utils'
import { Input } from '@/components/ui/Input'
import userEvent from '@testing-library/user-event'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('applies error styles when error is provided', () => {
    render(<Input error="Error message" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('displays error message', () => {
    render(<Input error="Error message" />)
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole('textbox') as HTMLInputElement

    await user.type(input, 'test value')
    expect(input.value).toBe('test value')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('passes through input props', () => {
    render(<Input type="email" placeholder="Enter email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'Enter email')
  })
})

