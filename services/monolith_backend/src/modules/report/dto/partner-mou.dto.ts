import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PartnerMouDto {
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
}



