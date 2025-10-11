# TiffinMate Monolith Backend - Architecture & Patterns

## 🏗️ Core Architecture Patterns

### 1. **Modular Monolith Pattern**
```
monolith_backend/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── user/          # User management
│   │   ├── order/         # Order processing
│   │   ├── menu/          # Menu management
│   │   ├── payment/       # Payment processing
│   │   └── ...           # Other modules
│   ├── common/            # Shared utilities
│   │   ├── decorators/    # Custom decorators
│   │   ├── guards/        # Route guards
│   │   ├── filters/       # Exception filters
│   │   └── interfaces/    # Shared interfaces
│   ├── config/            # Configuration
│   ├── database/          # Database setup
│   └── main.ts           # Application entry point
```

### 2. **NestJS Module Pattern**
Each feature follows a consistent module structure:

```typescript
@Module({
  imports: [
    // Dependencies
    MongooseModule.forFeature([{ name: 'Entity', schema: EntitySchema }]),
    // Other modules
  ],
  controllers: [EntityController],
  providers: [EntityService],
  exports: [EntityService], // For other modules to use
})
export class EntityModule {}
```

**Module Dependencies:**
- `AuthModule` → All other modules (authentication required)
- `UserModule` → `AuthModule` (user management)
- `OrderModule` → `UserModule`, `MenuModule`, `PaymentModule`
- `PaymentModule` → `OrderModule` (payment processing)
- `NotificationModule` → All modules (real-time updates)

### 3. **Controller-Service Pattern**
Clean separation between HTTP handling and business logic:

```typescript
// Controller: HTTP request/response handling
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user._id);
  }
}

// Service: Business logic implementation
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly paymentService: PaymentService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Business logic here
    const order = new this.orderModel({
      ...createOrderDto,
      userId,
      status: 'pending',
    });
    return order.save();
  }
}
```

### 4. **MongoDB Schema Pattern**
Consistent schema design with Mongoose:

```typescript
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  restaurantId: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true, enum: OrderStatus })
  status: OrderStatus;

  @Prop({ required: true })
  totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
```

### 5. **DTO Validation Pattern**
Request/response validation with class-validator:

```typescript
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsOptional()
  specialInstructions?: string;
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsArray()
  @IsOptional()
  customizations?: string[];
}
```

### 6. **Authentication Pattern**
JWT-based authentication with role-based access control:

```typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// Role-based Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

## 🔄 Data Flow Architecture

### **Request Processing Flow**
```
HTTP Request → Controller → Guard → DTO Validation → Service → Database → Response
```

### **Authentication Flow**
```
Login Request → AuthService → JWT Generation → Token Storage → API Calls → Token Validation
```

### **Real-time Updates Flow**
```
Database Change → WebSocket Gateway → Client Notification → UI Update
```

## 🎨 Design Patterns

### 1. **Repository Pattern**
Data access abstraction:

```typescript
@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).exec();
  }

  async findByIdAndUpdate(id: string, update: Partial<Order>): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }
}
```

### 2. **Factory Pattern**
Object creation abstraction:

```typescript
@Injectable()
export class PaymentFactory {
  createPaymentProcessor(type: PaymentType): PaymentProcessor {
    switch (type) {
      case PaymentType.RAZORPAY:
        return new RazorpayProcessor();
      case PaymentType.STRIPE:
        return new StripeProcessor();
      default:
        throw new Error(`Unsupported payment type: ${type}`);
    }
  }
}
```

### 3. **Observer Pattern**
Event-driven architecture:

```typescript
@Injectable()
export class OrderService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {}

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.updateOrder(orderId, { status });
    
    // Emit event for other services to react
    this.eventEmitter.emit('order.status.changed', {
      orderId,
      status,
      userId: order.userId,
    });
  }
}

@OnEvent('order.status.changed')
async handleOrderStatusChanged(payload: OrderStatusChangedEvent) {
  await this.notificationService.sendOrderUpdateNotification(payload);
}
```

### 4. **Strategy Pattern**
Algorithm selection:

```typescript
interface PricingStrategy {
  calculatePrice(basePrice: number, context: any): number;
}

@Injectable()
export class SubscriptionPricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number, context: { subscriptionType: string }): number {
    switch (context.subscriptionType) {
      case 'monthly':
        return basePrice * 0.9; // 10% discount
      case 'yearly':
        return basePrice * 0.8; // 20% discount
      default:
        return basePrice;
    }
  }
}
```

## 🔧 Utility Patterns

### 1. **Configuration Pattern**
Environment-based configuration:

```typescript
export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION || '1d',
}));
```

### 2. **Error Handling Pattern**
Centralized error management:

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    this.logger.error(`${request.method} ${request.url}`, errorResponse);
    response.status(status).json(errorResponse);
  }
}
```

### 3. **Validation Pattern**
Comprehensive input validation:

```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsPhoneNumber('IN')
  @IsOptional()
  phoneNumber?: string;
}
```

## 🚀 Performance Patterns

### 1. **Caching Pattern**
Redis-based caching:

