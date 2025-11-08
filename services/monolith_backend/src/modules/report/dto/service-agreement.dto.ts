import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ServiceAgreementDto {
  @ApiProperty({ description: "Partner ID" })
  @IsString()
  partnerId: string;

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
}



