# Frontend Development Scope - Official Web App

## 🎯 Scope Overview

The Frontend scope encompasses all client-side development for the TiffinWale Official Web Application, including React components, user interfaces, routing, state management, and user experience optimization.

## 📁 File Structure & Organization

### Core Directories
```
client/src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Radix-based)
│   ├── forms/           # Form-specific components
│   ├── layout/          # Layout components
│   └── business/        # Business logic components
├── pages/               # Page components and routes
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── utils/               # Helper functions
└── styles/              # Global styles and CSS
```

### Key Files
- `App.tsx` - Main application component and routing
- `main.tsx` - Application entry point
- `index.css` - Global styles and CSS variables
- `vite-env.d.ts` - TypeScript environment definitions

## 🧩 Component Architecture

### UI Component System

#### Base Components (`components/ui/`)
**Purpose**: Foundation UI elements built on Radix UI primitives
**Key Components**:
- `button.tsx` - Button variants and states
- `input.tsx` - Form input components
- `card.tsx` - Content containers
- `dialog.tsx` - Modal dialogs
- `form.tsx` - Form components with validation
- `toast.tsx` - Notification system

**Pattern**: Compound components with consistent API
```typescript
// Example usage
<Button variant="primary" size="lg" disabled={isLoading}>
  Submit Form
</Button>
```

#### Business Components (`components/`)
**Purpose**: Domain-specific components for TiffinWale features
**Key Components**:
- `Hero.tsx` - Landing page hero section
- `ContactForm.tsx` - Contact form with validation
- `Testimonials.tsx` - Customer testimonials display
- `Pricing.tsx` - Subscription plans display
- `FAQ.tsx` - Frequently asked questions
- `MobileAppBanner.tsx` - App download promotion

### Page Components (`pages/`)

#### Marketing Pages
- `home.tsx` - Landing page with hero, features, testimonials
- `about.tsx` - Company information and mission
- `pricing.tsx` - Subscription plans and pricing
- `how-it-works.tsx` - Service explanation

#### Service Pages
- `tiffin-service.tsx` - Tiffin service details
- `meal-delivery.tsx` - Meal delivery information
- `corporate-plans.tsx` - B2B service offerings
- `daily-meal-service.tsx` - Daily meal options

#### Utility Pages
- `contact-us.tsx` - Contact form and information
- `faq.tsx` - Frequently asked questions
- `testimonials.tsx` - Customer reviews
- `submit-testimonial.tsx` - Testimonial submission form

#### Legal Pages
- `terms.tsx` - Terms of service
- `privacy-policy.tsx` - Privacy policy
- `refund-policy.tsx` - Refund policy

## 🎨 Styling & Design System

### Tailwind CSS Configuration
**File**: `tailwind.config.ts`
**Features**:
- Custom color palette with CSS variables
- Responsive breakpoints
- Animation utilities
- Typography plugin integration

### CSS Variables System
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Component Styling Patterns
1. **Utility-First**: Tailwind classes for styling
2. **CSS Variables**: Theme-aware color system
3. **Responsive Design**: Mobile-first approach
4. **Accessibility**: Focus states and ARIA support

## 🚀 State Management

### React Query (Server State)
**Purpose**: API data fetching, caching, and synchronization
**Configuration**: `lib/queryClient.ts`
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

**Usage Patterns**:
```typescript
// Data fetching
const { data, isLoading, error } = useQuery({
  queryKey: ['testimonials'],
  queryFn: () => getTestimonials(),
});

// Mutations
const mutation = useMutation({
  mutationFn: submitContactForm,
  onSuccess: () => {
    toast.success('Form submitted successfully!');
  },
});
```

### Local State (UI State)
**Purpose**: Component-level state management
**Patterns**:
- `useState` for simple state
- `useReducer` for complex state logic
- `useContext` for shared state
- Custom hooks for reusable logic

### Custom Hooks (`hooks/`)
- `use-mobile.tsx` - Mobile device detection
- `use-toast.ts` - Toast notification management
- `useScrollTop.tsx` - Scroll position tracking

## 🛣️ Routing & Navigation

### Wouter Router
**Configuration**: `App.tsx`
**Features**:
- Lightweight routing solution
- Client-side navigation
- Route-based code splitting
- Scroll restoration

### Route Structure
```typescript
<Switch>
  <Route path="/" component={Home} />
  <Route path="/how-it-works" component={HowItWorksPage} />
  <Route path="/pricing" component={PricingPage} />
  <Route path="/contact-us" component={ContactUsPage} />
  {/* ... more routes */}
  <Route component={NotFound} />
</Switch>
```

### Navigation Patterns
- **Programmatic Navigation**: `useLocation` hook
- **Link Components**: Accessible navigation links
- **Active States**: Current page indication
- **Breadcrumbs**: Navigation hierarchy

## 📱 Responsive Design

### Breakpoint System
```typescript
// Tailwind breakpoints
sm: '640px',   // Small devices
md: '768px',   // Medium devices
lg: '1024px',  // Large devices
xl: '1280px',  // Extra large devices
2xl: '1536px', // 2X large devices
```

### Mobile-First Approach
1. **Base Styles**: Mobile-optimized
2. **Progressive Enhancement**: Larger screen features
3. **Touch-Friendly**: Appropriate touch targets
4. **Performance**: Optimized for mobile networks

### Responsive Components
- **Flexible Layouts**: CSS Grid and Flexbox
- **Adaptive Typography**: Responsive font sizes
- **Image Optimization**: Responsive images with WebP
- **Navigation**: Mobile hamburger menu

## 🎭 Animation & Interactions

### Framer Motion
**Purpose**: Smooth animations and transitions
**Usage Patterns**:
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Animation Categories
1. **Page Transitions**: Route change animations
2. **Component Animations**: Hover and focus states
3. **Loading States**: Skeleton screens and spinners
4. **Form Interactions**: Validation feedback

## 🔧 Performance Optimization

### Code Splitting
**Implementation**: Route-based and component-based splitting
```typescript
// Lazy loading
const LazyComponent = lazy(() => import('./Component'));

// Dynamic imports
const { heavyFunction } = await import('./heavy-module');
```

### Bundle Optimization
**Vite Configuration**: `vite.config.ts`
- **Tree Shaking**: Unused code elimination
- **Chunk Splitting**: Vendor and app code separation
- **Asset Optimization**: Image and font optimization
- **Compression**: Gzip and Brotli compression

### Performance Monitoring
- **Vercel Analytics**: Real user monitoring
- **Speed Insights**: Core Web Vitals tracking
- **Bundle Analysis**: Build size monitoring

## 🧪 Testing Strategy

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Vitest**: Fast test runner (Vite-based)

### Testing Patterns
```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Test Categories
1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: User journey testing
4. **Visual Tests**: UI regression testing

## ♿ Accessibility (A11y)

### WCAG 2.1 AA Compliance
**Implementation**:
- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: Minimum 4.5:1 ratio
- **Focus Management**: Visible focus indicators

### Accessibility Components
- `accessible-heading.tsx` - Semantic heading components
- `accessible-image.tsx` - Image with alt text
- `accessible-link.tsx` - Accessible link components

### Testing Accessibility
- **Automated Testing**: axe-core integration
- **Manual Testing**: Screen reader testing
- **Keyboard Testing**: Tab navigation verification

## 🔌 API Integration

### API Client (`lib/api.ts`)
**Purpose**: Centralized API communication
**Features**:
- **Request/Response Interceptors**: Error handling
- **Type Safety**: TypeScript interfaces
- **Caching**: React Query integration
- **WebSocket Support**: Real-time updates

### API Patterns
```typescript
// GET request
const testimonials = await getTestimonials(6, true);

// POST request
const result = await submitContactForm(formData);

// WebSocket connection
connectWebSocket(
  (data) => console.log('Message:', data),
  () => console.log('Connected'),
  () => console.log('Disconnected')
);
```

## 🛠️ Development Tools

### Development Server
**Command**: `npm run dev`
**Features**:
- **Hot Module Replacement**: Instant updates
- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Build Process
**Command**: `npm run build`
**Output**: `dist/public/`
**Features**:
- **Production Optimization**: Minification and compression
- **Asset Processing**: Image and font optimization
- **Source Maps**: Debugging support
- **Bundle Analysis**: Size monitoring

### Code Quality
- **TypeScript**: Type safety
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics**: Real user metrics
- **Speed Insights**: Core Web Vitals
- **Error Tracking**: JavaScript error monitoring

### User Analytics
- **Page Views**: Route-based tracking
- **User Interactions**: Button clicks and form submissions
- **Conversion Tracking**: Goal completion monitoring

## 🚀 Deployment

### Build Output
**Directory**: `dist/public/`
**Contents**:
- `index.html` - Main HTML file
- `assets/` - JavaScript, CSS, and images
- `favicon.ico` - Site icon
- `robots.txt` - Search engine instructions
- `sitemap.xml` - Site structure

### Deployment Platforms
1. **Vercel**: Primary hosting platform
2. **Google Cloud**: Alternative deployment
3. **Docker**: Containerized deployment

---

*This scope covers all frontend development aspects of the Official Web App. For backend integration, refer to the backend-scope.md documentation.*

