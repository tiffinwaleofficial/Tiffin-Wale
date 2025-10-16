<!-- 99b3be0d-8b13-426a-9c32-ebe0b92a02e3 eb495e9b-e294-4a2c-8b1e-ab88539f0396 -->
# Comprehensive Email Service Implementation Plan

## Architecture Overview

Create a enterprise-grade email service module integrated into the existing NestJS monolith backend with the following components:

### Core Structure

```
monolith_backend/src/modules/email/
├── email.module.ts           # Main email module
├── email.service.ts          # Core email service
├── template.service.ts       # HTML template manager
├── email.controller.ts       # Email management endpoints
├── schemas/
│   ├── email-log.schema.ts   # Email delivery tracking
│   └── email-preference.schema.ts # User email preferences
├── dto/
│   ├── send-email.dto.ts     # Email sending DTOs
│   └── email-preference.dto.ts
├── templates/
│   ├── partials/
│   │   ├── header.html       # Reusable header with Tiffin-Wale branding
│   │   ├── footer.html       # Reusable footer
│   │   └── button.html       # Reusable CTA buttons
│   ├── auth/
│   │   ├── welcome.html      # Welcome email for new users
│   │   ├── password-reset.html
│   │   └── email-verification.html
│   ├── orders/
│   │   ├── order-confirmation.html
│   │   ├── order-preparing.html
│   │   ├── order-ready.html
│   │   └── order-delivered.html
│   ├── subscriptions/
│   │   ├── subscription-created.html
│   │   ├── subscription-renewed.html
│   │   ├── subscription-expiring.html
│   │   └── subscription-cancelled.html
│   ├── partners/
│   │   ├── partner-welcome.html
│   │   ├── new-order-notification.html
│   │   └── earnings-summary.html
│   └── payments/
│       ├── payment-success.html
│       ├── payment-failed.html
│       └── refund-processed.html
└── interfaces/
    └── email.interface.ts    # Email service interfaces
```

## Core Features

### 1. Advanced Template System

