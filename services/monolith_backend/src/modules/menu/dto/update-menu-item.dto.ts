import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  Min,
  IsObject,
  ValidateNested,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";

// Define a class for updating nutritional info
class UpdateNutritionalInfoDto {
  @ApiProperty({
    description: "Calories per serving",
    example: 450,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  calories?: number;

  @ApiProperty({
    description: "Protein content in grams",
    example: 20,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  protein?: number;

  @ApiProperty({
    description: "Carbohydrate content in grams",
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  carbs?: number;

  @ApiProperty({
    description: "Fat content in grams",
    example: 15,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fat?: number;
}

// Create a more explicit UpdateMenuItemDto with Swagger examples
export class UpdateMenuItemDto {
  @ApiProperty({
    description: "Name of the menu item",
    example: "Butter Naan",
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Description of the menu item",
    example: "Creamy and rich naan",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Price of the menu item",
    example: 12.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: "URL to the menu item image",
    example: "https://example.com/image.jpg",
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: "ID of the business partner",
    example: "6507e9ce0cb7ea2d3c9d10a9",
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  businessPartner?: string;

  @ApiProperty({
    description: "ID of the category",
    example: "6507e9ce0cb7ea2d3c9d10b2",
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: "Whether the menu item is available",
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: "Tags for the menu item",
    example: ["spicy", "popular", "recommended"],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: "Allergens in the menu item",
    example: ["dairy", "nuts", "gluten"],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiProperty({
    description: "Spice level of the menu item",
    example: "Mild",
    required: false,
  })
  @IsString()
  @IsOptional()
  spiceLevel?: string;

  @ApiProperty({
    description: "Whether the menu item is vegetarian",
    example: true,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @ApiProperty({
    description: "Whether the menu item is vegan",
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @ApiProperty({
    description: "Whether the menu item is gluten-free",
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isGlutenFree?: boolean;

  @ApiProperty({
    description: "Array of image URLs for the menu item",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: "ID of the menu this item belongs to",
    example: "6507e9ce0cb7ea2d3c9d10b2",
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  menu?: string;

  @ApiProperty({
    description: "Nutritional information of the menu item",
    type: UpdateNutritionalInfoDto,
    required: false,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateNutritionalInfoDto)
  @IsOptional()
  nutritionalInfo?: UpdateNutritionalInfoDto;
}
