import { IsString, IsOptional, IsArray, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum ContractType {
  MOU = "mou",
  AGREEMENT = "agreement",
  PARTNERSHIP = "partnership",
}

export class PartnerContractDto {
  @ApiProperty({ description: "Partner ID" })
  @IsString()
  partnerId: string;

  @ApiProperty({
    description: "Type of contract",
    enum: ContractType,
    default: ContractType.AGREEMENT,
  })
  @IsEnum(ContractType)
  contractType: ContractType;

  @ApiPropertyOptional({ description: "Custom terms to include" })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  terms?: string[];
}
