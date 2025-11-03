<!-- 648c2a1d-4a5b-4429-a1ee-ac5da35e249b e6e3a85c-4696-4ddf-b642-92c4224b479f -->
# Dedicated Cron Job Service Implementation Plan

## Overview

Create a **separate, standalone NestJS service** in `/services/cron-jobs/` that can be deployed independently from the monolith backend. This service will handle all automated scheduled tasks and can be hosted on separate servers. Initially, set up basic NestJS structure that just starts successfully, with comprehensive documentation for future developers.

## Current State Analysis

### Existing Cron Jobs in Monolith Backend (To Be Removed)

**File: `services/monolith_backend/src/modules/notifications/notifications.service.ts`**

- Line 285: `@Cron(CronExpression.EVERY_MINUTE)` - `processScheduledNotifications()`
- Line 308: `@Cron(CronExpression.EVERY_DAY_AT_9AM)` - `sendDailyMealReminders()` (placeholder)
- Line 315: `@Cron(CronExpression.EVERY_DAY_AT_6PM)` - `sendEveningPromotions()` (placeholder)

**File: `services/monolith_backend/src/modules/redis/redis-health.service.ts`**

- Line 172: `@Cron(CronExpression.EVERY_30_SECONDS)` - `performHealthChecks()`

**File: `services/monolith_backend/src/modules/redis/redis-analytics.service.ts`**

- Line 349: `@Cron(CronExpression.EVERY_MINUTE)` - `collectMetrics()`

### Planned Cron Jobs (14 Total - For Future Implementation)

**High Priority:**

1. Order auto-cancellation (pending >30min)
2. Subscription expiration check
3. Subscription auto-renewal
4. Subscription order generation (daily)
5. Password reset token cleanup
6. Review reminder notifications

**Medium Priority:**

7. Notification cleanup
8. Email queue cleanup
9. Analytics aggregation
10. Old order archiving

**Additional:**

11. Scheduled notifications processor (migrated)
12. Daily meal reminders (migrated)
13. Evening promotions (migrated)
14. Cache refresh operations

## Phase 1: Create Standalone Cron Job Service

### Directory Structure

```
services/cron-jobs/
├── src/
│   ├── main.ts                          # NestJS bootstrap
│   ├── app.module.ts                    # Root module
│   ├── config/
│   │   ├── cron.config.ts               # ROOT-LEVEL CENTRAL CONFIG
│   │   ├── database.config.ts           # MongoDB connection config
│   │   └── app.config.ts                # App configuration
│   ├── jobs/                            # Empty initially (structure for future)
│   │   ├── base/
│   │   │   └── base-cron-job.ts         # Base class template
│   │   └── README.md                    # How to add new jobs
│   ├── common/
│   │   ├── logger/
│   │   │   └── logger.service.ts        # Centralized logging
│   │   └── interfaces/
│   │       └── cron-job.interface.ts    # Job interface
│   ├── database/
│   │   └── database.module.ts           # MongoDB connection module
│   └── health/
│       └── health.controller.ts         # Health check endpoint
├── memory-bank/                         # Documentation folder
│   ├── README.md                        # Memory bank overview
│   ├── cron-job-plan.md                 # Complete 14-job plan with details
│   ├── architecture.md                  # Service architecture design
│   └── integration-guide.md             # Developer implementation guide
├── .env.example                         # Environment variables template
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md                            # Project README
```

### Step 1.1: Initialize NestJS Project

**File: `services/cron-jobs/package.json`**

- Install core dependencies: @nestjs/core, @nestjs/common, @nestjs/schedule, @nestjs/config, @nestjs/platform-express
- Install mongoose for database access
- Install winston for logging
- Add scripts: start, start:dev, build

**File: `services/cron-jobs/nest-cli.json`**

- Standard NestJS CLI configuration

**File: `services/cron-jobs/tsconfig.json`**

- TypeScript configuration matching monolith backend style

### Step 1.2: Root-Level Central Cron Configuration

**File: `src/config/cron.config.ts`** (CRITICAL - as requested)

Central configuration file where ALL cron schedules and settings can be changed easily:

```typescript
export const cronConfig = {
  // Global toggle
  enabled: process.env.CRON_SERVICE_ENABLED !== 'false',
  
  // Individual job configurations
  jobs: {
    orderAutoCancellation: {
      enabled: true,
      schedule: process.env.ORDER_CANCEL_SCHEDULE || '*/5 * * * *', // Every 5 min
      timeout: 300000,
      settings: {
        cancelAfterMinutes: 30,
        sendNotification: true,
      }
    },
    subscriptionExpiration: {
      enabled: true,
      schedule: process.env.SUB_EXPIRATION_SCHEDULE || '0 0 * * *', // Daily midnight
      // ...
    },
    // ... all 14 jobs with their configurations
  }
};
```

### Step 1.3: Basic NestJS Application Setup

**File: `src/main.ts`**

- Bootstrap NestJS application
- Setup logging
- Basic error handling
- Health check endpoint

**File: `src/app.module.ts`**

