# Testing Structure

This directory contains all testing-related files and configurations for the TiffinWale Student App.

## 📁 Directory Structure

```
testing/
├── config/           # Jest configuration and setup files
├── unit/            # Unit tests for individual components and functions
├── integration/     # Integration tests for API endpoints and services
├── e2e/            # End-to-end tests for complete user flows
├── fixtures/       # Test data and mock data
├── mocks/          # Mock implementations and utilities
├── utils/          # Testing utilities and helpers
└── coverage/       # Coverage reports (generated)
```

## 🧪 Test Types

### Unit Tests (`unit/`)
- Component rendering tests
- Hook functionality tests
- Utility function tests
- Store state management tests

### Integration Tests (`integration/`)
- API endpoint tests
- Service integration tests
- Database interaction tests
- Authentication flow tests

### E2E Tests (`e2e/`)
- Complete user journey tests
- Cross-platform compatibility tests
- Performance tests
- Accessibility tests

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm test -- --testPathPattern=testing/unit

# Run only integration tests
npm test -- --testPathPattern=testing/integration
```

## 📊 Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🔧 Configuration

- **Jest Config**: `config/jest.config.js`
- **Setup File**: `config/jest.setup.js`
- **Test Environment**: jsdom
- **Preset**: jest-expo

## 📝 Writing Tests

### Unit Test Example
```typescript
// testing/unit/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../components/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Integration Test Example
```typescript
// testing/integration/api/auth.test.ts
import { authService } from '../../../services/authService';

describe('Auth Service Integration', () => {
  it('should login successfully', async () => {
    const result = await authService.login('test@example.com', 'password');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });
});
```

## 🎯 Best Practices

1. **Test Naming**: Use descriptive test names that explain the expected behavior
2. **Arrange-Act-Assert**: Structure tests with clear sections
3. **Mock External Dependencies**: Mock API calls, navigation, and external services
4. **Test Edge Cases**: Include tests for error conditions and edge cases
5. **Keep Tests Independent**: Each test should be able to run independently
6. **Use Fixtures**: Reuse test data through fixtures
7. **Maintain Coverage**: Aim for high test coverage while focusing on critical paths









