import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { User, UserSchema } from "../user/schemas/user.schema";
import { Order, OrderSchema } from "../order/schemas/order.schema";
import { MenuItem, MenuItemSchema } from "../menu/schemas/menu-item.schema";
import { Category, CategorySchema } from "../menu/schemas/category.schema";
import { Partner, PartnerSchema } from "../partner/schemas/partner.schema";
import {
  CustomerProfile,
  CustomerProfileSchema,
} from "../customer/schemas/customer-profile.schema";
import {
  Subscription,
  SubscriptionSchema,
} from "../subscription/schemas/subscription.schema";
import { Payment, PaymentSchema } from "../payment/schemas/payment.schema";
import { Feedback, FeedbackSchema } from "../feedback/schemas/feedback.schema";
import { Meal, MealSchema } from "../meal/schemas/meal.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Partner.name, schema: PartnerSchema },
      { name: CustomerProfile.name, schema: CustomerProfileSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Meal.name, schema: MealSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
