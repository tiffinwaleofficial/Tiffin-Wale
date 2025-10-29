import { Module } from "@nestjs/common";
import { SuperAdminController } from "./super-admin.controller";
import { SuperAdminService } from "./super-admin.service";
import { PartnerModule } from "../partner/partner.module";
import { CustomerModule } from "../customer/customer.module";
import { OrderModule } from "../order/order.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { SubscriptionPlanModule } from "../subscription-plan/subscription-plan.module";
import { SupportModule } from "../support/support.module";
import { MenuModule } from "../menu/menu.module";

@Module({
  imports: [
    PartnerModule,
    CustomerModule,
    OrderModule,
    SubscriptionModule,
    SubscriptionPlanModule,
    SupportModule,
    MenuModule,
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
