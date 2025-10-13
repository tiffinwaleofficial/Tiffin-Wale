# Testing Implementation Guide

## 🎯 Overview

This guide provides comprehensive instructions for implementing and maintaining tests for the TiffinWale Student App. The testing framework is organized in a dedicated `testing/` folder to maintain clean project structure.

## 📁 Testing Structure

```
testing/
├── config/              # Jest configuration and setup
│   ├── jest.config.js   # Main Jest configuration
│   └── jest.setup.js    # Global test setup and mocks
├── unit/               # Unit tests for individual components
│   ├── components/     # Component tests
│   ├── services/       # Service tests
│   ├── hooks/          # Custom hook tests
│   ├── store/          # State management tests
│   └── utils/          # Utility function tests
├── integration/        # Integration tests
│   ├── api/           # API endpoint tests
│   ├── services/      # Service integration tests
│   └── flows/         # User flow tests
├── e2e/               # End-to-end tests
│   ├── auth/          # Authentication flows
│   ├── orders/        # Order management flows
│   └── chat/          # Chat functionality flows
├── fixtures/          # Test data and mock data
│   └── mockData.ts    # Centralized mock data
├── mocks/             # Mock implementations
│   └── testUtils.ts   # Testing utilities and mocks
├── utils/             # Testing helpers
│   └── testHelpers.tsx # Custom render functions
└── coverage/          # Coverage reports (generated)
```

## 🚀 Getting Started

### 1. Install Dependencies

The testing dependencies are already added to `package.json`:

```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.8.0",
    "@testing-library/jest-native": "^5.4.3",
    "jest": "^29.7.0",
    "jest-expo": "~54.0.0",
    "react-test-renderer": "18.3.1"
  }
}
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test -- --testPathPattern=Button
npm test -- --testPathPattern=unit
npm test -- --testPathPattern=integration
```

## 🧪 Writing Tests

### Unit Tests

Unit tests focus on testing individual components, functions, or hooks in isolation.

#### Component Testing Example

```typescript
// testing/unit/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

#### Service Testing Example

```typescript
// testing/unit/services/authService.test.ts
import { authService } from '../../services/authService';
import { mockApiResponses, mockFetch } from '../mocks/testUtils';

describe('Auth Service', () => {
  it('should login successfully', async () => {
    mockFetch(mockApiResponses.login);
    
    const result = await authService.login('test@example.com', 'password');
    
    expect(result.success).toBe(true);
    expect(result.token).toBe('mock-jwt-token');
  });
});
```

### Integration Tests

Integration tests verify that different parts of the application work together correctly.

```typescript
// testing/integration/api/apiClient.test.ts
import { apiClient } from '../../utils/apiClient';
import { mockApiResponses, mockFetch } from '../mocks/testUtils';

describe('API Client Integration', () => {
  it('should fetch restaurants successfully', async () => {
    mockFetch(mockApiResponses.restaurants);
    
    const response = await apiClient.restaurants.getAll();
    
    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(1);
  });
});
```

## 🎯 Test Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🔧 Configuration Details

### Jest Configuration (`testing/config/jest.config.js`)

- **Preset**: `jest-expo` for Expo compatibility
- **Test Environment**: `jsdom` for React Native testing
- **Setup File**: Custom setup with mocks and utilities
- **Coverage**: Comprehensive coverage collection
- **Transform**: Handles React Native and Expo modules

### Setup File (`testing/config/jest.setup.js`)

- Mock AsyncStorage
- Mock Expo modules
- Mock WebSocket
- Mock fetch
- Global test utilities

## 📊 Mock Data

All mock data is centralized in `testing/fixtures/mockData.ts`:

- `mockUser`: User data for testing
- `mockRestaurant`: Restaurant data
- `mockOrder`: Order data
- `mockMenuItems`: Menu item data
- `mockConversation`: Chat conversation data
- `mockMessage`: Chat message data
- `mockPayment`: Payment data
- `mockNotification`: Notification data

## 🛠️ Testing Utilities

### Custom Render Function

```typescript
// testing/utils/testHelpers.tsx
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AllTheProviders = ({ children }) => (
  <SafeAreaProvider>{children}</SafeAreaProvider>
);

export const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });
```

### Mock Utilities

```typescript
// testing/mocks/testUtils.ts
export const mockApiResponses = {
  login: { success: true, token: 'mock-token', user: mockUser },
  restaurants: { success: true, data: [mockRestaurant] },
};

export const mockFetch = (response, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(response),
  });
};
```

## 🎨 Best Practices

### 1. Test Structure (AAA Pattern)
```typescript
it('should do something', () => {
  // Arrange - Set up test data and mocks
  const mockData = { id: 1, name: 'Test' };
  
  // Act - Execute the function/component
  const result = functionUnderTest(mockData);
  
  // Assert - Verify the result
  expect(result).toBe(expectedValue);
});
```

### 2. Descriptive Test Names
```typescript
// Good
it('should display error message when login fails')

// Bad
it('should work')
```

### 3. Mock External Dependencies
```typescript
// Mock API calls
jest.mock('../../services/apiService');

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
```

### 4. Test Edge Cases
```typescript
it('should handle empty data gracefully', () => {
  const result = processData([]);
  expect(result).toEqual([]);
});

it('should throw error for invalid input', () => {
  expect(() => processData(null)).toThrow('Invalid input');
});
```

## 🚀 Next Steps

1. **Implement Critical Component Tests**: Start with Button, Input, and other core components
2. **Add Service Tests**: Test authService, apiClient, and other services
3. **Create Integration Tests**: Test API endpoints and data flows
4. **Add E2E Tests**: Test complete user journeys
5. **Monitor Coverage**: Ensure coverage goals are met
6. **CI/CD Integration**: Add tests to build pipeline

## 📝 Testing Checklist

- [ ] Unit tests for all components
- [ ] Service tests for all services
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Mock data for all entities
- [ ] Test utilities and helpers
- [ ] Coverage reports configured
- [ ] CI/CD integration ready
















