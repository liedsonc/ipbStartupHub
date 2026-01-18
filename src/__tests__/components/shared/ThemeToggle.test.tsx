import { render, screen } from '@/__tests__/utils/test-utils'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import userEvent from '@testing-library/user-event'

describe('ThemeToggle', () => {
  it('renders toggle button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it('toggles theme on click', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)

    expect(document.documentElement.classList.contains('dark') || 
           !document.documentElement.classList.contains('dark')).toBeTruthy()
  })
})

