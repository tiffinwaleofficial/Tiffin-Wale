<!-- 0d628ad0-590b-40da-b6eb-072cbe84b942 19de44c0-7fc5-412a-868b-69c73714437c -->
# Plan: Enhanced Revenue, Profile & Configuration Features

## Objective

Enhance the Super Admin web app with:

1. **Comprehensive Revenue Page** - Extensive financial metrics with mobile-friendly dropdown navigation
2. **My Profile Section** - Profile management with user invitation/access control
3. **Configuration Panel** - Feature toggles, cron job control, and critical command execution

---

## 1. Enhanced Revenue Page

### 1.1 Additional Financial Metrics to Add

**New Metrics Cards (8-12 total):**

- Gross Revenue (total orders)
- Net Revenue (after commissions)
- Commission Collected
- Refunds & Cancellations
- Average Transaction Value
- Revenue per Partner
- Revenue per Customer
- Growth Rate (%)
- Profit Margin
- Operating Costs
- Tax Deductions
- Cash Flow

### 1.2 Enhanced Data Sections

**Additional Charts/Analytics:**

- Daily/Weekly/Monthly revenue comparison
- Revenue by partner (top 20 with drill-down)
- Revenue by customer segment
- Revenue by time period (hourly breakdown for today)
- Refund trends
- Commission breakdown
- Cash vs Digital payments
- Subscription vs One-time revenue split
- Revenue forecasting (predictive chart)

### 1.3 Mobile Dropdown Navigation

**For Mobile Screens (< 768px):**

- Replace horizontal tabs with dropdown select
- Add "View Metrics" dropdown at top with categories:
- Overview
- Revenue Analytics
- Payouts Management
- Partner Performance
- Transaction History
- Payment Methods
- Financial Reports

### 1.4 Real API Integrations Needed

- `GET /api/super-admin/revenue/stats` - Already integrated
- `GET /api/super-admin/payouts` - **NEED TO INTEGRATE** ⚠️
- `GET /api/super-admin/payouts/:id` - **NEED TO INTEGRATE** ⚠️
- `PATCH /api/super-admin/payouts/:id/status` - **NEED TO INTEGRATE** ⚠️
- `GET /api/super-admin/analytics/revenue-history` - Already integrated
- `GET /api/super-admin/analytics/earnings` - Available but not used
- `GET /api/super-admin/payments/dashboard` - **NEW** - Payment metrics
- `GET /api/super-admin/payments/history` - **NEW** - Transaction history

**File:** `interface/super-admin/src/pages/Revenue.js`

---

## 2. My Profile Section

### 2.1 Profile Page Structure

**New File:** `interface/super-admin/src/pages/Profile.js`

**Sections:**

1. **Personal Information**

- Name, Email, Phone
- Profile Picture (upload/change)
- Change Password
- Two-Factor Authentication toggle

2. **Account Settings**

- Email preferences
- Notification settings
- Language/Timezone
- Theme preference (dark/light)

3. **User Access Management**

- List of invited/active admin users
- Invite new admin user (email, role, permissions)
- Revoke access / Delete user
- View user activity logs

### 2.2 APIs Needed

- `GET /api/super-admin/users` - List all admin users
- `GET /api/super-admin/users/:id` - Get user profile
- `PATCH /api/super-admin/users/:id` - Update user profile
- `POST /api/super-admin/users` - **NEED BACKEND ENDPOINT** - Create/invite user
- `POST /api/auth/change-password` - Change password
- `GET /api/super-admin/users/:id/activity` - **NEW** - User activity logs

**File:** `interface/super-admin/src/pages/Profile.js`

---

## 3. Configuration Panel

### 3.1 Configuration Page Structure

**New File:** `interface/super-admin/src/pages/Configuration.js`

**Tabs/Sections:**

#### 3.1.1 Feature Flags Tab

**Toggle Switches for:**

- Payments (enable/disable payment processing)
- Referrals (enable/disable referral program)
- Subscriptions (enable/disable subscription plans)
- Notifications (enable/disable notification system)
- Chat Support (enable/disable chat feature)
- Reviews/Ratings (enable/disable reviews)
- Email Notifications (enable/disable email system)
- Push Notifications (enable/disable push)

#### 3.1.2 Cron Jobs Management Tab

