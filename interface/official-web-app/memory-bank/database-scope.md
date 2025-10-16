# Database & Schema Scope - Official Web App

## 🎯 Scope Overview

The Database scope encompasses database design, schema management, data operations, migrations, and database-related utilities for the TiffinWale Official Web Application.

## 🗄️ Database Architecture

### Database Technology Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Neon Serverless)                             │
│  ├── Primary Database                                      │
│  ├── ACID Compliance                                       │
│  ├── JSON Support                                          │
│  └── Full-Text Search                                      │
├─────────────────────────────────────────────────────────────┤
│  Drizzle ORM 0.38.4                                       │
│  ├── Type-Safe Queries                                    │
│  ├── Schema Management                                     │
│  ├── Migration System                                      │
│  └── Relationship Mapping                                  │
├─────────────────────────────────────────────────────────────┤
│  Drizzle Kit 0.31.0                                       │
│  ├── Migration Generation                                  │
│  ├── Schema Introspection                                  │
│  ├── Database Seeding                                      │
│  └── Development Tools                                     │
└─────────────────────────────────────────────────────────────┘
```

### Database Connection (`db/index.ts`)
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// WebSocket configuration for Neon
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

## 📋 Database Schema

### Schema Definition (`shared/schema.ts`)
```typescript
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User Management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form Submissions
export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'contact', 'corporate', 'testimonial', 'feedback'
  data: json("data").notNull(),
  status: text("status").default("pending"), // 'pending', 'processed', 'archived'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  profession: text("profession"),
  rating: integer("rating").notNull(),
  testimonial: text("testimonial").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Forms
export const contactForms = pgTable("contact_forms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  phoneNumber: text("phone_number"),
  subject: text("subject"),
  status: text("status").default("new"), // 'new', 'in_progress', 'resolved'
  createdAt: timestamp("created_at").defaultNow(),
});

// Corporate Quotes
export const corporateQuotes = pgTable("corporate_quotes", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  employeeCount: text("employee_count").notNull(),
  requirements: text("requirements"),
  status: text("status").default("pending"), // 'pending', 'quoted', 'won', 'lost'
  createdAt: timestamp("created_at").defaultNow(),
});

// Feedback Submissions
export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  type: text("type").notNull(), // 'suggestion', 'complaint', 'question', 'other'
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  category: text("category").notNull(), // 'app', 'website', 'service'
  rating: integer("rating"),
  deviceInfo: json("device_info"),
  status: text("status").default("new"), // 'new', 'reviewed', 'addressed'
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Schema Relationships
```typescript
// Define relationships between tables
export const usersRelations = relations(users, ({ many }) => ({
  formSubmissions: many(formSubmissions),
  testimonials: many(testimonials),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [formSubmissions.userId],
    references: [users.id],
  }),
}));
```

### Zod Validation Schemas
```typescript
// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  email: true,
  profession: true,
  rating: true,
  testimonial: true,
  imageUrl: true,
});

export const insertContactFormSchema = createInsertSchema(contactForms).pick({
  name: true,
  email: true,
  message: true,
  phoneNumber: true,
  subject: true,
});

// Type inference
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
```

## 🔧 Database Configuration

### Drizzle Configuration (`drizzle.config.ts`)
```typescript
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./db/migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
});
```

### Environment Configuration
```bash
# Database connection
DATABASE_URL=postgresql://username:password@host:port/database

# Development
DATABASE_URL=postgresql://localhost:5432/tiffinwale_dev

# Production
DATABASE_URL=postgresql://neon-serverless-connection-string
```

## 🚀 Database Operations

