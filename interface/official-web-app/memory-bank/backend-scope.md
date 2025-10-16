# Backend Development Scope - Official Web App

## 🎯 Scope Overview

The Backend scope encompasses server-side development for the TiffinWale Official Web Application, including Express.js API routes, NestJS backend integration, WebSocket handling, form processing, and server-side utilities.

## 📁 File Structure & Organization

### Core Directories
```
server/
├── index.ts              # Main server entry point
├── routes.ts             # Route registration and NestJS integration
├── vite.ts               # Vite development server integration
├── storage.ts            # Local storage utilities (fallback)
└── server/               # Additional server modules
    ├── index.ts          # Server configuration
    ├── routes.ts         # Enhanced API route definitions with NestJS integration
    ├── storage.ts        # Storage service
    └── vite.ts           # Vite integration
```

### Key Files
- `server/index.ts` - Express server setup and configuration
- `server/routes.ts` - API route definitions with NestJS backend integration
- `server/vite.ts` - Development server integration
- `server/storage.ts` - Local storage utilities (fallback when NestJS unavailable)
- `config/environment.ts` - Environment configuration management

## 🏗️ Server Architecture

### Express.js Application Structure
```typescript
// Main server setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware chain
app.use(loggingMiddleware);
app.use(corsMiddleware);
app.use('/api', apiRoutes);
app.use(staticFileServing);
```

### Server Configuration
**Port**: 5000 (consistent across environments)
**Environment Detection**: Development vs Production
**Static File Serving**: Production build files
**API Proxy**: Backend service integration

## 🛣️ API Routes & Endpoints

### Route Structure (`server/routes.ts`)
```typescript
// API route registration with NestJS backend integration
export async function registerRoutes(app: Express): Promise<Server> => {
  // Create HTTP server with WebSocket support
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Contact form endpoint - forwards to NestJS backend
  app.post('/api/contact', async (req, res) => {
    // Validates with Zod schema
    // Forwards to NestJS backend at /landing/contact
    // Falls back to local storage if backend unavailable
  });
  
  // Testimonial endpoints
  app.post('/api/testimonial', async (req, res) => {
    // Forwards to NestJS backend at /testimonial
    // Falls back to local storage if backend unavailable
  });
  
  app.get('/api/testimonials', async (req, res) => {
    // Fetches from NestJS backend with pagination
    // Falls back to local data if backend unavailable
  });
  
  // Feedback endpoint
  app.post('/api/feedback', async (req, res) => {
    // Forwards to NestJS backend at /feedback
    // Falls back to local storage if backend unavailable
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TiffinWale API is running' });
  });
  
  return httpServer;
};
```

### API Endpoints

#### Contact Form (`POST /api/contact`)
**Purpose**: Handle contact form submissions with NestJS backend integration
**Request Body**:
```typescript
{
  name: string;        // min 2 characters
  email: string;       // valid email format
  message: string;     // min 10 characters
}
```
**Backend Integration**: Forwards to `POST /landing/contact` on NestJS backend
**Fallback**: Local storage if backend unavailable
**Response**: Success/error status with message

#### Testimonial Submission (`POST /api/testimonial`)
**Purpose**: Handle testimonial submissions
**Request Body**:
```typescript
{
  name: string;
  email: string;       // valid email format
  profession?: string;
  rating: number;      // 1-5 range
  testimonial: string; // max 1000 characters
  imageUrl?: string;
}
```
**Backend Integration**: Forwards to `POST /testimonial` on NestJS backend
**Fallback**: Local storage if backend unavailable

#### Testimonials Retrieval (`GET /api/testimonials`)
**Purpose**: Retrieve paginated testimonials from NestJS backend
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: 'createdAt')
- `sortOrder`: Sort direction 'asc' | 'desc' (default: 'desc')
**Backend Integration**: Fetches from NestJS backend with pagination
**Fallback**: Empty array with message if backend unavailable

#### Feedback (`POST /api/feedback`)
**Purpose**: Handle user feedback submissions
**Request Body**:
```typescript
{
  email: string;       // valid email format
  type: 'suggestion' | 'complaint' | 'question' | 'other';
  feedback: string;    // min 10 characters
  rating?: number;     // 1-5 range
}
```
**Backend Integration**: Forwards to `POST /feedback` on NestJS backend
**Fallback**: Local storage if backend unavailable

#### Health Check (`GET /api/health`)
**Purpose**: Server health monitoring
**Response**: `{ status: 'ok', message: 'TiffinWale API is running' }`

## 🔌 WebSocket Integration

### WebSocket Server Setup
**Purpose**: Real-time communication for notifications and updates
**Implementation**: Express server with WebSocket upgrade
**Connection Management**: Automatic reconnection with backoff

