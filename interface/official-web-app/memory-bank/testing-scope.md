# Testing Scope - Official Web App

## 🎯 Scope Overview

The Testing scope encompasses all testing strategies, tools, and practices for the TiffinWale Official Web Application, including unit tests, integration tests, end-to-end tests, and quality assurance processes.

## 🧪 Testing Strategy Overview

### Testing Pyramid
```
┌─────────────────────────────────────────────────────────────┐
│                    E2E TESTS (Few)                          │
│  ├── User Journey Testing                                  │
│  ├── Cross-Browser Testing                                 │
│  └── Performance Testing                                   │
├─────────────────────────────────────────────────────────────┤
│                 INTEGRATION TESTS (Some)                    │
│  ├── API Endpoint Testing                                  │
│  ├── Component Integration Testing                          │
│  └── Database Integration Testing                          │
├─────────────────────────────────────────────────────────────┤
│                  UNIT TESTS (Many)                         │
│  ├── Component Testing                                     │
│  ├── Utility Function Testing                              │
│  ├── Hook Testing                                          │
│  └── Service Testing                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Testing Tools & Setup

### Frontend Testing Stack
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Vitest**: Fast test runner (Vite-based)
- **MSW**: API mocking for integration tests
- **Playwright**: End-to-end testing

### Backend Testing Stack
- **Jest**: Unit testing framework
- **Supertest**: HTTP assertion library
- **Node.js Test Runner**: Built-in testing utilities

### Testing Configuration
```typescript
// Jest configuration
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
};
```

## 🧩 Unit Testing

### Component Testing
```typescript
// Example: Button component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

### Hook Testing
```typescript
// Example: Custom hook test
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';

describe('useToast Hook', () => {
  test('initializes with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  test('adds toast when called', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
  });
});
```

### Utility Function Testing
```typescript
// Example: Utility function test
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  test('merges class names correctly', () => {
    const result = cn('base-class', 'additional-class');
    expect(result).toBe('base-class additional-class');
  });

  test('handles conditional classes', () => {
    const result = cn('base-class', {
      'conditional-class': true,
      'false-class': false,
    });
    expect(result).toBe('base-class conditional-class');
  });
});
```

## 🔗 Integration Testing

### API Endpoint Testing
```typescript
// Example: API endpoint test
import request from 'supertest';
import app from '../server';

describe('API Endpoints', () => {
  test('POST /api/contact', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    };

    const response = await request(app)
      .post('/api/contact')
      .send(contactData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Thank you');
  });

  test('GET /api/testimonials', async () => {
    const response = await request(app)
      .get('/api/testimonials')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('testimonials');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
  });
});
```

### Component Integration Testing
```typescript
// Example: Form integration test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from '@/components/ContactForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('ContactForm Integration', () => {
  test('submits form successfully', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ContactForm />
      </QueryClientProvider>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message content' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });
  });
});
```

### WebSocket Testing
```typescript
// Example: WebSocket integration test
import { WebSocket } from 'ws';
import { createServer } from 'http';

describe('WebSocket Integration', () => {
  test('connects and receives messages', (done) => {
    const server = createServer();
    const wss = new WebSocketServer({ server });
    
    wss.on('connection', (ws) => {
      ws.send(JSON.stringify({ type: 'connection', message: 'Connected' }));
    });

    const client = new WebSocket('ws://localhost:5000/ws');
    
    client.on('message', (data) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('connection');
      expect(message.message).toBe('Connected');
      client.close();
      server.close();
      done();
    });
  });
});
```

## 🌐 End-to-End Testing

### User Journey Testing
```typescript
// Example: E2E test with Playwright
import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {
  test('complete contact form submission', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact-us');
    
    // Fill contact form
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="message-input"]', 'Test message');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Thank you');
  });

  test('testimonial submission flow', async ({ page }) => {
    // Navigate to testimonial page
    await page.goto('/submit-testimonial');
    
    // Fill testimonial form
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="profession-input"]', 'Software Engineer');
    await page.click('[data-testid="rating-5"]');
    await page.fill('[data-testid="testimonial-input"]', 'Great service!');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

### Cross-Browser Testing
```typescript
// Example: Cross-browser test configuration
const browsers = ['chromium', 'firefox', 'webkit'];