### CRUD Operations
```typescript
// Create operations
export const createUser = async (userData: InsertUser) => {
  return await db.insert(users).values(userData).returning();
};

export const createTestimonial = async (testimonialData: InsertTestimonial) => {
  return await db.insert(testimonials).values(testimonialData).returning();
};

export const createContactForm = async (contactData: InsertContactForm) => {
  return await db.insert(contactForms).values(contactData).returning();
};

// Read operations
export const getUsers = async () => {
  return await db.select().from(users);
};

export const getTestimonials = async (limit: number = 10, featured: boolean = false) => {
  return await db
    .select()
    .from(testimonials)
    .where(and(
      eq(testimonials.approved, true),
      featured ? eq(testimonials.featured, true) : undefined
    ))
    .limit(limit)
    .orderBy(desc(testimonials.createdAt));
};

export const getContactForms = async (status?: string) => {
  return await db
    .select()
    .from(contactForms)
    .where(status ? eq(contactForms.status, status) : undefined)
    .orderBy(desc(contactForms.createdAt));
};

// Update operations
export const updateTestimonialStatus = async (id: number, approved: boolean) => {
  return await db
    .update(testimonials)
    .set({ approved, updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();
};

export const updateContactFormStatus = async (id: number, status: string) => {
  return await db
    .update(contactForms)
    .set({ status, updatedAt: new Date() })
    .where(eq(contactForms.id, id))
    .returning();
};

// Delete operations
export const deleteUser = async (id: number) => {
  return await db.delete(users).where(eq(users.id, id)).returning();
};
```

### Complex Queries
```typescript
// Join queries
export const getTestimonialsWithUsers = async () => {
  return await db
    .select({
      testimonial: testimonials,
      user: users,
    })
    .from(testimonials)
    .leftJoin(users, eq(testimonials.userId, users.id))
    .where(eq(testimonials.approved, true));
};

// Aggregation queries
export const getTestimonialStats = async () => {
  return await db
    .select({
      total: count(testimonials.id),
      approved: count(testimonials.id, { distinct: true }),
      averageRating: avg(testimonials.rating),
    })
    .from(testimonials);
};

// Search queries
export const searchTestimonials = async (searchTerm: string) => {
  return await db
    .select()
    .from(testimonials)
    .where(
      or(
        ilike(testimonials.name, `%${searchTerm}%`),
        ilike(testimonials.testimonial, `%${searchTerm}%`),
        ilike(testimonials.profession, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(testimonials.createdAt));
};
```

## 🔄 Database Migrations

### Migration Management
```bash
# Generate migration
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Reset database
npm run db:reset
```

### Migration Files Structure
```
db/migrations/
├── 0001_initial_schema.sql
├── 0002_add_testimonials_table.sql
├── 0003_add_contact_forms_table.sql
└── 0004_add_corporate_quotes_table.sql
```

### Migration Example
```sql
-- 0001_initial_schema.sql
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profession" text,
	"rating" integer NOT NULL,
	"testimonial" text NOT NULL,
	"image_url" text,
	"featured" boolean DEFAULT false,
	"approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
```

## 🌱 Database Seeding

### Seed Data (`db/seed.ts`)
```typescript
import { db } from './index';
import { users, testimonials, contactForms } from '@shared/schema';

export const seedDatabase = async () => {
  // Seed users
  const seedUsers = await db.insert(users).values([
    {
      username: 'admin',
      email: 'admin@tiffinwale.com',
      password: 'hashed_password',
    },
    {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password',
    },
  ]).returning();

  // Seed testimonials
  const seedTestimonials = await db.insert(testimonials).values([
    {
      name: 'John Doe',
      email: 'john@example.com',
      profession: 'Software Engineer',
      rating: 5,
      testimonial: 'Amazing service! The food is always fresh and delicious.',
      featured: true,
      approved: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      profession: 'Marketing Manager',
      rating: 5,
      testimonial: 'TiffinWale has made my life so much easier. Highly recommended!',
      featured: true,
      approved: true,
    },
  ]).returning();

  // Seed contact forms
  const seedContactForms = await db.insert(contactForms).values([
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      message: 'I would like to know more about your corporate plans.',
      subject: 'Corporate Inquiry',
      status: 'new',
    },
  ]).returning();

  console.log('Database seeded successfully!');
  console.log('Users:', seedUsers.length);
  console.log('Testimonials:', seedTestimonials.length);
  console.log('Contact Forms:', seedContactForms.length);
};
```

### Seeding Commands
```bash
# Run seed script
npm run db:seed

# Reset and seed
npm run db:reset && npm run db:seed
```

## 🔍 Database Queries & Performance

