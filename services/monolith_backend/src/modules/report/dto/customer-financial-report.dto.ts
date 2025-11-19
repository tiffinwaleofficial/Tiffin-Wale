import { IsOptional, IsString, IsArray, ValidateNested, IsObject } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class UserDataDto {
  @ApiPropertyOptional({ description: "User ID" })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: "User name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "User email" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: "User phone" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: "User address" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "Subscription plan name" })
  @IsOptional()
  @IsString()
  planName?: string;

  @ApiPropertyOptional({ description: "Subscription price" })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: "Purchase date" })
  @IsOptional()
  @IsString()
  purchaseDate?: string;

  @ApiPropertyOptional({ description: "GST amount" })
  @IsOptional()
  gst?: number;

  @ApiPropertyOptional({ description: "Total amount" })
  @IsOptional()
  totalAmount?: number;

  @ApiPropertyOptional({ description: "Subscription status" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: "Renewal date" })
  @IsOptional()
  @IsString()
  renewalDate?: string;
}

export class CustomerFinancialReportDto {
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

  @ApiPropertyOptional({ description: "Subscription metrics", type: Object })
  @IsOptional()
  @IsObject()
  metrics?: any;

  @ApiPropertyOptional({ description: "Revenue breakdown", type: Object })
  @IsOptional()
  @IsObject()
  revenueBreakdown?: any;

  @ApiPropertyOptional({ description: "List of users", type: [UserDataDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDataDto)
  users?: UserDataDto[];

  @ApiPropertyOptional({ description: "Chart data", type: Object })
  @IsOptional()
  @IsObject()
  charts?: any;
}

