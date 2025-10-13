import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString, IsOptional, IsArray, Min, Max, IsMongoId } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: "Great food and excellent service!", description: "Review comment" })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({ example: ["https://example.com/image1.jpg"], description: "Review images" })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: "68ed2bfb0b872d5d24f1c19c", description: "Restaurant ID for restaurant review" })
  @IsMongoId()
  @IsOptional()
  restaurantId?: string;

  @ApiPropertyOptional({ example: "68ed2fba92f2b5b4b9f5e252", description: "Menu item ID for menu item review" })
  @IsMongoId()
  @IsOptional()
  menuItemId?: string;
}