browsers.forEach(browserName => {
  test.describe(`${browserName} browser`, () => {
    test('homepage loads correctly', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    });
  });
});
```

## 📊 Performance Testing

### Core Web Vitals Testing
```typescript
// Example: Performance test
import { test, expect } from '@playwright/test';

test('Core Web Vitals', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/');
  
  // Measure LCP (Largest Contentful Paint)
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });
  });
  
  expect(lcp).toBeLessThan(2500); // LCP should be under 2.5s
  
  // Measure FID (First Input Delay)
  const fid = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[0].processingStart - entries[0].startTime);
      }).observe({ entryTypes: ['first-input'] });
    });
  });
  
  expect(fid).toBeLessThan(100); // FID should be under 100ms
});
```

### Bundle Size Testing
```typescript
// Example: Bundle size test
import { test, expect } from '@playwright/test';

test('Bundle size is within limits', async ({ page }) => {
  const response = await page.goto('/');
  
  // Get resource sizes
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'))
      .map(entry => ({
        name: entry.name,
        size: entry.transferSize,
      }));
  });
  
  // Check total bundle size
  const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
  expect(totalSize).toBeLessThan(500000); // 500KB limit
});
```

## 🔍 Accessibility Testing

### Automated Accessibility Testing
```typescript
// Example: Accessibility test
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accessibility compliance', async ({ page }) => {
  await page.goto('/');
  
  // Run accessibility scan
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('keyboard navigation', async ({ page }) => {
  await page.goto('/');
  
  // Test tab navigation
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  
  // Test enter key activation
  await page.keyboard.press('Enter');
  // Verify expected behavior
});
```

### Screen Reader Testing
```typescript
// Example: Screen reader test
test('screen reader compatibility', async ({ page }) => {
  await page.goto('/');
  
  // Check for proper ARIA labels
  const elementsWithAriaLabels = await page.locator('[aria-label]').count();
  expect(elementsWithAriaLabels).toBeGreaterThan(0);
  
  // Check for proper heading structure
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  expect(headings.length).toBeGreaterThan(0);
});
```

## 🧪 Mocking & Test Data

### API Mocking with MSW
```typescript
// Example: API mock setup
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/contact', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Thank you for contacting us!',
      })
    );
  }),
  
  rest.get('/api/testimonials', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        testimonials: [
          {
            id: '1',
            name: 'Test User',
            rating: 5,
            testimonial: 'Great service!',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Test Data Factories
```typescript
// Example: Test data factory
export const createTestContact = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  message: 'Test message',
  ...overrides,
});

export const createTestTestimonial = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  profession: 'Software Engineer',
  rating: 5,
  testimonial: 'Great service!',
  ...overrides,
});
```

## 📈 Test Coverage & Reporting

### Coverage Configuration
```typescript
// Jest coverage configuration
export default {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Coverage Reports
- **Text Report**: Console output during test runs
- **LCOV Report**: For CI/CD integration
- **HTML Report**: Detailed coverage visualization
- **Coverage Thresholds**: Enforce minimum coverage levels

## 🚀 CI/CD Integration

### GitHub Actions Workflow
```yaml
# Example: Testing workflow
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Test Commands
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# All tests
npm run test

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🔧 Testing Utilities

### Custom Test Utilities
```typescript
// Example: Custom render function
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>,
    options
  );
};
```

### Test Helpers
```typescript
// Example: Test helpers
export const waitForApiCall = async (mockFn: jest.Mock) => {
  await waitFor(() => {
    expect(mockFn).toHaveBeenCalled();
  });
};

export const mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};
```

## 📋 Testing Checklist

### Pre-Development
- [ ] Test requirements defined
- [ ] Test data prepared
- [ ] Mock services configured
- [ ] Test environment set up

### During Development
- [ ] Unit tests written for new components
- [ ] Integration tests for API endpoints
- [ ] Accessibility tests implemented
- [ ] Performance tests added

### Pre-Deployment
- [ ] All tests passing
- [ ] Coverage thresholds met
- [ ] E2E tests completed
- [ ] Cross-browser testing done
- [ ] Performance benchmarks met

### Post-Deployment
- [ ] Monitoring tests in production
- [ ] User feedback collected
- [ ] Performance metrics tracked
- [ ] Error rates monitored

---

*This scope covers all testing aspects of the Official Web App. For development workflows, refer to the frontend-scope.md and backend-scope.md documentation.*
