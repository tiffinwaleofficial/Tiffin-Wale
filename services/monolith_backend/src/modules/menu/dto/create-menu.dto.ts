import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from "class-validator";

export class CreateMenuDto {
  @ApiProperty({
    description: "Name of the menu",
    example: "Breakfast Menu",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the menu",
    example: "Delicious breakfast options available from 8 AM to 11 AM",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Array of menu banner image URLs",
    example: ["https://example.com/banner1.jpg"],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: "Whether the menu is active",
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "Menu available from time",
    example: "08:00",
    required: false,
  })
  @IsString()
  @IsOptional()
  availableFrom?: string;

  @ApiProperty({
    description: "Menu available to time",
    example: "11:00",
    required: false,
  })
  @IsString()
  @IsOptional()
  availableTo?: string;

  @ApiProperty({
    description: "Partner/restaurant ID (auto-set from JWT)",
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  restaurant?: string;
}
