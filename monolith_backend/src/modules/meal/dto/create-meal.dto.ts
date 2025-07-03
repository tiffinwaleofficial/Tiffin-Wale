import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  IsOptional,
  IsMongoId,
  ArrayMinSize,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { MealType, MealStatus } from "../schemas/meal.schema";

export class CreateMealDto {
  @ApiProperty({
    description: "Type of meal",
    enum: MealType,
    example: MealType.LUNCH,
  })
  @IsEnum(MealType)
  @IsNotEmpty()
  type: MealType;

  @ApiProperty({
    description: "Date when the meal is scheduled",
    example: "2023-07-22T12:00:00Z",
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  scheduledDate: Date;

  @ApiProperty({
    description: "Menu items included in the meal",
    example: ["60d21b4667d0d8992e610c85", "60d21b4667d0d8992e610c86"],
    isArray: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  menuItems: string[];

  @ApiPropertyOptional({
    description: "Status of the meal",
    enum: MealStatus,
    example: MealStatus.SCHEDULED,
    default: MealStatus.SCHEDULED,
  })
  @IsEnum(MealStatus)
  @IsOptional()
  status?: MealStatus;

  @ApiProperty({
    description: "Customer who will receive the meal",
    example: "60d21b4667d0d8992e610c87",
  })
  @IsMongoId()
  @IsNotEmpty()
  customer: string;

  @ApiPropertyOptional({
    description: "Business partner providing the meal",
    example: "60d21b4667d0d8992e610c88",
  })
  @IsMongoId()
  @IsOptional()
  businessPartner?: string;

  @ApiPropertyOptional({
    description: "Business partner name",
    example: "Spice Garden Restaurant",
  })
  @IsString()
  @IsOptional()
  businessPartnerName?: string;

  @ApiPropertyOptional({
    description: "Delivery notes",
    example: "Please leave at reception",
  })
  @IsString()
  @IsOptional()
  deliveryNotes?: string;
}
