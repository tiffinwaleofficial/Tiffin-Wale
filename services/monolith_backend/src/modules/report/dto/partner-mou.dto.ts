import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class PartnerDataDto {
  @ApiPropertyOptional({ description: "Business name" })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ description: "Owner first name" })
  @IsOptional()
  @IsString()
  ownerFirstName?: string;

  @ApiPropertyOptional({ description: "Owner last name" })
  @IsOptional()
  @IsString()
  ownerLastName?: string;

  @ApiPropertyOptional({ description: "Full address string" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "Contact email" })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: "Contact phone" })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: "WhatsApp number" })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @ApiPropertyOptional({ description: "GST number" })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({ description: "FSSAI license number" })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ description: "Established year" })
  @IsOptional()
  @IsNumber()
  establishedYear?: number;
}

export class PartnerMouDto {
  @ApiPropertyOptional({
    description: "Partner ID (required if partnerData not provided)",
  })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional({
    description: "Partner data (required if partnerId not provided)",
    type: PartnerDataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartnerDataDto)
  partnerData?: PartnerDataDto;

  @ApiPropertyOptional({ description: "Custom commission rate (percentage)" })
  @IsOptional()
  @IsNumber()
  commissionRate?: number;

  @ApiPropertyOptional({ description: "Custom payment terms" })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiPropertyOptional({ description: "Custom contract duration" })
  @IsOptional()
  @IsString()
  contractDuration?: string;

  @ApiPropertyOptional({ description: "Termination notice period" })
  @IsOptional()
  @IsString()
  terminationNotice?: string;

  @ApiPropertyOptional({ description: "Minimum rating requirement" })
  @IsOptional()
  @IsNumber()
  minimumRating?: number;

  @ApiPropertyOptional({ description: "Custom effective date (ISO string)" })
  @IsOptional()
  @IsString()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: "Custom expiry date (ISO string)" })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiPropertyOptional({ description: "Company GST number" })
  @IsOptional()
  @IsString()
  companyGstNumber?: string;

  @ApiPropertyOptional({ description: "Company PAN number" })
  @IsOptional()
  @IsString()
  companyPanNumber?: string;
}
