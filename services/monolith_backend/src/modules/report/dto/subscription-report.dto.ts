import { IsString, IsOptional, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SubscriptionReportDto {
  @ApiProperty({ description: "Subscription ID" })
  @IsString()
  subscriptionId: string;

  @ApiPropertyOptional({ description: "Start date for report range" })
  @IsOptional()
  @IsDateString()
  dateRangeStart?: string;

  @ApiPropertyOptional({ description: "End date for report range" })
  @IsOptional()
  @IsDateString()
  dateRangeEnd?: string;

  @ApiPropertyOptional({
    description: "Include payment history",
    default: true,
  })
  @IsOptional()
  includeHistory?: boolean;
}
