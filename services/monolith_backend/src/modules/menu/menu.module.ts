import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { MenuItem, MenuItemSchema } from "./schemas/menu-item.schema";
import { Category, CategorySchema } from "./schemas/category.schema";
import { Menu, MenuSchema } from "./schemas/menu.schema";
import { PartnerModule } from "../partner/partner.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Menu.name, schema: MenuSchema },
    ]),
    forwardRef(() => PartnerModule),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
