# Modular Architecture Design

## Overview
The TiffinMate backend follows a modular monolith architecture, which provides a balance between the simplicity of a monolithic application and the separation of concerns found in microservices. This document outlines the key principles and implementation of our modular design.

## Key Principles

### Domain-Driven Modules
Each module represents a specific business domain:
- **Auth Module**: Authentication and authorization
- **User Module**: User management and profiles
- **Order Module**: Order processing and tracking
- **Menu Module**: Food items and categories
- **Admin Module**: Administration functionality
- **Partner Module**: Business partner operations
- **Payment Module**: Payment processing
- **Notification Module**: Real-time notifications

### Clear Module Boundaries
- Each module encapsulates its own:
  - Database schemas
  - Business logic
  - API endpoints
  - DTOs and validation
- Modules interact through well-defined interfaces

### Single Responsibility
Each module follows the Single Responsibility Principle by handling a specific domain concern.

## Directory Structure

The modular architecture is reflected in the project structure:

```
monolith_backend/
└── src/
    ├── modules/           # Feature modules
    │   ├── auth/          # Authentication and authorization
    │   ├── user/          # User management
    │   ├── order/         # Order management
    │   ├── menu/          # Menu management
    │   ├── admin/         # Admin features
    │   ├── partner/       # Business partner features
    │   ├── payment/       # Payment processing
    │   ├── notification/  # Notifications and real-time updates
    ├── common/            # Shared utilities
    │   ├── interfaces/    # Shared interfaces
    │   ├── decorators/    # Custom decorators
    │   ├── filters/       # Exception filters
    │   ├── guards/        # Authorization guards
    │   └── pipes/         # Validation pipes
    ├── config/            # App configuration
    ├── main.ts            # Application entry point
    └── app.module.ts      # Root module
```

## Module Implementation Pattern

Each module follows a consistent implementation pattern:

### Module Definition
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entity.name, schema: EntitySchema }]),
    // Other module dependencies
  ],
  controllers: [EntityController],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
```

### Standard Components
1. **Module Class**: Defines imports, controllers, providers, and exports
2. **Controllers**: Handle HTTP requests and responses
3. **Services**: Implement business logic and data access
4. **Schemas**: Define database models
5. **DTOs**: Data transfer objects for validation and transformation
6. **Interfaces**: Define public contracts

## Module Interaction Patterns

### Direct Service Injection
Used when one module needs functionality from another.

```typescript
@Injectable()
export class OrderService {
  constructor(
    private userService: UserService,
    private menuService: MenuService,
  ) {}
  
  async createOrder(orderData) {
    const user = await this.userService.findById(orderData.userId);
    const menuItems = await this.menuService.findItemsByIds(orderData.itemIds);
    // Process order
  }
}
```

### Event-Based Communication
For loose coupling between modules.

```typescript
// In OrderService
async changeOrderStatus(orderId, status) {
  // Update order status
  this.eventEmitter.emit('order.status_changed', { orderId, status });
}

// In NotificationService
@OnEvent('order.status_changed')
handleOrderStatusChange(payload) {
  this.notifyUser(payload.orderId, payload.status);
}
```

## Shared Resources

### Common Interfaces
Located in the `common/interfaces` directory, these define contracts shared across modules.

```typescript
// common/interfaces/user.interface.ts
export enum UserRole {
  CUSTOMER = 'customer',
  BUSINESS = 'business',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  // ...other properties
}
```

### Shared Guards and Decorators
Located in the `common` directory, these provide cross-cutting concerns like authentication and authorization.

```typescript
// common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) return true;
    
    const user = context.switchToHttp().getRequest().user;
    return roles.includes(user.role);
  }
}
```

## Benefits of This Architecture

### Immediate Benefits
- **Simplicity**: Single codebase, deployment, and database
- **Development Speed**: Faster iterations with less overhead
- **Team Collaboration**: Easier to maintain cohesive development
- **Resource Efficiency**: Lower operational overhead

### Future Scalability
- **Microservices Ready**: Modules can be extracted into microservices when needed
- **Independent Scaling**: High-load modules can be extracted first
- **Progressive Transition**: Allows for incremental migration path

## Transitioning to Microservices

When the application needs to scale specific components, the modular design facilitates extraction:

1. **Extract Module**: Move the module to its own repository and codebase
2. **API Gateway**: Introduce an API gateway for request routing
3. **Service Registry**: Implement service discovery
4. **Message Broker**: Replace direct imports with message-based communication

The well-defined boundaries between modules make this transition smoother than refactoring a traditional monolith. 