import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import {
  AddressDto,
  BusinessHoursDto,
} from "../../partner/dto/partner.dto";

export class UpdatePartnerDto {
  @ApiPropertyOptional({ description: "Business email address" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: "Business name" })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiPropertyOptional({ description: "Business phone number" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: "Business description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "Types of cuisine offered",
    example: ["Indian", "Vegetarian"],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisineTypes?: string[];

  @ApiPropertyOptional({ description: "Business address" })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ApiPropertyOptional({ description: "Business hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  @IsOptional()
  businessHours?: BusinessHoursDto;

  @ApiPropertyOptional({ description: "URL to business logo" })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: "URL to business banner image" })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: "Whether the partner is currently accepting orders",
  })
  @IsBoolean()
  @IsOptional()
  isAcceptingOrders?: boolean;

  @ApiPropertyOptional({
    description: "Whether the partner should be featured on the platform",
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: "Is the business active" })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: "Partner status" })
  @IsOptional()
  status?: any;
}
