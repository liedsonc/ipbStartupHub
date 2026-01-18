import { render, screen } from '@/__tests__/utils/test-utils'
import { Select } from '@/components/ui/Select'
import userEvent from '@testing-library/user-event'

describe('Select', () => {
  it('renders select element', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
      </Select>
    )
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(
      <Select label="Test Label">
        <option value="1">Option 1</option>
      </Select>
    )
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('applies error styles when error is provided', () => {
    render(
      <Select error="Error message">
        <option value="1">Option 1</option>
      </Select>
    )
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('border-red-500')
  })

  it('displays error message', () => {
    render(
      <Select error="Error message">
        <option value="1">Option 1</option>
      </Select>
    )
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    )
    const select = screen.getByRole('combobox') as HTMLSelectElement

    await user.selectOptions(select, '2')
    expect(select.value).toBe('2')
  })
})

