import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    description: "Name of the subscription plan",
    example: "Premium Daily Plan",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the subscription plan",
    example: "Get 3 meals per day, 7 days a week with premium quality food",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: "Price of the subscription plan",
    example: 2999,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: "Number of meals per day",
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  mealsPerDay: number;

  @ApiProperty({
    description: "Number of days per week",
    example: 7,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  daysPerWeek: number;

  @ApiProperty({
    description: "Features included in the plan",
    type: [String],
    example: ["Free delivery", "Premium quality", "24/7 support"],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}
