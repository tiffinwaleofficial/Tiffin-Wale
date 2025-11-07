import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PartyDto {
  @ApiProperty({ description: "Party name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Party role" })
  @IsString()
  role: string;

  @ApiProperty({ description: "Party address" })
  @IsString()
  address: string;

  @ApiProperty({ description: "Contact information" })
  @IsString()
  contactInfo: string;
}

export class TermSectionDto {
  @ApiProperty({ description: "Section title" })
  @IsString()
  section: string;

  @ApiProperty({ description: "Clauses in this section", type: [String] })
  @IsArray()
  @IsString({ each: true })
  clauses: string[];
}

export class LegalDocumentDto {
  @ApiProperty({ description: "Document type" })
  @IsString()
  documentType: string;

  @ApiProperty({ description: "Document title" })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Parties involved",
    type: [PartyDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartyDto)
  parties: PartyDto[];

  @ApiProperty({ description: "Effective date", type: String, format: "date" })
  @IsDateString()
  effectiveDate: string;

  @ApiPropertyOptional({
    description: "Expiry date",
    type: String,
    format: "date",
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({
    description: "Terms and conditions",
    type: [TermSectionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TermSectionDto)
  terms: TermSectionDto[];
}
