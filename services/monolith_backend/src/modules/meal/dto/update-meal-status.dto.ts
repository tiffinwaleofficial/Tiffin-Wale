import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MealStatus } from "../schemas/meal.schema";

export class UpdateMealStatusDto {
  @ApiProperty({
    description: "New status for the meal",
    enum: MealStatus,
    example: MealStatus.PREPARING,
  })
  @IsNotEmpty()
  @IsEnum(MealStatus)
  status: MealStatus;
}
