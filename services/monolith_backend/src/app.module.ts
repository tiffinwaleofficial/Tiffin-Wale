import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { emailConfig } from "./config/email.config";
import { AnalyticsMiddleware } from "./common/middleware/analytics.middleware";

// Module imports
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { OrderModule } from "./modules/order/order.module";
import { MenuModule } from "./modules/menu/menu.module";
import { AdminModule } from "./modules/admin/admin.module";
import { SuperAdminModule } from "./modules/super-admin/super-admin.module";
import { PartnerModule } from "./modules/partner/partner.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { SystemModule } from "./modules/system/system.module";
import { LandingModule } from "./modules/landing/landing.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { MarketingModule } from "./modules/marketing/marketing.module";
import { MealModule } from "./modules/meal/meal.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { SubscriptionPlanModule } from "./modules/subscription-plan/subscription-plan.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { SupportModule } from "./modules/support/support.module";
import { UploadModule } from "./modules/upload/upload.module";
import { SeederModule } from "./modules/seeder/seeder.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ReviewModule } from "./modules/review/review.module";
import { EmailModule } from "./modules/email/email.module";
import { RedisModule } from "./modules/redis/redis.module";
import { AIModule } from "./modules/ai/ai.module";
import { ReportModule } from "./modules/report/report.module";
import { IdempotencyModule } from "./modules/idempotency/idempotency.module";
import { IdempotencyMiddleware } from "./modules/idempotency/idempotency.middleware";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [emailConfig],
    }),

    // Database
    DatabaseModule.forRoot(),

    // Redis Cache
    RedisModule,

    // AI & Machine Learning
    AIModule,

    // Application modules
    AuthModule,
    UserModule,
    OrderModule,
    MenuModule,
    AdminModule,
    SuperAdminModule,
    PartnerModule,
    PaymentModule,
    NotificationsModule,
    CustomerModule,
    SystemModule,
    LandingModule,
    FeedbackModule,
    MarketingModule,
    MealModule,
    SubscriptionModule,
    SubscriptionPlanModule,
    AnalyticsModule,
    SupportModule,
    UploadModule,
    SeederModule,
    ChatModule,
    ReviewModule,
    EmailModule,
    ReportModule,
    IdempotencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply analytics middleware to all API routes
    consumer.apply(AnalyticsMiddleware).forRoutes("*");
    // Apply idempotency middleware after analytics (but before route handlers)
    // This ensures idempotency is checked for all routes
    consumer.apply(IdempotencyMiddleware).forRoutes("*");
  }
}
