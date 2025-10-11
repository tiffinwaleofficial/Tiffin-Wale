# Backend Scope Onboarding

## Quick Start for Backend Development

### 🎯 Scope Overview
You're working on the **NestJS monolith backend** that serves all interfaces (web, mobile, admin). The backend provides RESTful APIs with JWT authentication, MongoDB database, and real-time capabilities.

### 📁 Key Directories
```
monolith_backend/
├── src/
│   ├── modules/           # Feature modules (auth, order, user, etc.)
│   ├── common/            # Shared utilities, guards, filters
│   ├── config/            # Environment configuration
│   ├── database/          # Database connection and setup
│   └── main.ts           # Application entry point
├── tests/                 # Test files
└── docs/                 # API documentation
```

### 🚀 Quick Commands
```bash
# Start development server
pnpm run backend:dev

# Run tests
pnpm run backend:test

# Build for production
pnpm run backend:build

# Lint code
pnpm run backend:lint
```

### 🔧 Environment Setup
```env
# Required environment variables
MONGODB_URI=mongodb://localhost:27017/tiffin-wale
JWT_SECRET=your-jwt-secret
NODE_ENV=development
PORT=3001
API_PREFIX=api
```

### 📚 Key Concepts

#### Module Structure
Each module follows this pattern:
```typescript
@Module({
  imports: [MongooseModule.forFeature([Schema])],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
```

#### Authentication Pattern
```typescript
@UseGuards(JwtAuthGuard)
@Roles('customer', 'partner', 'admin')
@Controller('orders')
export class OrderController {
  // Protected endpoints
}
```

#### Database Pattern
```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop({ required: true })
  password: string;
}
```

### 🎯 Current Priorities
1. **Complete Order Module** - Real-time updates, payment integration
2. **Payment Module** - Payment gateway integration
3. **File Upload** - Image upload for menu items
4. **Real-time Features** - WebSocket implementation

### 🔍 API Documentation
- **Swagger UI**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/
- **API Base**: http://localhost:3001/api

### 🧪 Testing
```bash
# Run all tests
pnpm run backend:test

# Run specific test file
pnpm run backend:test -- order.service.spec.ts

# Run with coverage
pnpm run backend:test:cov
```

### 📝 Development Guidelines
1. **Follow NestJS patterns** - Use decorators, modules, services
2. **Implement proper validation** - Use DTOs with class-validator
3. **Add comprehensive tests** - Unit and integration tests
4. **Document APIs** - Use Swagger decorators
5. **Handle errors properly** - Use global exception filter

### 🔗 Related Scopes
- **Frontend**: Official web app consumes these APIs
- **Mobile**: Student and partner apps use these endpoints
- **Admin**: Super admin dashboard uses admin-specific APIs

### 🚨 Common Issues
1. **Database Connection**: Ensure MongoDB is running
2. **JWT Tokens**: Check token expiration and secret
3. **CORS**: Verify frontend domains are allowed
4. **Validation**: Ensure DTOs are properly decorated

### 📞 Quick Help
- **API Issues**: Check Swagger docs and error logs
- **Database Issues**: Verify MongoDB connection and schemas
- **Authentication**: Test with Postman or Swagger UI
- **Real-time**: Check WebSocket implementation status

---

**Remember**: This is a monolith serving multiple interfaces, so changes affect all clients. Test thoroughly and maintain backward compatibility. 