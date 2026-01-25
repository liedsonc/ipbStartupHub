import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from '@/components/auth/SessionProvider'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { ToastProvider } from '@/lib/hooks/useToast'
import { InboxProvider } from '@/lib/hooks/useInbox'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SessionProvider>
        <ToastProvider>
          <InboxProvider>
            {children}
          </InboxProvider>
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

describe('test-utils', () => {
  it('should export render function', () => {
    expect(customRender).toBeDefined()
  })
})

