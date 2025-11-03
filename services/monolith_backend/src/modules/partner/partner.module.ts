import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { Partner, PartnerSchema } from "./schemas/partner.schema";
import { MenuModule } from "../menu/menu.module";
import { FeedbackModule } from "../feedback/feedback.module";
import { OrderModule } from "../order/order.module";
import { UserModule } from "../user/user.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { CustomerModule } from "../customer/customer.module";
import { MenuItem, MenuItemSchema } from "../menu/schemas/menu-item.schema";
import { Feedback, FeedbackSchema } from "../feedback/schemas/feedback.schema";
import { Order, OrderSchema } from "../order/schemas/order.schema";
import { EmailModule } from "../email/email.module";
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from "../subscription/schemas/subscription-plan.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Partner.name, schema: PartnerSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Order.name, schema: OrderSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    forwardRef(() => MenuModule),
    FeedbackModule,
    forwardRef(() => OrderModule),
    UserModule,
    forwardRef(() => SubscriptionModule),
    forwardRef(() => CustomerModule),
    EmailModule,
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