### WebSocket Events
```typescript
// Connection events
socket.on('connect', handleConnection);
socket.on('disconnect', handleDisconnection);
socket.on('message', handleMessage);

// Custom events
socket.emit('notification', notificationData);
socket.emit('status-update', statusData);
```

## 🗄️ Database Integration

### Database Connection (`db/index.ts`)
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// WebSocket configuration for Neon
neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

### Database Schema (`shared/schema.ts`)
```typescript
// User management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Form submissions (extensible)
export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'contact', 'corporate', 'testimonial'
  data: json("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Database Operations
- **Insert Operations**: Form submissions, user data
- **Query Operations**: Testimonials retrieval, user lookup
- **Migration Management**: Drizzle Kit for schema changes

## 📝 Form Processing

### Form Validation
**Client-Side**: Zod schema validation
**Server-Side**: Express validation middleware
**Database**: Schema constraints and validation

### Form Processing Flow
```typescript
// Generic form handler
const handleFormSubmission = async (req: Request, res: Response) => {
  try {
    // 1. Validate input data
    const validatedData = validateFormData(req.body);
    
    // 2. Process form data
    const result = await processFormData(validatedData);
    
    // 3. Store in database
    await storeFormSubmission(result);
    
    // 4. Send notifications
    await sendNotifications(result);
    
    // 5. Return success response
    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    // Error handling
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Form Types
1. **Contact Forms**: General inquiries and support
2. **Corporate Quotes**: B2B service requests
3. **Testimonials**: Customer feedback and reviews
4. **Feedback**: User suggestions and complaints

## 🔧 Middleware & Utilities

### Logging Middleware
**Purpose**: Request/response logging and monitoring
**Implementation**:
```typescript
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});
```

### Error Handling Middleware
**Purpose**: Centralized error handling and response formatting
**Implementation**:
```typescript
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ message });
  throw err; // Log error for monitoring
});
```

### CORS Configuration
**Purpose**: Cross-origin request handling
**Implementation**: Environment-based CORS settings
- **Development**: Permissive CORS for local development
- **Production**: Restricted CORS for security

## 📁 Local Storage & Fallback System

### Storage Service (`server/storage.ts`)
**Purpose**: In-memory storage for fallback when NestJS backend is unavailable
**Implementation**:
```typescript
// Placeholder storage arrays
const contacts: any[] = [];
const testimonials: any[] = [];
const feedback: any[] = [];

export const storage = {
  // Contact methods
  addContact: (contact: any) => {
    const newContact = {
      id: Date.now().toString(),
      ...contact,
      timestamp: new Date().toISOString()
    };
    contacts.push(newContact);
    return newContact;
  },
  getContacts: () => [...contacts],
  
  // Testimonial methods
  addTestimonial: (testimonial: any) => {
    const newTestimonial = {
      id: Date.now().toString(),
      ...testimonial,
      timestamp: new Date().toISOString()
    };
    testimonials.push(newTestimonial);
    return newTestimonial;
  },
  getTestimonials: () => [...testimonials],
  
  // Feedback methods
  addFeedback: (feedbackItem: any) => {
    const newFeedback = {
      id: Date.now().toString(),
      ...feedbackItem,
      timestamp: new Date().toISOString()
    };
    feedback.push(newFeedback);
    return newFeedback;
  },
  getFeedback: () => [...feedback]
};
```

### Fallback Strategy Implementation
**When NestJS Backend is Unavailable**:
1. **Contact Forms**: Store in local `contacts` array
2. **Testimonials**: Store in local `testimonials` array  
3. **Feedback**: Store in local `feedback` array
4. **WebSocket Broadcasting**: Still broadcasts to connected clients
5. **Response**: Returns success with fallback note

**Benefits**:
- **Service Continuity**: Application remains functional
- **Data Preservation**: No data loss during backend outages
- **User Experience**: Seamless operation for end users
- **Monitoring**: Clear logging of fallback usage

## 🔐 Security Implementation

### Input Validation
**Client-Side**: Zod schema validation
**Server-Side**: Express validation middleware
**Database**: Schema constraints

### Security Headers
```typescript
// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'origin-when-cross-origin');
  next();
});
```

### Rate Limiting
**Purpose**: Prevent abuse and ensure service availability
**Implementation**: Express rate limiting middleware
**Configuration**: Per-endpoint rate limits

## 🚀 Development Server

### Vite Integration (`server/vite.ts`)
**Purpose**: Development server with hot module replacement
**Features**:
- **Hot Module Replacement**: Instant code updates
- **Proxy Configuration**: API request proxying
- **Static File Serving**: Development asset serving

### Development Workflow
```typescript
// Development server setup
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}
```

## 🧪 Testing Strategy

### Testing Tools
- **Jest**: Unit testing framework
- **Supertest**: HTTP assertion library
- **Node.js Test Runner**: Built-in testing

### Testing Patterns
```typescript
// API endpoint testing
import request from 'supertest';
import app from '../server';

test('POST /api/contact', async () => {
  const response = await request(app)
    .post('/api/contact')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });
  
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});
```

### Test Categories
1. **Unit Tests**: Individual function testing
2. **Integration Tests**: API endpoint testing
3. **Database Tests**: Data operation testing
4. **WebSocket Tests**: Real-time communication testing

## 📊 Monitoring & Logging

### Request Logging
**Purpose**: API request monitoring and debugging
**Implementation**: Custom middleware for request/response logging
**Log Format**: `METHOD /path STATUS_CODE in DURATIONms`

### Error Monitoring
**Purpose**: Error tracking and alerting
**Implementation**: Centralized error handling with logging
**Integration**: External monitoring services

### Performance Monitoring
**Purpose**: Response time and throughput monitoring
**Metrics**: Request duration, error rates, throughput

## 🔗 NestJS Backend Integration

### Backend Service Configuration
**Environment Variables**:
```typescript
const BACKEND_API_URL = getEnv('BACKEND_API_URL', 'http://localhost:3000');
const BACKEND_API_KEY = getEnv('BACKEND_API_KEY', '');
const BACKEND_API_SECRET = getEnv('BACKEND_API_SECRET', '');
```

### Authentication Token Management
```typescript
// Cached authentication token
let authTokenCache = {
  token: '',
  expiresAt: 0, // Unix timestamp for expiry
};

// Function to get authentication token from backend
async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  const now = Date.now() / 1000;
  if (authTokenCache.token && authTokenCache.expiresAt > now + 60) {
    return authTokenCache.token;
  }

  // Request new token from auth endpoint
  const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: BACKEND_API_KEY,
      apiSecret: BACKEND_API_SECRET,
    }),
  });

  const data = await response.json();
  authTokenCache = {
    token: data.access_token,
    expiresAt: data.expires_in ? (now + data.expires_in) : (now + 3600),
  };
  
  return authTokenCache.token;
}
```

### Backend API Endpoints Integration
1. **Contact Forms**: `POST /landing/contact`
2. **Testimonials**: `POST /testimonial`, `GET /testimonials`
3. **Feedback**: `POST /feedback`
4. **Authentication**: `POST /auth/login`

### Fallback Strategy
**Purpose**: Ensure service availability when NestJS backend is unavailable
**Implementation**:
- **Primary**: Forward requests to NestJS backend
- **Fallback**: Process locally with in-memory storage
- **Broadcasting**: WebSocket notifications for both scenarios
- **Logging**: Comprehensive error logging and monitoring

## 🌍 Environment Configuration

### Environment Management (`config/environment.ts`)
```typescript
interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
}

export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),
  environment: getEnvironment(),
};
```

### Environment Detection
```typescript
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const apiUrl = getApiBaseUrl();
  
  if (apiUrl.includes('127.0.0.1') || apiUrl.includes('localhost')) {
    return 'development';
  }
  
  if (apiUrl.includes('staging') || apiUrl.includes('dev')) {
    return 'staging';
  }
  
  return 'production';
};
```

### Environment Variables
```bash
# Backend Integration
BACKEND_API_URL=http://localhost:3000
BACKEND_API_KEY=your_api_key
BACKEND_API_SECRET=your_api_secret

# Frontend API Configuration
API_BASE_URL=https://api.tiffin-wale.com

# Cloudinary (Optional)
VITE_CLOUDINARY_CLOUD_NAME=tiffinwale
VITE_CLOUDINARY_API_KEY=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## 🚀 Deployment

### Build Process
**Command**: `npm run build:server`
**Output**: `dist/index.js`
**Features**: TypeScript compilation, bundling, optimization

### Deployment Platforms
1. **Vercel**: Serverless function deployment
2. **Google Cloud**: App Engine deployment
3. **Docker**: Containerized deployment

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database Connections**: Connection pooling and optimization
- **Error Handling**: Graceful error responses
- **Monitoring**: Health checks and logging

## 🔧 Development Tools

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build:server

# Start production server
npm run start

# Database operations
npm run db:push
npm run db:seed
```

### Code Quality
- **TypeScript**: Type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

---

*This scope covers all backend development aspects of the Official Web App. For frontend integration, refer to the frontend-scope.md documentation.*

