import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class DeliverySettingsDto {
  @ApiProperty({ description: "Base delivery fee", example: 2.5 })
  @IsNumber()
  baseFee: number;

  @ApiProperty({ description: "Fee per kilometer", example: 0.5 })
  @IsNumber()
  feePerKm: number;

  @ApiProperty({ description: "Maximum delivery radius (km)", example: 10 })
  @IsNumber()
  maxRadius: number;

  @ApiProperty({ description: "Free delivery threshold", example: 25 })
  @IsNumber()
  freeDeliveryThreshold: number;
}

export class CommissionSettingsDto {
  @ApiProperty({ description: "Base commission percentage", example: 15 })
  @IsNumber()
  baseCommissionPercentage: number;

  @ApiProperty({
    description: "Premium partner commission percentage",
    example: 12,
  })
  @IsNumber()
  premiumPartnerCommissionPercentage: number;

  @ApiProperty({ description: "Service fee percentage", example: 5 })
  @IsNumber()
  serviceFeePercentage: number;
}

export class SystemSettingsDto {
  @ApiProperty({ description: "Application name", example: "TiffinMate" })
  @IsString()
  @IsOptional()
  appName?: string;

  @ApiProperty({
    description: "Customer support email",
    example: "support@tiffinmate.com",
  })
  @IsString()
  @IsOptional()
  supportEmail?: string;

  @ApiProperty({
    description: "Customer support phone",
    example: "+1-800-TIFFINS",
  })
  @IsString()
  @IsOptional()
  supportPhone?: string;

  @ApiProperty({
    description: "Business hours",
    example: "Mon-Fri 9AM-10PM, Sat-Sun 10AM-8PM",
  })
  @IsString()
  @IsOptional()
  businessHours?: string;

  @ApiProperty({ description: "Is maintenance mode enabled", example: false })
  @IsBoolean()
  @IsOptional()
  maintenanceMode?: boolean;

  @ApiProperty({ description: "Minimum order amount", example: 10 })
  @IsNumber()
  @IsOptional()
  minimumOrderAmount?: number;

  @ApiProperty({ description: "Delivery settings" })
  @IsObject()
  @ValidateNested()
  @Type(() => DeliverySettingsDto)
  @IsOptional()
  deliverySettings?: DeliverySettingsDto;

  @ApiProperty({ description: "Commission settings" })
  @IsObject()
  @ValidateNested()
  @Type(() => CommissionSettingsDto)
  @IsOptional()
  commissionSettings?: CommissionSettingsDto;

  @ApiProperty({
    description: "Allow new partner registrations",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  allowPartnerRegistrations?: boolean;

  @ApiProperty({
    description: "Require approval for new menu items",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  requireMenuItemApproval?: boolean;
}

export class SystemSettingsResponseDto extends SystemSettingsDto {
  @ApiProperty({
    description: "ID of the settings record",
    example: "6507e9ce0cb7ea2d3c9d10a9",
  })
  id: string;

  @ApiProperty({
    description: "Last updated timestamp",
    example: "2025-04-20T12:30:45.000Z",
  })
  updatedAt: Date;
}
