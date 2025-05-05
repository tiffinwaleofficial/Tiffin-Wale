import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { MenuItem, MenuItemSchema } from "./schemas/menu-item.schema";
import { Category, CategorySchema } from "./schemas/category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
