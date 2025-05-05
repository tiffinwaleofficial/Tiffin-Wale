import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MealController } from "./meal.controller";
import { MealService } from "./meal.service";
import { Meal, MealSchema } from "./schemas/meal.schema";
import { MenuModule } from "../menu/menu.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meal.name, schema: MealSchema },
    ]),
    MenuModule,
    UserModule,
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {} 