import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionPlanService } from "./subscription-plan.service";
import { SubscriptionPlanController } from "./subscription-plan.controller";
import {
  Subscription,
  SubscriptionSchema,
} from "./schemas/subscription.schema";
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from "./schemas/subscription-plan.schema";
import { EmailModule } from "../email/email.module";
import { OrderModule } from "../order/order.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    EmailModule,
    OrderModule,
  ],
  controllers: [SubscriptionController, SubscriptionPlanController],
  providers: [SubscriptionService, SubscriptionPlanService],
  exports: [SubscriptionService, SubscriptionPlanService, MongooseModule],
})
export class SubscriptionModule {}
