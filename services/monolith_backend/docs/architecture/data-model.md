# Data Model Architecture

## Overview
This document outlines the data model architecture for the TiffinMate application. The data model is designed to efficiently support the core business operations of connecting food providers with customers seeking authentic home-cooked meals.

## Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│    User     │     │   Business   │     │     Menu      │
├─────────────┤     ├──────────────┤     ├───────────────┤
│ id          │     │ id           │     │ id            │
│ email       │     │ name         │     │ businessId    │
│ password    │     │ description  │     │ name          │
│ firstName   │     │ ownerId      │◄────┤ description   │
│ lastName    │     │ address      │     │ isActive      │
│ phone       │     │ logo         │     │ createdAt     │
│ role        │     │ coverImage   │     │ updatedAt     │
│ createdAt   │◄────┤ isVerified   │     └───────┬───────┘
│ updatedAt   │     │ createdAt    │             │
└─────────────┘     │ updatedAt    │             │
      ▲             └──────────────┘             │
      │                                          │
      │                                          ▼
┌─────┴───────┐     ┌──────────────┐     ┌───────────────┐
│   Address   │     │    Order     │     │  MenuItem     │
├─────────────┤     ├──────────────┤     ├───────────────┤
│ id          │     │ id           │     │ id            │
│ userId      │     │ customerId   │     │ menuId        │
│ street      │     │ businessId   │     │ name          │
│ city        │     │ status       │     │ description   │
│ state       │     │ totalAmount  │     │ price         │
│ zipCode     │     │ paymentStatus│     │ imageUrl      │
│ country     │     │ createdAt    │     │ isVegetarian  │
│ isDefault   │     │ updatedAt    │     │ isVegan       │
│ createdAt   │     └──────┬───────┘     │ isGlutenFree  │
│ updatedAt   │            │             │ isActive      │
└─────────────┘            │             │ createdAt     │
                           │             │ updatedAt     │
                           ▼             └───────────────┘
                  ┌──────────────┐              ▲
                  │  OrderItem   │              │
                  ├──────────────┤              │
                  │ id           │              │
                  │ orderId      ├──────────────┘
                  │ menuItemId   │
                  │ quantity     │
                  │ price        │
                  │ createdAt    │
                  │ updatedAt    │
                  └──────────────┘
```

## Core Entities

### User
The central entity representing all users of the system, including customers, business owners, and administrators.

```typescript
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

  @OneToMany(() => Business, business => business.owner)
  businesses: Business[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### Business
Represents food providers on the platform. Each business is owned by a user and can offer multiple menus.

```typescript
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, user => user.businesses)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Menu, menu => menu.business)
  menus: Menu[];

  @OneToMany(() => Order, order => order.business)
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### Menu
A collection of menu items offered by a business. Businesses can have multiple menus (e.g. lunch, dinner, seasonal).

```typescript
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Business, business => business.menus)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  businessId: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => MenuItem, menuItem => menuItem.menu)
  menuItems: MenuItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### MenuItem
Individual food items that customers can order. Each menu item contains details about the dish, including price and dietary information.

```typescript
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isVegetarian: boolean;

  @Column({ default: false })
  isVegan: boolean;

  @Column({ default: false })
  isGlutenFree: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Menu, menu => menu.menuItems)
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @Column()
  menuId: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.menuItem)
  orderItems: OrderItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### Order
Represents a customer's food order from a business. Each order contains one or more order items.

```typescript
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column()
  customerId: string;

  @ManyToOne(() => Business, business => business.orders)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  businessId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus: PaymentStatus;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### OrderItem
Associates menu items with orders and specifies the quantity ordered. Also captures the price at the time of order.

```typescript
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => MenuItem, menuItem => menuItem.orderItems)
  @JoinColumn({ name: 'menuItemId' })
  menuItem: MenuItem;

  @Column()
  menuItemId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### Address
Stores user addresses, primarily for delivery locations.

```typescript
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.addresses)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

## Enumerations

### UserRole
```typescript
export enum UserRole {
  CUSTOMER = 'customer',
  BUSINESS = 'business',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

### OrderStatus
```typescript
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
```

### PaymentStatus
```typescript
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}
```

## Database Design Principles

### Normalization
The data model follows the principles of normalization to:
- Eliminate redundancy
- Ensure data integrity
- Reduce the risk of anomalies during data operations

### Indexing Strategy
- Primary keys are automatically indexed
- Foreign keys are indexed to optimize joins
- Additional indexes on frequently queried fields:
  - User.email
  - Business.ownerId
  - Order.customerId and Order.businessId

### Soft Deletion
For entities where historical data is important, soft deletion is implemented:
- Records are marked as deleted rather than physically removed
- A `deletedAt` timestamp indicates when the record was soft-deleted

### Data Types and Constraints
- Appropriate data types chosen for each field to optimize storage
- Constraints applied to enforce data integrity:
  - NOT NULL constraints where appropriate
  - Unique constraints for email addresses and other unique identifiers
  - Check constraints for enums and other validated fields

## Database Migration Strategy

### Versioned Migrations
- All database schema changes are managed through versioned migrations
- TypeORM migration tools are used to create and run migrations
- Each migration has an up and down method for applying and rolling back changes

### Migration Workflow
1. Generate migration from entity changes or write manual migrations
2. Review migrations for correctness
3. Apply migrations in development
4. Test thoroughly
5. Apply migrations in staging and production environments

### Example Migration
```typescript
export class CreateUserTable1622548937425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true
          },
          {
            name: 'password',
            type: 'varchar'
          },
          // ... other columns
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
```

## Performance Considerations

### Query Optimization
- Appropriate indexes for frequent query patterns
- Eager loading vs. lazy loading strategies
- Pagination for large result sets

### Caching Strategy
- Redis used for:
  - Frequently accessed, relatively static data
  - Session storage
  - Rate limiting counters
- Cache invalidation triggers defined for data updates

### Sharding and Partitioning
For future scalability, the following strategies are planned:
- Vertical partitioning for large tables
- Sharding by geographic region as user base grows
- Time-based partitioning for historical data

## Data Access Patterns

### Repository Pattern
TypeORM repositories provide a clean abstraction for data access:
- Standard CRUD operations
- Custom query methods
- Transaction management

### Example Repository
```typescript
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.create(userData);
    return this.save(user);
  }
}
```

### Data Transfer Objects (DTOs)
- Used to validate input data
- Define the shape of data crossing API boundaries
- Implement transformation between entity and API response

## Data Integrity and Validation

### Entity-level Validation
- Class-validator decorators used on entity properties
- Ensures data meets requirements before reaching the database

### Business Logic Validation
- Service-layer validation for complex business rules
- Cross-entity validation logic

### Transaction Management
- ACID transactions for operations affecting multiple entities
- Pessimistic locking for critical operations

## Future Extensions
The data model is designed to accommodate future features:
- Review and rating system
- Subscription-based ordering
- Loyalty/rewards program
- Advanced analytics and reporting 