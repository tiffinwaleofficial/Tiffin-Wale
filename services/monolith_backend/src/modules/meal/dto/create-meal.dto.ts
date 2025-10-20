import {
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsDateString,
  IsMongoId,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMealDto {
  @ApiProperty({
    description: "Type of meal",
    enum: ["breakfast", "lunch", "dinner", "snack"],
    example: "lunch",
  })
  @IsNotEmpty()
  @IsEnum(["breakfast", "lunch", "dinner", "snack"])
  type: "breakfast" | "lunch" | "dinner" | "snack";

  @ApiProperty({
    description: "Date for the meal",
    example: "2024-01-15T12:00:00Z",
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: "Array of menu item IDs",
    type: [String],
    example: ["60d21b4667d0d8992e610c87"],
  })
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  menu: string[];

  @ApiProperty({
    description: "Restaurant ID",
    example: "60d21b4667d0d8992e610c87",
  })
  @IsNotEmpty()
  @IsMongoId()
  restaurantId: string;

  @ApiProperty({
    description: "Restaurant name",
    example: "Tasty Bites",
  })
  @IsOptional()
  restaurantName?: string;

  @ApiProperty({
    description: "User ID",
    example: "60d21b4667d0d8992e610c87",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
