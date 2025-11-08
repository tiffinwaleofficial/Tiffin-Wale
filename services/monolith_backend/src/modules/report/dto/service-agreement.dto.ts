import { IsString, IsOptional, IsNumber, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PartnerDataDto } from "./partner-mou.dto";

export class ServiceAgreementDto {
  @ApiPropertyOptional({ description: "Partner ID (required if partnerData not provided)" })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional({ description: "Partner data (required if partnerId not provided)", type: PartnerDataDto })
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

  @ApiPropertyOptional({ description: "Minimum order acceptance rate (percentage)" })
  @IsOptional()
  @IsNumber()
  minimumAcceptanceRate?: number;

  @ApiPropertyOptional({ description: "Order acceptance time in minutes" })
  @IsOptional()
  @IsNumber()
  orderAcceptanceTime?: number;

  @ApiPropertyOptional({ description: "Cancellation policy" })
  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @ApiPropertyOptional({ description: "Commission change notice period" })
  @IsOptional()
  @IsString()
  commissionChangeNotice?: string;

  @ApiPropertyOptional({ description: "Payment processing days" })
  @IsOptional()
  @IsNumber()
  paymentProcessingDays?: number;

  @ApiPropertyOptional({ description: "Minimum payout amount" })
  @IsOptional()
  @IsNumber()
  minimumPayoutAmount?: number;

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