**Cron Job Controls:**
Based on backend cron jobs found:

- **Notification Processing** (`@Cron(EVERY_MINUTE)`) - Process pending notifications
- **Daily Morning Notifications** (`@Cron(EVERY_DAY_AT_9AM)`) - Morning reminders
- **Daily Evening Notifications** (`@Cron(EVERY_DAY_AT_6PM)`) - Evening reminders
- **Redis Health Check** (`@Cron(EVERY_30_SECONDS)`) - Redis monitoring
- **Redis Analytics** (`@Cron(EVERY_MINUTE)`) - Analytics aggregation

**For each cron:**

- Enable/Disable toggle
- Last run timestamp
- Next run timestamp
- Run count
- "Run Now" button (trigger manually)

#### 3.1.3 System Configuration Tab

**Settings:**

- Platform Name
- Default Commission Rate (%)
- Minimum Order Amount
- Delivery Fee
- Currency
- Timezone
- Maintenance Mode toggle
- Debug Mode toggle

#### 3.1.4 Critical Commands Tab

**Command Buttons:**

- Clear Redis Cache
- Refresh System Stats
- Regenerate API Keys
- Clear Old Logs
- Backup Database (trigger)
- Restore Database (with file upload)
- Reset Partner Ratings
- Recalculate Revenue Stats

### 3.2 APIs Needed

- `GET /api/super-admin/system/config` - Get current config
- `PATCH /api/super-admin/system/config` - Update config
- `GET /api/super-admin/system/stats` - System statistics
- `POST /api/super-admin/system/cron/:cronName/trigger` - **NEW** - Trigger cron manually
- `PATCH /api/super-admin/system/cron/:cronName/status` - **NEW** - Enable/disable cron
- `GET /api/super-admin/system/crons` - **NEW** - List all crons with status
- `POST /api/super-admin/system/commands/:command` - **NEW** - Execute critical command

**File:** `interface/super-admin/src/pages/Configuration.js`

---

## 4. Navigation & Routing Updates

### 4.1 Update App.js

**Add new routes:**

- `/profile` - Profile page
- `/configuration` - Configuration page

**File:** `interface/super-admin/src/App.js`

### 4.2 Update Layout.js

**Add navigation items:**

- Profile (user icon, dropdown or direct link)
- Configuration (settings icon)

**File:** `interface/super-admin/src/components/Layout.js`

---

## 5. Backend Enhancements Needed

### 5.1 User Invitation System

**New Endpoint:**

- `POST /api/super-admin/users/invite` - Invite user with email
- Body: `{ email, role, permissions }`
- Response: `{ invitationToken, invitationLink }`

**Service Method:**

- `inviteUser(email, role, permissions)` - Create invitation token and send email

### 5.2 Cron Job Management

**New Endpoints:**

- `GET /api/super-admin/system/crons` - List all cron jobs with status
- `GET /api/super-admin/system/crons/:name` - Get cron job details
- `PATCH /api/super-admin/system/crons/:name/status` - Enable/disable cron
- `POST /api/super-admin/system/crons/:name/trigger` - Trigger cron manually

**Service Methods:**

- `getAllCrons()` - List crons with metadata
- `updateCronStatus(name, enabled)` - Enable/disable
- `triggerCron(name)` - Execute manually

### 5.3 Critical Commands

**New Endpoint:**

- `POST /api/super-admin/system/commands/:command` - Execute system command
- Commands: `clear-cache`, `backup-db`, `clear-logs`, `recalculate-stats`, etc.
- Body: `{ params?: object }` (optional command parameters)

**Service Method:**

- `executeCommand(command, params)` - Execute with validation and logging

### 5.4 Enhanced Revenue APIs

**Enhance existing:**

- `GET /api/super-admin/revenue/stats` - Add more metrics:
- grossRevenue, netRevenue, refunds, taxDeductions, profitMargin, etc.

---

## 6. Implementation Files

### Frontend Files to Create/Update

1. `interface/super-admin/src/pages/Revenue.js` - **UPDATE** - Add more metrics & mobile dropdowns
2. `interface/super-admin/src/pages/Profile.js` - **CREATE** - New profile page
3. `interface/super-admin/src/pages/Configuration.js` - **CREATE** - New config page
4. `interface/super-admin/src/components/Layout.js` - **UPDATE** - Add navigation
5. `interface/super-admin/src/App.js` - **UPDATE** - Add routes

