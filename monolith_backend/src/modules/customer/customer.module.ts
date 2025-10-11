import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import {
  DeliveryAddress,
  DeliveryAddressSchema,
} from "./schemas/delivery-address.schema";
import { UserModule } from "../user/user.module";
import { OrderModule } from "../order/order.module";
import { SubscriptionModule } from "../subscription/subscription.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryAddress.name, schema: DeliveryAddressSchema },
    ]),
    UserModule,
    OrderModule,
    SubscriptionModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
