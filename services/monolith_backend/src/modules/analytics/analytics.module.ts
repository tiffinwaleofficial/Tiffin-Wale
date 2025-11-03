import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import {
  Subscription,
  SubscriptionSchema,
} from "../subscription/schemas/subscription.schema";
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from "../subscription/schemas/subscription-plan.schema";
import { Order, OrderSchema } from "../order/schemas/order.schema";
import { SubscriptionModule } from "../subscription/subscription.module";
import { PartnerModule } from "../partner/partner.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    SubscriptionModule,
    PartnerModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