- Import ScheduleModule.forRoot()
- Import ConfigModule
- Import HealthController
- Minimal setup - just gets service running

**File: `src/health/health.controller.ts`**

- GET /health endpoint
- Returns service status

### Step 1.4: Memory Bank Documentation

**File: `memory-bank/README.md`**

- Overview of cron job service purpose
- Architecture summary
- Quick links to other docs

**File: `memory-bank/cron-job-plan.md`**

- Complete detailed plan for all 14 cron jobs
- Each job includes:
  - Purpose and description
  - Schedule recommendation
  - Dependencies required
  - Implementation steps
  - Integration points with monolith

**File: `memory-bank/architecture.md`**

- Service architecture
- How it connects to monolith (database vs API)
- Configuration strategy
- Deployment considerations

**File: `memory-bank/integration-guide.md`**

- Step-by-step guide for developers
- How to add new cron jobs
- How to modify existing jobs
- Testing procedures
- Deployment instructions
- Usage of central config file

## Phase 2: Remove Existing Cron Code from Monolith

### Step 2.1: Remove Cron Decorators from notifications.service.ts

- Remove `@Cron(CronExpression.EVERY_MINUTE)` decorator (line 285)
- Remove `@Cron(CronExpression.EVERY_DAY_AT_9AM)` decorator (line 308)
- Remove `@Cron(CronExpression.EVERY_DAY_AT_6PM)` decorator (line 315)
- **Keep method implementations** (they'll be used by cron service later)

### Step 2.2: Remove Cron Decorators from redis-health.service.ts

- Remove `@Cron(CronExpression.EVERY_30_SECONDS)` decorator (line 172)
- **Keep method implementation**

### Step 2.3: Remove Cron Decorators from redis-analytics.service.ts

- Remove `@Cron(CronExpression.EVERY_MINUTE)` decorator (line 349)
- **Keep method implementation**

### Step 2.4: Clean Up ScheduleModule Imports

- Check `notifications.module.ts` - remove ScheduleModule if only used for cron
- Keep ScheduleModule in redis.module.ts (system-level monitoring can stay)
- Verify no broken imports

## Phase 3: Verification & Completion

### Step 3.1: Verify Cron Service Starts

- Run `npm run start:dev` in cron-jobs service
- Verify service starts without errors
- Test health endpoint: GET /health
- Verify logging works

### Step 3.2: Verify Monolith Still Works

- Run monolith backend
- Verify no import errors
- Verify removed cron methods are still accessible (not called automatically)

### Step 3.3: Documentation Complete

- All memory-bank files created
- README files complete
- Configuration file structure documented
- Integration guide ready for developers

## Success Criteria

1. ✅ Standalone cron service in `/services/cron-jobs/` that starts successfully
2. ✅ All existing cron decorators removed from monolith backend
3. ✅ Memory-bank folder with complete documentation
4. ✅ Root-level central config file (`src/config/cron.config.ts`) created
5. ✅ Basic NestJS structure ready for developers to add jobs
6. ✅ No actual cron jobs implemented yet (just structure)

## Next Steps (For Future Developers)

1. Read `memory-bank/integration-guide.md`
2. Review `memory-bank/cron-job-plan.md` for job requirements
3. Start implementing cron jobs one by one following the guide
4. Use central `cron.config.ts` for all configurations
5. Follow patterns documented in `jobs/README.md`

## Key Files to Create

1. `services/cron-jobs/src/config/cron.config.ts` - **ROOT-LEVEL CENTRAL CONFIG**
2. `services/cron-jobs/memory-bank/cron-job-plan.md` - Complete job plan
3. `services/cron-jobs/memory-bank/integration-guide.md` - Developer guide
4. `services/cron-jobs/memory-bank/architecture.md` - Architecture docs
5. Basic NestJS structure (main.ts, app.module.ts, etc.)

## Key Files to Modify (Remove Cron Code)

1. `services/monolith_backend/src/modules/notifications/notifications.service.ts`
2. `services/monolith_backend/src/modules/redis/redis-health.service.ts`
3. `services/monolith_backend/src/modules/redis/redis-analytics.service.ts`
4. `services/monolith_backend/src/modules/notifications/notifications.module.ts`

### To-dos

- [ ] Analyze entire backend structure and identify all cron job requirements
- [ ] Create CronJobModule with basic structure (module, service, controller)
- [ ] Implement order-related cron jobs (auto-cancellation, archiving)
- [ ] Implement subscription cron jobs (expiration, renewal, order generation)
- [ ] Implement cleanup cron jobs (tokens, notifications, emails, orders)
- [ ] Implement notification cron jobs (review reminders, meal reminders, promotions)
- [ ] Implement analytics aggregation cron job
- [ ] Migrate existing cron jobs from notifications.service.ts to cron-job.service.ts
- [ ] Add cron job configuration to config/config.ts with all settings
- [ ] Import CronJobModule in AppModule and remove duplicate cron decorators
- [ ] Add comprehensive error handling, logging, and monitoring for all cron jobs
- [ ] Create unit tests and integration tests for cron job service