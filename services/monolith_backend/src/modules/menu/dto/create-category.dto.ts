import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsArray, IsMongoId } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ description: "Name of the category", example: "Main Dishes" })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the category",
    example: "Our signature main course offerings",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Business partner ID who owns this category",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsMongoId()
  businessPartner: string;

  @ApiProperty({
    description: "URL to the category image",
    example: "https://example.com/categories/main-dishes.jpg",
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: "Order/position of the category in the menu",
    example: 2,
    required: false,
  })
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: "Tags for the category",
    example: ["popular", "recommended"],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
