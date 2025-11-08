import { IsString, IsOptional, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PartnerDataDto } from "./partner-mou.dto";

export class PartnerNdaDto {
  @ApiPropertyOptional({ description: "Partner ID (required if partnerData not provided)" })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional({ description: "Partner data (required if partnerId not provided)", type: PartnerDataDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartnerDataDto)
  partnerData?: PartnerDataDto;

  @ApiPropertyOptional({ 
    description: "Purpose of the NDA",
    default: "partnering with Tiffin Wale to offer food services through the Tiffin Wale platform"
  })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ 
    description: "Term of the NDA",
    default: "2 years"
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({ 
    description: "Survival period after termination (in years)",
    default: "3"
  })
  @IsOptional()
  @IsString()
  survivalPeriod?: string;

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



