// Testing utilities and helpers
import { render, RenderOptions } from '@testing-library/react-native';
import React, { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      {children}
    </SafeAreaProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Test helpers
export const createMockProps = (overrides = {}) => ({
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  },
  route: {
    params: {},
  },
  ...overrides,
});

export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };









