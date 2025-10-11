# Frontend Scope Onboarding

## Quick Start for Frontend Development

### 🎯 Scope Overview
You're working on the **Official Web App** - the primary customer-facing interface built with React 18, Vite, and TypeScript. This app serves students/bachelors for meal subscriptions and ordering.

### 📁 Key Directories
```
interface/official-web-app/
├── client/src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── utils/            # Helper functions
│   └── App.tsx          # Main app component
├── config/               # Environment configuration
├── public/               # Static assets
└── shared/              # Shared schemas and types
```

### 🚀 Quick Commands
```bash
# Start development server
pnpm run frontend:dev

# Build for production
pnpm run frontend:build

# Preview production build
pnpm run frontend:preview

# Type checking
pnpm run frontend:check
```

### 🔧 Environment Setup
```env
# Required environment variables
API_BASE_URL=http://localhost:3001/api
VITE_API_BASE_URL=http://localhost:3001/api
NODE_ENV=development
```

### 📚 Key Concepts

#### Component Structure
```typescript
// Functional components with hooks
const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { data, loading, error } = useQuery(GET_ORDER);
  
  return (
    <Card>
      <CardHeader>{order.title}</CardHeader>
      <CardContent>{order.description}</CardContent>
    </Card>
  );
};
```

#### State Management (Zustand)
```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Login logic
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

#### API Integration (React Query)
```typescript
const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### Form Handling
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

### 🎯 Current Priorities
1. **Complete Subscription Flow** - Plan selection, billing management
2. **Payment Integration UI** - Payment methods, checkout process
3. **Real-time Updates** - Live order status updates
4. **User Experience** - Responsive design, loading states

### 🎨 UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Tiffin-Wale specific components
- **Responsive Design**: Mobile-first approach

### 🔍 Development Tools
- **React DevTools**: Component inspection
- **Vite Dev Server**: Fast hot reload
- **TypeScript**: Type safety and IntelliSense
- **ESLint**: Code quality and consistency

### 🧪 Testing
```bash
# Run tests (when implemented)
pnpm test

# Type checking
pnpm run frontend:check

# Lint code
pnpm run frontend:lint
```

### 📝 Development Guidelines
1. **Use TypeScript** - All components should be typed
2. **Follow React patterns** - Functional components, hooks
3. **Implement responsive design** - Mobile-first approach
4. **Handle loading states** - Show loading indicators
5. **Error boundaries** - Graceful error handling

### 🔗 Related Scopes
- **Backend**: Consumes APIs from NestJS backend
- **Mobile**: Shares similar user flows with mobile apps
- **Admin**: Different interface for admin users

### 🚨 Common Issues
1. **API Integration**: Check API base URL and CORS
2. **Authentication**: Verify JWT token handling
3. **State Management**: Ensure Zustand stores are properly configured
4. **Styling**: Check Tailwind CSS classes and responsive design

### 📞 Quick Help
- **API Issues**: Check network tab and API documentation
- **Component Issues**: Use React DevTools for debugging
- **Styling Issues**: Check Tailwind CSS classes and responsive breakpoints
- **Build Issues**: Check Vite configuration and dependencies

### 🎯 Key Features to Implement
1. **User Authentication** - Login, register, password reset
2. **Subscription Management** - Plan selection, billing
3. **Order Management** - Order tracking, history
4. **Payment Integration** - Payment methods, checkout
5. **Real-time Updates** - Live order status
6. **User Profile** - Profile management, preferences

### 📱 Responsive Design
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### 🔧 Performance Optimization
- **Code Splitting**: Lazy load components
- **Image Optimization**: Use WebP format
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: React Query for data caching

---

**Remember**: This is the primary customer interface. Focus on user experience, accessibility, and performance. Test on multiple devices and browsers. 