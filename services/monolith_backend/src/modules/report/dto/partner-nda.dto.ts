import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PartnerNdaDto {
  @ApiProperty({ description: "Partner ID" })
  @IsString()
  partnerId: string;

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
}



