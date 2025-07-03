import { Type } from "class-transformer";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  Min,
  Max,
  IsArray,
  IsBoolean,
  IsUrl,
  ValidateIf,
} from "class-validator";
import {
  DurationType,
  MealFrequency,
} from "../schemas/subscription-plan.schema";

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.discountedPrice !== null)
  discountedPrice?: number = null;

  @IsNumber()
  @Min(1)
  durationValue: number;

  @IsEnum(DurationType)
  durationType: DurationType;

  @IsEnum(MealFrequency)
  mealFrequency: MealFrequency;

  @IsNumber()
  @Min(1)
  @Max(5)
  mealsPerDay: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number = 0;

  @IsOptional()
  @IsArray()
  features?: string[] = [];

  @IsOptional()
  @IsUrl()
  @ValidateIf((o) => o.imageUrl !== null && o.imageUrl !== "")
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPauseCount?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSkipCount?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxCustomizationsPerDay?: number = 0;

  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
