import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SuperAdminController } from "./super-admin.controller";
import { SuperAdminService } from "./super-admin.service";
import { PartnerModule } from "../partner/partner.module";
import { CustomerModule } from "../customer/customer.module";
import { OrderModule } from "../order/order.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { SubscriptionPlanModule } from "../subscription-plan/subscription-plan.module";
import { SupportModule } from "../support/support.module";
import { MenuModule } from "../menu/menu.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { FeedbackModule } from "../feedback/feedback.module";
import { PaymentModule } from "../payment/payment.module";
import { UserModule } from "../user/user.module";
import { AdminModule } from "../admin/admin.module";
import { SystemModule } from "../system/system.module";
import { RedisModule } from "../redis/redis.module";
import { Payment, PaymentSchema } from "../payment/schemas/payment.schema";
import { Partner, PartnerSchema } from "../partner/schemas/partner.schema";
import { CronPreference, CronPreferenceSchema } from "./schemas/cron-preference.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Partner.name, schema: PartnerSchema },
      { name: CronPreference.name, schema: CronPreferenceSchema },
    ]),
    PartnerModule,
    CustomerModule,
    OrderModule,
    SubscriptionModule,
    SubscriptionPlanModule,
    SupportModule,
    MenuModule,
    NotificationsModule,
    FeedbackModule,
    PaymentModule,
    UserModule,
    AdminModule,
    SystemModule,
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
