import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class PartnerFinancialDataDto {
  @ApiPropertyOptional({ description: "Partner ID" })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional({ description: "Business name" })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ description: "Owner name" })
  @IsOptional()
  @IsString()
  ownerName?: string;

  @ApiPropertyOptional({ description: "Address" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "Onboarding date" })
  @IsOptional()
  @IsString()
  onboardingDate?: string;

  @ApiPropertyOptional({ description: "Status" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: "Total orders" })
  @IsOptional()
  totalOrders?: number;

  @ApiPropertyOptional({ description: "Total revenue" })
  @IsOptional()
  totalRevenue?: number;

  @ApiPropertyOptional({ description: "Partner share" })
  @IsOptional()
  partnerShare?: number;

  @ApiPropertyOptional({ description: "Company share" })
  @IsOptional()
  companyShare?: number;

  @ApiPropertyOptional({ description: "GST breakdown" })
  @IsOptional()
  gstBreakdown?: number;
}

export class PerPartnerBreakdownDto {
  @ApiPropertyOptional({ description: "Partner ID" })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional({ description: "Business name" })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ description: "Cash burn per month" })
  @IsOptional()
  cashBurnPerMonth?: number;

  @ApiPropertyOptional({ description: "Average order value" })
  @IsOptional()
  avgOrderValue?: number;

  @ApiPropertyOptional({ description: "Total orders" })
  @IsOptional()
  totalOrders?: number;

  @ApiPropertyOptional({ description: "Total revenue" })
  @IsOptional()
  totalRevenue?: number;

  @ApiPropertyOptional({ description: "Partner share" })
  @IsOptional()
  partnerShare?: number;

  @ApiPropertyOptional({ description: "Company share" })
  @IsOptional()
  companyShare?: number;

  @ApiPropertyOptional({ description: "Commission earned" })
  @IsOptional()
  commissionEarned?: number;
}

export class PartnerFinancialReportDto {
  @ApiPropertyOptional({ description: "Report generation date" })
  @IsOptional()
  @IsString()
  generationDate?: string;

  @ApiPropertyOptional({ description: "Report period" })
  @IsOptional()
  @IsString()
  reportPeriod?: string;

  @ApiPropertyOptional({ description: "Summary metrics", type: Object })
  @IsOptional()
  @IsObject()
  summary?: any;

  @ApiPropertyOptional({ description: "Partner metrics", type: Object })
  @IsOptional()
  @IsObject()
  metrics?: any;

  @ApiPropertyOptional({ description: "Financial metrics", type: Object })
  @IsOptional()
  @IsObject()
  financialMetrics?: any;

  @ApiPropertyOptional({ description: "Cost analysis", type: Object })
  @IsOptional()
  @IsObject()
  costAnalysis?: any;

  @ApiPropertyOptional({
    description: "Per partner breakdown",
    type: [PerPartnerBreakdownDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerPartnerBreakdownDto)
  perPartnerBreakdown?: PerPartnerBreakdownDto[];

  @ApiPropertyOptional({
    description: "List of partners",
    type: [PartnerFinancialDataDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnerFinancialDataDto)
  partners?: PartnerFinancialDataDto[];

  @ApiPropertyOptional({ description: "Chart data", type: Object })
  @IsOptional()
  @IsObject()
  charts?: any;
}
