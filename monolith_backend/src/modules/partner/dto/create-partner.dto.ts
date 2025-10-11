import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePartnerDto {
  @ApiProperty({
    description: "Business name",
    example: "Tasty Bites Restaurant",
  })
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @ApiProperty({
    description: "Business description",
    example: "Delicious home-cooked meals with authentic flavors",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: "Cuisine types offered",
    type: [String],
    example: ["Indian", "Chinese", "Continental"],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes: string[];

  @ApiProperty({
    description: "Business address",
    example: "123 Main Street, Downtown",
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "City",
    example: "New York",
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: "State",
    example: "NY",
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: "ZIP code",
    example: "10001",
  })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({
    description: "Country",
    example: "USA",
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: "Phone number",
    example: "+1234567890",
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: "Business hours",
    example: "Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM",
  })
  @IsOptional()
  @IsString()
  businessHours?: string;

  @ApiProperty({
    description: "Logo URL",
    example: "https://example.com/logo.png",
    required: false,
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({
    description: "Banner URL",
    example: "https://example.com/banner.png",
    required: false,
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({
    description: "Whether the partner is accepting orders",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAcceptingOrders?: boolean;

  @ApiProperty({
    description: "Whether the partner is featured",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: "Average rating",
    example: 4.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  averageRating?: number;

  @ApiProperty({
    description: "Total review count",
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalReviews?: number;
}
