import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { CreateMealDto } from "./create-meal.dto";
import { MealStatus } from "../schemas/meal.schema";

export class UpdateMealDto extends PartialType(CreateMealDto) {
  @ApiPropertyOptional({
    description: "Status of the meal",
    enum: MealStatus,
    example: MealStatus.PREPARING,
  })
  @IsEnum(MealStatus)
  @IsOptional()
  status?: MealStatus;

  @ApiPropertyOptional({
    description: "Whether meal has been rated",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isRated?: boolean;

  @ApiPropertyOptional({
    description: "Rating of the meal (1-5)",
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({
    description: "Review of the meal",
    example: "Delicious food, on time delivery",
  })
  @IsString()
  @IsOptional()
  review?: string;

  @ApiPropertyOptional({
    description: "Reason for cancellation",
    example: "Customer requested cancellation",
  })
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