- **Partial Support**: Reusable header, footer, and component templates
- **Dynamic Content**: Variable substitution with `{{variable}}` syntax
- **Conditional Rendering**: `{{#if condition}}` blocks for dynamic content
- **Loops**: `{{#each items}}` for rendering lists (order items, menu items)
- **Nested Data**: Support for complex object structures
- **Brand Consistency**: Tiffin-Wale colors (#FF6B35, #2E8B57), logo, and styling

### 2. Email Types & Templates

#### Authentication Emails

- Welcome email with platform introduction and next steps
- Password reset with secure token links
- Email verification for new accounts
- Account activation notifications

#### Order Management Emails

- Order confirmation with itemized details and delivery info
- Order status updates (preparing, ready, out for delivery)
- Delivery confirmation with rating request
- Order cancellation notifications

#### Subscription Emails

- Subscription creation confirmation
- Renewal notifications and receipts
- Expiration warnings (7 days, 1 day before)
- Subscription modification confirmations
- Cancellation confirmations with feedback request

#### Partner Communications

- Partner welcome and onboarding guide
- New order notifications with customer details
- Daily/weekly earnings summaries
- Performance insights and tips

#### Payment & Billing

- Payment success confirmations
- Payment failure notifications with retry options
- Refund processing notifications
- Invoice generation for partners

### 3. Database Integration

#### Email Logging Schema

```typescript
@Schema({ timestamps: true })
export class EmailLog {
  @Prop({ required: true })
  to: string;
  
  @Prop({ required: true })
  subject: string;
  
  @Prop({ required: true })
  template: string;
  
  @Prop({ type: Object })
  templateData: Record<string, any>;
  
  @Prop({ enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'] })
  status: string;
  
  @Prop()
  resendId: string;
  
  @Prop()
  errorMessage: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;
}
```

#### Email Preferences Schema

```typescript
@Schema({ timestamps: true })
export class EmailPreference {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;
  
  @Prop({ default: true })
  orderUpdates: boolean;
  
  @Prop({ default: true })
  subscriptionNotifications: boolean;
  
  @Prop({ default: false })
  marketingEmails: boolean;
  
  @Prop({ default: true })
  securityAlerts: boolean;
}
```

### 4. Service Architecture

#### Email Service Methods

- `sendWelcomeEmail(userId, userData)`
- `sendOrderConfirmation(orderId, orderData)`
- `sendSubscriptionRenewal(subscriptionId, subscriptionData)`
- `sendPartnerEarningsSummary(partnerId, earningsData)`
- `sendBulkEmails(emailList, template, data)` for marketing
- `resendFailedEmails()` for retry mechanism

#### Template Service Features

- Template caching for performance
- Variable validation and sanitization
- Conditional logic processing
- Partial template compilation
- Error handling for missing variables

### 5. Integration Points

#### Module Integration

- **Auth Module**: Welcome, password reset, email verification
- **Order Module**: Order status updates, confirmations
- **Subscription Module**: Subscription lifecycle emails
- **Partner Module**: Partner notifications and summaries
- **Payment Module**: Payment confirmations and failures
- **Admin Module**: System notifications and reports

#### Event-Driven Architecture

```typescript
// Event emitters for automatic email triggers
@Injectable()
export class EmailEventService {
  @OnEvent('user.registered')
  async handleUserRegistered(payload: UserRegisteredEvent) {
    await this.emailService.sendWelcomeEmail(payload.userId, payload.userData);
  }
  
  @OnEvent('order.confirmed')
  async handleOrderConfirmed(payload: OrderConfirmedEvent) {
    await this.emailService.sendOrderConfirmation(payload.orderId, payload.orderData);
  }
}
```

## Technical Implementation

### 1. Environment Configuration

```env
# Email Service Configuration
RESEND_API_KEY="re_your_api_key_here"
FROM_EMAIL="Tiffin-Wale <noreply@tiffin-wale.com>"
FROM_NAME="Tiffin-Wale"
APP_URL="https://tiffin-wale.com"
SUPPORT_EMAIL="support@tiffin-wale.com"

# Email Feature Flags
EMAIL_ENABLED=true
EMAIL_TRACKING_ENABLED=true
EMAIL_RETRY_ENABLED=true
EMAIL_QUEUE_ENABLED=false  # For future Bull queue integration
```

### 2. Template System Features

#### Advanced Template Engine

- Handlebars-like syntax for complex logic
- Support for helpers and custom functions
- Template inheritance and composition
- Automatic HTML minification
- CSS inlining for email compatibility

#### Responsive Design

- Mobile-first email templates
- Dark mode support detection
- Cross-client compatibility (Gmail, Outlook, Apple Mail)
- Accessibility features (alt text, proper contrast)

### 3. Performance & Reliability

#### Caching Strategy

- Template compilation caching
- Partial template caching
- Redis integration for distributed caching (future)

#### Error Handling & Retry

- Exponential backoff for failed sends
- Dead letter queue for persistent failures
- Detailed error logging and monitoring
- Webhook handling for delivery status updates

#### Rate Limiting

- Resend API rate limit compliance
- Batch sending for bulk emails
- Queue management for high-volume periods

### 4. Monitoring & Analytics

#### Email Metrics Tracking

- Delivery rates and bounce tracking
- Open rate tracking (pixel-based)
- Click-through rate monitoring
- Template performance analytics

#### Admin Dashboard Integration

- Email sending statistics
- Template usage analytics
- Failed email management
- User email preference management

## Scalability Considerations

### 1. Free Tier Optimization

- **Resend Free Tier**: 3,000 emails/month, 100 emails/day
- Smart email prioritization (transactional > marketing)
- Email preference management to reduce volume
- Template optimization for size and performance

### 2. Future Scaling Options

- Bull queue integration for background processing
- Multiple email provider fallback (SendGrid, Mailgun)
- Email template A/B testing framework
- Advanced segmentation and personalization

### 3. Database Optimization

- Email log archiving strategy
- Indexed queries for performance
- Aggregation pipelines for analytics
- Data retention policies

## Security & Compliance

### 1. Data Protection

- Email content encryption for sensitive data
- PII handling in templates
- Secure token generation for links
- GDPR compliance for email preferences

### 2. Anti-Spam Measures

- SPF, DKIM, DMARC configuration guidance
- Unsubscribe link management
- Bounce handling and list cleaning
- Rate limiting and abuse prevention

## Implementation Timeline

### Phase 1: Core Infrastructure (Week 1)

- Email module setup and basic service
- Template engine implementation
- Database schemas and migrations
- Basic email types (welcome, password reset)

### Phase 2: Business Logic Integration (Week 2)

- Order and subscription email flows
- Partner notification system
- Event-driven email triggers
- Email preference management

### Phase 3: Advanced Features (Week 3)

- Template optimization and caching
- Email tracking and analytics
- Admin dashboard integration
- Error handling and retry mechanisms

### Phase 4: Testing & Optimization (Week 4)

- Comprehensive testing across email clients
- Performance optimization
- Documentation and deployment
- Monitoring and alerting setup

### To-dos

- [ ] Create the email module structure with NestJS module, services, and DTOs
- [ ] Build the template manager service with partial support and variable injection
- [ ] Design and implement HTML email templates with Tiffin-Wale branding
- [ ] Create the main email service with Resend integration and specific email methods
- [ ] Implement advanced CSS styling, responsive design, and component system
- [ ] Add email service calls to AuthService, OrderService, and other relevant modules
- [ ] Implement comprehensive error handling, logging, and retry logic
- [ ] Build preview endpoints and testing utilities for development