import '@testing-library/jest-dom'

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})


if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body
      this.status = init?.status || 200
      this.statusText = init?.statusText || 'OK'
      this.headers = new Headers(init?.headers)
    }
    json() {
      return Promise.resolve(JSON.parse(this.body))
    }
    text() {
      return Promise.resolve(this.body)
    }
  }
}

jest.mock('next-auth/react', () => {
  const React = require('react')
  return {
    SessionProvider: ({ children }) => React.createElement('div', null, children),
    useSession: () => ({
      data: null,
      status: 'unauthenticated',
    }),
  }
})

jest.mock('@/components/auth/SessionProvider', () => {
  const React = require('react')
  return {
    SessionProvider: ({ children }) => React.createElement('div', null, children),
  }
})

