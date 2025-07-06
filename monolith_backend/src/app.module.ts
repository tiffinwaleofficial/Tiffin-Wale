import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";

// Module imports
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { OrderModule } from "./modules/order/order.module";
import { MenuModule } from "./modules/menu/menu.module";
import { AdminModule } from "./modules/admin/admin.module";
import { PartnerModule } from "./modules/partner/partner.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { SystemModule } from "./modules/system/system.module";
import { LandingModule } from "./modules/landing/landing.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { MarketingModule } from "./modules/marketing/marketing.module";
import { MealModule } from "./modules/meal/meal.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { SupportModule } from "./modules/support/support.module";
import { UploadModule } from "./modules/upload/upload.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database
    DatabaseModule.forRoot(),

    // Application modules
    AuthModule,
    UserModule,
    OrderModule,
    MenuModule,
    AdminModule,
    PartnerModule,
    PaymentModule,
    NotificationModule,
    CustomerModule,
    SystemModule,
    LandingModule,
    FeedbackModule,
    MarketingModule,
    MealModule,
    SubscriptionModule,
    AnalyticsModule,
    SupportModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
