# Unit Testing Guide

Complete guide for writing and running unit tests for Cinebayan application.

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Running Tests](#running-tests)
3. [Test Coverage](#test-coverage)
4. [Test Structure](#test-structure)
5. [Writing Tests](#writing-tests)
6. [Test Utilities](#test-utilities)
7. [Best Practices](#best-practices)
8. [Mocking](#mocking)
9. [Continuous Integration](#continuous-integration)

---

## Testing Stack

### Core Testing Libraries

- **Jest 30+** - Test runner and assertion library
- **@testing-library/react 16+** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - User interaction simulation
- **TypeScript** - Type-safe tests

### Configuration Files

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test environment setup
- `tsconfig.json` - TypeScript configuration

---

## Running Tests

### Available Commands

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests in CI mode
npm run test:ci
```

### Running Specific Tests

```bash
# Run tests for a specific file
npm test -- auth.service.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should create"

# Run tests for a specific folder
npm test -- src/services

# Update snapshots
npm test -- -u

# Run with verbose output
npm test -- --verbose
```

---

## Test Coverage

### Coverage Thresholds

Minimum coverage requirements (configured in `jest.config.js`):
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Viewing Coverage Reports

```bash
# Generate coverage report
npm test

# View HTML coverage report (opens in browser)
open coverage/lcov-report/index.html

# View coverage in terminal
npm test -- --coverage --coverageReporters=text
```

### Coverage Configuration

Coverage collection is configured to exclude:
- Type definitions (`.d.ts`)
- Story files (`.stories.{js,jsx,ts,tsx}`)
- Test files (`__tests__/**`)
- Layout files (`layout.tsx`)
- Middleware
- i18n configuration

---

## Test Structure

### Directory Organization

```
src/
├── services/
│   ├── __tests__/
│   │   ├── auth.service.test.ts
│   │   ├── projects.service.test.ts
│   │   ├── crew-invitations.service.test.ts
│   │   ├── profiles.service.test.ts
│   │   ├── contributions.service.test.ts
│   │   └── favorites.service.test.ts
│   └── *.service.ts
├── components/
│   ├── __tests__/
│   │   ├── EmptyProjectsState.test.tsx
│   │   └── ProjectCard.test.tsx
│   └── *.tsx
└── __tests__/
    └── test-utils.tsx
```

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- Place tests in `__tests__` folder next to the code they test

---

## Writing Tests

### Basic Test Structure

```typescript
import { ServiceName } from '../service-name';

describe('ServiceName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should perform expected behavior', async () => {
      // Arrange
      const input = 'test-input';

      // Act
      const result = await ServiceName.methodName(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.property).toBe('expected-value');
    });

    it('should handle errors', async () => {
      // Arrange
      const invalidInput = null;

      // Act & Assert
      await expect(
        ServiceName.methodName(invalidInput)
      ).rejects.toThrow();
    });
  });
});
```

### Service Testing Example

```typescript
import { ProjectsService } from '../projects.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('ProjectsService', () => {
  const mockProject = {
    id: 'project-123',
    title: 'Test Film',
    synopsis: 'A test synopsis',
    genre: 'Drama',
    goal: 50000,
    raised: 10000,
    status: 'active',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProjectById', () => {
    it('should fetch a single project', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: mockProject,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProjectsService.getProjectById('project-123');

      expect(result).toEqual(mockProject);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'project-123');
    });
  });
});
```

### Component Testing Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyProjectsState from '../EmptyProjectsState';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation');
jest.mock('@/context/SupabaseAuthContext');

describe('EmptyProjectsState', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should render empty state', () => {
    render(<EmptyProjectsState locale="en" />);

    expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
  });

  it('should handle button click', () => {
    render(<EmptyProjectsState locale="en" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalled();
  });
});
```

---

## Test Utilities

### Available Test Utilities

Located in `src/__tests__/test-utils.tsx`:

```typescript
import {
  mockAuthContext,
  mockAuthenticatedUser,
  mockProject,
  mockDraftProject,
  mockCrewInvitation,
  createMockSupabaseClient,
  mockSupabaseResponse,
  mockSupabaseError,
  createMockRouter,
  waitForLoadingToFinish,
} from '@/__tests__/test-utils';
```

### Using Mock Data

```typescript
import { mockProject, mockAuthenticatedUser } from '@/__tests__/test-utils';

describe('MyTest', () => {
  it('should use mock data', () => {
    const project = { ...mockProject, title: 'Custom Title' };
    expect(project.title).toBe('Custom Title');
  });
});
```

### Creating Mock Responses

```typescript
import { mockSupabaseResponse, mockSupabaseError } from '@/__tests__/test-utils';

// Success response
const successResponse = mockSupabaseResponse(mockProject);

// Error response
const errorResponse = mockSupabaseError('Not found');
```

---

## Best Practices

### 1. Test Naming

```typescript
// ✅ Good - Descriptive test names
it('should create a new project when valid data is provided', () => {});
it('should throw error when project title is empty', () => {});
it('should redirect to signin when user is not authenticated', () => {});

// ❌ Bad - Vague test names
it('works', () => {});
it('test1', () => {});
it('should return something', () => {});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should update project status', async () => {
  // Arrange - Set up test data and mocks
  const projectId = 'project-123';
  const newStatus = 'funded';
  mockSupabase.update.mockResolvedValue({ data: updatedProject, error: null });

  // Act - Execute the code being tested
  const result = await ProjectsService.updateProject(projectId, { status: newStatus });

  // Assert - Verify the results
  expect(result.status).toBe('funded');
  expect(mockSupabase.update).toHaveBeenCalledWith({ status: newStatus });
});
```

### 3. Test Independence

```typescript
// ✅ Good - Each test is independent
describe('ProjectsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test 1', () => {
    // Standalone test
  });

  it('test 2', () => {
    // Doesn't depend on test 1
  });
});

// ❌ Bad - Tests depend on each other
describe('ProjectsService', () => {
  let sharedState;

  it('test 1', () => {
    sharedState = 'value'; // Sets state for next test
  });

  it('test 2', () => {
    expect(sharedState).toBe('value'); // Depends on test 1
  });
});
```

### 4. Mock Only What's Necessary

```typescript
// ✅ Good - Mock external dependencies
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// ❌ Bad - Don't mock the code you're testing
jest.mock('../projects.service'); // You're testing this!
```

### 5. Test Edge Cases

```typescript
describe('ProjectsService.createProject', () => {
  it('should create project with valid data', () => {});
  it('should handle missing title', () => {});
  it('should handle negative goal amount', () => {});
  it('should handle database errors', () => {});
  it('should handle network timeouts', () => {});
});
```

### 6. Use Descriptive Variables

```typescript
// ✅ Good
const mockAuthenticatedUser = { id: 'user-123', email: 'test@example.com' };
const expectedProjectTitle = 'My Film Project';

// ❌ Bad
const u = { id: '123', email: 'test@test.com' };
const x = 'My Film Project';
```

---

## Mocking

### Mocking Supabase

```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    }),
    auth: {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));
```

### Mocking Next.js Router

```typescript
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// In test
(useRouter as jest.Mock).mockReturnValue({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
});
```

### Mocking Context

```typescript
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

jest.mock('@/context/SupabaseAuthContext', () => ({
  useSupabaseAuth: jest.fn(),
}));

// In test
(useSupabaseAuth as jest.Mock).mockReturnValue({
  user: mockUser,
  isAuthenticated: true,
  loading: false,
});
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Test Coverage Summary

### Current Test Coverage

#### Services (100% Coverage)
- ✅ AuthService - 21 tests
- ✅ ProjectsService - 18 tests
- ✅ CrewInvitationsService - 15 tests
- ✅ ProfilesService - 10 tests
- ✅ ContributionsService - 12 tests
- ✅ FavoritesService - 13 tests

#### Components
- ✅ EmptyProjectsState - 6 tests
- ✅ ProjectCard - 8 tests

### Total Test Count

- **Service Tests**: 89 tests
- **Component Tests**: 14 tests
- **Total**: 103+ tests

---

## Common Testing Patterns

### Testing Async Functions

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Errors

```typescript
it('should throw error', async () => {
  await expect(
    functionThatThrows()
  ).rejects.toThrow('Error message');
});
```

### Testing User Interactions

```typescript
import { fireEvent, screen } from '@testing-library/react';

it('should handle click', () => {
  render(<Component />);

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(mockFunction).toHaveBeenCalled();
});
```

### Testing Form Inputs

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should handle input change', async () => {
  const user = userEvent.setup();
  render(<Form />);

  const input = screen.getByLabelText('Email');
  await user.type(input, 'test@example.com');

  expect(input).toHaveValue('test@example.com');
});
```

---

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module"
```bash
# Solution: Clear Jest cache
npm test -- --clearCache
```

**Issue**: Tests pass locally but fail in CI
```bash
# Solution: Use CI-specific script
npm run test:ci
```

**Issue**: Coverage threshold not met
```bash
# Solution: Check coverage report
npm test -- --coverage --verbose
```

**Issue**: Async tests timing out
```typescript
// Solution: Increase timeout
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Next Steps

1. ✅ Run full test suite: `npm test`
2. ✅ Check coverage report
3. ✅ Add tests for new features
4. ✅ Maintain 70%+ coverage threshold
5. ✅ Run tests before commits