### Backend Files to Create/Update

1. `services/monolith_backend/src/modules/super-admin/super-admin.controller.ts` - **ADD** - Cron & command endpoints
2. `services/monolith_backend/src/modules/super-admin/super-admin.service.ts` - **ADD** - Cron & command methods
3. `services/monolith_backend/src/modules/super-admin/dto/invite-user.dto.ts` - **CREATE** - DTO for user invitation
4. `services/monolith_backend/src/modules/super-admin/dto/update-cron-status.dto.ts` - **CREATE** - DTO for cron status

---

## 7. Priority Implementation Order

### Phase 1: Revenue Enhancements (High Priority)

1. Integrate payouts APIs (`GET /payouts`, `PATCH /payouts/:id/status`)
2. Add mobile dropdown navigation
3. Add 8-12 additional financial metric cards
4. Add payment dashboard integration
5. Add transaction history table

### Phase 2: Profile Management (Medium Priority)

1. Create Profile page
2. Integrate user management APIs
3. Add profile picture upload
4. Add password change functionality
5. Add user invitation form (if backend ready)

### Phase 3: Configuration Panel (Medium Priority)

1. Create Configuration page
2. Integrate system config APIs
3. Add feature flag toggles
4. Add cron job management (if backend ready)
5. Add critical commands (if backend ready)

---

## 8. Design Considerations

### Mobile-First Approach

- All dropdowns should work on mobile (< 768px)
- Tabs should collapse into accordion/dropdown on mobile
- Metric cards should stack vertically on mobile
- Tables should have horizontal scroll on mobile

### Theme Support

- All new pages must support dark/light mode
- Use Shadcn UI components consistently
- Add Aceternity UI animations for key interactions

### User Experience

- Loading states for all API calls
- Error handling with toast notifications
- Confirmation dialogs for critical actions
- Success feedback for all operations

---

## 9. Testing Checklist

- [ ] Revenue page displays all financial metrics correctly
- [ ] Mobile dropdown navigation works on all screen sizes
- [ ] Payouts tab fetches and displays real data
- [ ] Profile page loads current user data
- [ ] Profile updates save successfully
- [ ] User invitation form validates and submits
- [ ] Configuration page loads system config
- [ ] Feature toggles update backend correctly
- [ ] Cron job toggles work (if backend implemented)
- [ ] Critical commands execute safely (if backend implemented)

---

**Estimated Implementation Time:**

- Revenue Enhancements: 4-6 hours
- Profile Management: 3-4 hours
- Configuration Panel: 4-5 hours
- Backend Enhancements: 3-4 hours (if needed)

**Total: 14-19 hours**

### To-dos

- [ ] Integrate payouts APIs (GET /payouts, GET /payouts/:id, PATCH /payouts/:id/status) in Revenue page
- [ ] Add mobile dropdown navigation for Revenue page (replace tabs on mobile screens)
- [ ] Add 8-12 additional financial metric cards (Gross Revenue, Net Revenue, Commission Collected, Refunds, etc.)
- [ ] Integrate payment dashboard API and transaction history in Revenue page
- [ ] Create Profile.js page with personal information, account settings, and user access management sections
- [ ] Integrate user management APIs (GET /users, GET /users/:id, PATCH /users/:id) in Profile page
- [ ] Add profile picture upload, password change, and user invitation functionality
- [ ] Create Configuration.js page with Feature Flags, Cron Jobs, System Config, and Critical Commands tabs
- [ ] Integrate system config APIs (GET /system/config, PATCH /system/config, GET /system/stats)
- [ ] Add feature flag toggles, cron job management, and critical command buttons
- [ ] Update Layout.js to add Profile and Configuration navigation items
- [ ] Update App.js to add /profile and /configuration routes
- [ ] Add POST /super-admin/users/invite endpoint for user invitations (if needed)
- [ ] Add cron job management endpoints (GET /system/crons, PATCH /system/crons/:name/status, POST /system/crons/:name/trigger) (if needed)
- [ ] Add critical commands endpoint (POST /system/commands/:command) (if needed)