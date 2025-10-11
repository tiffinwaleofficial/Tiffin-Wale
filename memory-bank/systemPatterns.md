# Tiffin-Wale System Patterns

## Architecture Overview

### Monorepo Structure
The project follows a **monorepo architecture** with clear separation of concerns:

```
Tiffin-Wale/
├── monolith_backend/          # NestJS API server
├── interface/
│   ├── official-web-app/      # React/Vite web application
│   ├── student-app/           # Expo React Native mobile app
│   ├── partner-app/           # Expo React Native partner app
│   └── super-admin-web/       # Next.js admin dashboard
├── docs/                      # Project documentation
└── memory-bank/               # Development context
```

### Service Architecture
- **Backend**: Single NestJS monolith serving all interfaces
- **Frontend**: Multiple specialized interfaces for different user types
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Google Cloud Platform with App Engine

## Backend Patterns

### Module-Based Architecture
The NestJS backend follows a **modular architecture** with clear separation:

```typescript
// Module Structure
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(),
    AuthModule,
    UserModule,
    OrderModule,
    MenuModule,
    // ... other modules
  ],
})
export class AppModule {}
```

### Module Pattern
Each module follows the **NestJS module pattern**:
- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic
- **DTOs**: Data transfer objects for validation
- **Entities**: Database models and schemas
- **Guards**: Authentication and authorization

### Authentication Pattern
```typescript
// JWT-based authentication with role-based access
@UseGuards(JwtAuthGuard)
@Roles('customer', 'partner', 'admin')
@Controller('orders')
export class OrderController {
  // Controller methods
}
```

### Database Pattern
```typescript
// MongoDB with Mongoose schemas
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop({ required: true })
  password: string;
  
  @Prop({ enum: ['customer', 'partner', 'admin'] })
  role: string;
}
```

### API Response Pattern
```typescript
// Consistent API response structure
{
  success: boolean;
  data?: any;
  message?: string;
  errors?: ValidationError[];
}
```

## Frontend Patterns

### Component Architecture
All frontend applications follow **React component patterns**:

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

### State Management Pattern
```typescript
// Zustand for global state management
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

### API Client Pattern
```typescript
// Centralized API client with interceptors
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Form Handling Pattern
```typescript
// React Hook Form with Zod validation
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

## Mobile App Patterns

### Navigation Pattern
```typescript
// Expo Router with file-based routing
app/
├── (auth)/
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/
│   ├── dashboard.tsx
│   ├── orders.tsx
│   └── profile.tsx
└── _layout.tsx
```

### Screen Pattern
```typescript
// Consistent screen structure
const DashboardScreen = () => {
  const { data, loading } = useQuery(GET_DASHBOARD_DATA);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView>
        {/* Screen content */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

### Store Pattern (Mobile)
```typescript
// Zustand stores for mobile state
interface OrderStore {
  orders: Order[];
  activeOrder: Order | null;
  fetchOrders: () => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
}
```

## Database Patterns

### Schema Design Pattern
```typescript
// MongoDB schemas with timestamps and relationships
@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  customerId: mongoose.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true })
  partnerId: mongoose.Types.ObjectId;
  
  @Prop({ enum: ['pending', 'confirmed', 'preparing', 'delivering', 'completed'] })
  status: string;
  
  @Prop({ type: [OrderItemSchema] })
  items: OrderItem[];
}
```

### Query Pattern
```typescript
// Repository pattern for database operations
@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}
  
  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.orderModel
      .find({ customerId })
      .populate('partnerId', 'name location')
      .sort({ createdAt: -1 })
      .exec();
  }
}
```

## Deployment Patterns

### Environment Configuration
```typescript
// Centralized environment management
export const config = {
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  environment: process.env.NODE_ENV || 'development',
  // ... other config
};
```

### Build Pattern
```bash
# Multi-service build process
pnpm run build:all          # Build all services
pnpm run build:backend      # Build backend only
pnpm run build:frontend     # Build web app only
pnpm run build:mobile       # Build mobile apps only
```

### Deployment Pattern
```yaml
# Google Cloud App Engine configuration
runtime: nodejs20
instance_class: F2
entrypoint: npm run start:prod

env_variables:
  NODE_ENV: "production"
  PORT: "8080"
```

## Error Handling Patterns

### Backend Error Handling
```typescript
// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### Frontend Error Handling
```typescript
// React Query error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['orders'],
  queryFn: fetchOrders,
  retry: 3,
  onError: (error) => {
    toast.error('Failed to load orders');
    console.error('Order fetch error:', error);
  },
});
```

## Security Patterns

### Authentication Pattern
```typescript
// JWT token management
const authService = {
  login: async (credentials: LoginDto) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;
    
    // Store tokens securely
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    
    return response.data;
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },
};
```

### Authorization Pattern
```typescript
// Role-based access control
@Roles('admin')
@Controller('admin')
export class AdminController {
  // Admin-only endpoints
}

@Roles('partner')
@Controller('partner')
export class PartnerController {
  // Partner-only endpoints
}
```

## Testing Patterns

### Backend Testing
```typescript
// Jest with supertest for API testing
describe('OrderController', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('/orders (GET) should return orders', () => {
    return request(app.getHttpServer())
      .get('/api/orders')
      .expect(200);
  });
});
```

### Frontend Testing
```typescript
// React Testing Library for component testing
describe('OrderCard', () => {
  it('renders order information correctly', () => {
    const order = mockOrder();
    
    render(<OrderCard order={order} />);
    
    expect(screen.getByText(order.title)).toBeInTheDocument();
    expect(screen.getByText(order.description)).toBeInTheDocument();
  });
});
```

## Performance Patterns

### Caching Pattern
```typescript
// React Query for data caching
const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### Lazy Loading Pattern
```typescript
// Code splitting and lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Orders = lazy(() => import('./pages/Orders'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  </Suspense>
);
```

## Communication Patterns

### Real-Time Updates
```typescript
// WebSocket for real-time order updates
const useOrderUpdates = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    const socket = io(config.apiBaseUrl);
    
    socket.emit('join-order', orderId);
    socket.on('order-updated', (updatedOrder) => {
      setOrder(updatedOrder);
    });
    
    return () => socket.disconnect();
  }, [orderId]);
  
  return order;
};
```

### Notification Pattern
```typescript
// Push notifications for mobile apps
const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    });
  }, []);
  
  return { expoPushToken };
};
```

---

*This document defines the technical patterns and architectural decisions used throughout the project. All new code should follow these established patterns.* 