import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UserModule } from "../user/user.module";
import { OrderModule } from "../order/order.module";
import { MenuModule } from "../menu/menu.module";
import { PartnerModule } from "../partner/partner.module";
import { User, UserSchema } from "../user/schemas/user.schema";
import { Order, OrderSchema } from "../order/schemas/order.schema";
import { MenuItem, MenuItemSchema } from "../menu/schemas/menu-item.schema";
import { Category, CategorySchema } from "../menu/schemas/category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    UserModule,
    OrderModule,
    MenuModule,
    PartnerModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
