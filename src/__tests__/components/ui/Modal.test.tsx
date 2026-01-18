import { render, screen } from '@/__tests__/utils/test-utils'
import { Modal } from '@/components/ui/Modal'
import userEvent from '@testing-library/user-event'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    )
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('calls onClose when clicking backdrop', async () => {
    const onClose = jest.fn()
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    )

    const backdrop = container.querySelector('.fixed')
    backdrop?.click()

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking cancel button', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal" showCancel={true}>
        <p>Modal Content</p>
      </Modal>
    )

    const cancelButton = screen.getByText(/cancelar/i)
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onConfirm when clicking confirm button', async () => {
    const onConfirm = jest.fn()
    const user = userEvent.setup()
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirm}
        title="Test Modal"
        confirmLabel="Confirm"
      >
        <p>Modal Content</p>
      </Modal>
    )

    const confirmButton = screen.getByText('Confirm')
    await user.click(confirmButton)

    expect(onConfirm).toHaveBeenCalled()
  })
})