### Query Optimization
```typescript
// Indexed queries
export const getTestimonialsByRating = async (minRating: number) => {
  return await db
    .select()
    .from(testimonials)
    .where(gte(testimonials.rating, minRating))
    .orderBy(desc(testimonials.rating));
};

// Paginated queries
export const getTestimonialsPaginated = async (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  
  return await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.approved, true))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(testimonials.createdAt));
};

// Transaction queries
export const createTestimonialWithUser = async (testimonialData: InsertTestimonial, userData: InsertUser) => {
  return await db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values(userData).returning();
    const [testimonial] = await tx.insert(testimonials).values({
      ...testimonialData,
      userId: user.id,
    }).returning();
    
    return { user, testimonial };
  });
};
```

### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_testimonials_approved ON testimonials(approved);
CREATE INDEX idx_testimonials_featured ON testimonials(featured);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);
CREATE INDEX idx_contact_forms_status ON contact_forms(status);
CREATE INDEX idx_corporate_quotes_status ON corporate_quotes(status);
CREATE INDEX idx_feedback_submissions_type ON feedback_submissions(type);

-- Composite indexes
CREATE INDEX idx_testimonials_approved_featured ON testimonials(approved, featured);
CREATE INDEX idx_form_submissions_type_status ON form_submissions(type, status);
```

## 🔒 Database Security

### Connection Security
```typescript
// Secure connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Data Validation
```typescript
// Input validation with Zod
export const validateTestimonialInput = (data: unknown) => {
  return insertTestimonialSchema.parse(data);
};

export const validateContactFormInput = (data: unknown) => {
  return insertContactFormSchema.parse(data);
};

// SQL injection prevention
export const getUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
};
```

### Access Control
```typescript
// Role-based access control
export const getTestimonialsForAdmin = async () => {
  return await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt));
};

export const getTestimonialsForPublic = async () => {
  return await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(desc(testimonials.createdAt));
};
```

## 📊 Database Monitoring

### Query Performance Monitoring
```typescript
// Query timing
export const timedQuery = async <T>(queryFn: () => Promise<T>, queryName: string): Promise<T> => {
  const start = Date.now();
  try {
    const result = await queryFn();
    const duration = Date.now() - start;
    console.log(`Query ${queryName} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`Query ${queryName} failed after ${duration}ms:`, error);
    throw error;
  }
};

// Usage example
export const getTestimonialsWithTiming = async () => {
  return await timedQuery(
    () => getTestimonials(10, true),
    'getTestimonials'
  );
};
```

### Database Health Checks
```typescript
// Health check query
export const checkDatabaseHealth = async (): Promise<{ status: string; message: string }> => {
  try {
    await db.select().from(users).limit(1);
    return { status: 'healthy', message: 'Database connection is working' };
  } catch (error) {
    return { status: 'unhealthy', message: `Database error: ${error.message}` };
  }
};
```

## 🧪 Database Testing

### Test Database Setup
```typescript
// Test database configuration
const testDb = drizzle({
  client: new Pool({ connectionString: process.env.TEST_DATABASE_URL }),
  schema,
});

// Test utilities
export const cleanupTestData = async () => {
  await testDb.delete(testimonials);
  await testDb.delete(contactForms);
  await testDb.delete(users);
};

export const setupTestData = async () => {
  await testDb.insert(users).values({
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashed_password',
  });
};
```

### Database Tests
```typescript
// Test examples
describe('Database Operations', () => {
  beforeEach(async () => {
    await cleanupTestData();
    await setupTestData();
  });

  test('should create testimonial', async () => {
    const testimonialData = {
      name: 'Test User',
      email: 'test@example.com',
      rating: 5,
      testimonial: 'Great service!',
    };

    const result = await createTestimonial(testimonialData);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test User');
  });

  test('should get approved testimonials only', async () => {
    const testimonials = await getTestimonials(10, false);
    expect(testimonials.every(t => t.approved)).toBe(true);
  });
});
```

## 🔄 Backup & Recovery

### Backup Strategy
```bash
# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backups (cron job)
0 2 * * * pg_dump $DATABASE_URL > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Recovery Procedures
```bash
# Restore from backup
psql $DATABASE_URL < backup_20240101_120000.sql

# Point-in-time recovery (Neon)
# Use Neon console for point-in-time recovery
```

---

*This scope covers all database and schema management aspects of the Official Web App. For API integration, refer to the backend-scope.md documentation.*