```typescript
@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<Menu>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getMenuByRestaurant(restaurantId: string): Promise<Menu> {
    const cacheKey = `menu:${restaurantId}`;
    let menu = await this.cacheManager.get<Menu>(cacheKey);
    
    if (!menu) {
      menu = await this.menuModel.findOne({ restaurantId }).exec();
      await this.cacheManager.set(cacheKey, menu, 300); // 5 minutes
    }
    
    return menu;
  }
}
```

### 2. **Pagination Pattern**
Efficient data pagination:

```typescript
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

@Injectable()
export class OrderService {
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Order>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel.find().skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments().exec(),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
```

### 3. **Database Optimization Pattern**
Efficient queries with proper indexing:

```typescript
// Schema with indexes
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  restaurantId: string;

  @Prop({ required: true, index: true })
  status: OrderStatus;

  @Prop({ required: true, index: true })
  createdAt: Date;
}

// Compound indexes
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ restaurantId: 1, createdAt: -1 });
```

## 🔐 Security Patterns

### 1. **Input Sanitization Pattern**
Comprehensive input cleaning:

```typescript
@Injectable()
export class SanitizationService {
  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  sanitizeObject(obj: any): any {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
```

### 2. **Rate Limiting Pattern**
API protection:

```typescript
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requests = new Map<string, number[]>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100;

    const userRequests = this.requests.get(ip) || [];
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }

    validRequests.push(now);
    this.requests.set(ip, validRequests);
    return true;
  }
}
```

## 📊 Monitoring Patterns

### 1. **Logging Pattern**
Structured logging with correlation IDs:

```typescript
@Injectable()
export class LoggingService {
  private readonly logger = new Logger();

  logRequest(request: Request, response: Response, next: NextFunction) {
    const correlationId = request.headers['x-correlation-id'] || uuidv4();
    request['correlationId'] = correlationId;
    
    this.logger.log({
      correlationId,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      timestamp: new Date().toISOString(),
    });
    
    next();
  }

  logError(error: Error, context: string, correlationId?: string) {
    this.logger.error({
      correlationId,
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 2. **Health Check Pattern**
System health monitoring:

```typescript
@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkExternalServices(),
      this.checkMemory(),
    ]);

    const isHealthy = checks.every(check => check.status === 'fulfilled');
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: checks.map((check, index) => ({
        name: ['database', 'external', 'memory'][index],
        status: check.status,
        details: check.status === 'fulfilled' ? check.value : check.reason,
      })),
    };
  }
}
```

## 🔄 Real-time Patterns

### 1. **WebSocket Gateway Pattern**
Real-time communication:

```typescript
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    return { event: 'joined-room', room };
  }

  @SubscribeMessage('send-notification')
  handleSendNotification(client: Socket, payload: NotificationPayload) {
    this.server.to(payload.room).emit('notification', payload);
  }

  // Server-side notification sending
  async sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }
}
```

### 2. **Event-Driven Pattern**
Loose coupling with events:

```typescript
@Injectable()
export class OrderService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = await this.saveOrder(orderData);
    
    // Emit events for other services
    this.eventEmitter.emit('order.created', {
      orderId: order._id,
      userId: order.userId,
      restaurantId: order.restaurantId,
    });
    
    return order;
  }
}

@OnEvent('order.created')
async handleOrderCreated(payload: OrderCreatedEvent) {
  // Send notification
  await this.notificationService.sendOrderConfirmation(payload);
  
  // Update restaurant dashboard
  await this.restaurantService.updateOrderCount(payload.restaurantId);
  
  // Trigger payment processing
  await this.paymentService.processPayment(payload.orderId);
}
```

## 🧪 Testing Patterns

### 1. **Unit Testing Pattern**
Isolated component testing:

```typescript
describe('OrderService', () => {
  let service: OrderService;
  let model: Model<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
  });

  it('should create an order', async () => {
    const createOrderDto = { restaurantId: '123', items: [] };
    const mockOrder = { _id: '456', ...createOrderDto };
    
    jest.spyOn(model, 'create').mockResolvedValue(mockOrder as any);
    
    const result = await service.create(createOrderDto, 'user123');
    expect(result).toEqual(mockOrder);
  });
});
```

### 2. **Integration Testing Pattern**
End-to-end API testing:

```typescript
describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = loginResponse.body.accessToken;
  });

  it('/orders (POST)', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        restaurantId: '123',
        items: [{ menuItemId: '456', quantity: 2 }],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.status).toBe('pending');
      });
  });
});
```

## 🎯 Pattern Benefits

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Modular architecture supports growth
3. **Testability**: Isolated components and services
4. **Performance**: Optimized queries and caching
5. **Security**: Comprehensive authentication and validation
6. **Developer Experience**: Type safety and clear patterns
7. **Reliability**: Error handling and monitoring
8. **Flexibility**: Easy to extend and modify

## 🔮 Future Pattern Considerations

1. **Microservices**: Split modules into separate services
2. **Event Sourcing**: Store events instead of state
3. **CQRS**: Separate read and write models
4. **GraphQL**: More flexible API queries
5. **Serverless**: Function-based architecture
6. **Container Orchestration**: Kubernetes deployment

---

**Last Updated**: January 2025  
**Version**: 1.0.0









