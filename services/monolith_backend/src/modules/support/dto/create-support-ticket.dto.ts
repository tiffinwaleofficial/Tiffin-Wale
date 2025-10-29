import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { TicketCategory } from "../schemas/support-ticket.schema";

export class CreateSupportTicketDto {
  @ApiProperty({
    description: "Subject of the support ticket",
    example: "Issue with payment processing",
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: "Detailed message describing the issue",
    example: "I am facing issues with receiving payments to my bank account.",
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: "Category of the issue",
    enum: TicketCategory,
    example: TicketCategory.PAYMENTS,
  })
  @IsEnum(TicketCategory)
  @IsNotEmpty()
  category: TicketCategory;

  @ApiProperty({
    description: "User ID (auto-set from JWT)",
    required: false,
  })
  @IsString()
  @IsOptional()
  user?: string;

  @ApiProperty({
    description: "Partner ID (auto-set from JWT if user is partner)",
    required: false,
  })
  @IsString()
  @IsOptional()
  partner?: string;
}
