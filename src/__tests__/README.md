# Test Suite Documentation

This directory contains comprehensive tests for the Startup Hub application.

## Test Structure

```
src/__tests__/
├── app/
│   ├── actions/          # Server action tests
│   └── api/              # API route tests
├── components/           # Component tests
├── lib/                  # Library/utility tests
└── utils/                # Test utilities and mocks
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## Test Coverage

### Component Tests
- ✅ UI Components (Button, Card, Badge, Input, Select, Modal, SearchBar)
- ✅ Auth Components (LoginForm, RegisterForm, AuthGuard)
- ✅ Idea Components (IdeaCard, IdeaForm, InterestButton, IdeaFilters)
- ✅ Shared Components (EmptyState, ThemeToggle)
- ✅ Layout Components (Header)
- ✅ Person Components (OpportunitiesList)

### API Route Tests
- ✅ `/api/ideas` - GET, POST
- ✅ `/api/ideas/[id]` - GET, PUT, DELETE
- ✅ `/api/interests` - POST
- ✅ `/api/notifications` - GET, PATCH, DELETE
- ✅ `/api/users/[id]` - GET
- ✅ `/api/auth/register` - POST

### Server Action Tests
- ✅ `createIdeaAction` - Create new ideas
- ✅ `updateIdeaAction` - Update existing ideas
- ✅ `registerAction` - User registration
- ✅ `addInterestAction` - Add interest signals

### Utility Tests
- ✅ Format utilities (date, relative time)
- ✅ URL utilities (absolute URL generation)
- ✅ Auth utilities (session, permissions, RBAC, roles)

### Hook Tests
- ✅ `useInbox` - Notification management hook

### Middleware Tests
- ✅ Route protection
- ✅ Authentication checks
- ✅ Role-based access control

## Test Utilities

### `test-utils.tsx`
Provides a custom `render` function that wraps components with all necessary providers:
- ThemeProvider
- SessionProvider
- ToastProvider
- InboxProvider

### `mocks.ts`
Contains mock data for:
- Users
- Ideas
- People
- Notifications
- Sessions

## Writing New Tests

When adding new tests, follow these patterns:

1. **Component Tests**: Use `render` from `test-utils.tsx`
2. **API Tests**: Mock Prisma and session functions
3. **Action Tests**: Mock database operations and session
4. **Utility Tests**: Test pure functions directly

Example component test:
```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## Coverage Goals

- Minimum 60% coverage for all metrics
- Focus on critical paths and user flows
- Test error cases and edge conditions

