import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
} from "class-validator";

export class MarkOrderPaidDto {
  @ApiProperty({
    example: "txn_123456789",
    description: "Payment transaction ID",
  })
  @IsString({ message: "Transaction ID must be a string" })
  @IsNotEmpty({ message: "Transaction ID is required" })
  transactionId: string;

  @ApiProperty({ example: 25.98, description: "Payment amount" })
  @IsNumber({}, { message: "Amount must be a number" })
  @IsNotEmpty({ message: "Amount is required" })
  amount: number;

  @ApiProperty({ example: "credit_card", description: "Payment method used" })
  @IsString({ message: "Payment method must be a string" })
  @IsNotEmpty({ message: "Payment method is required" })
  paymentMethod: string;

  @ApiPropertyOptional({
    example: "2023-04-20T18:00:00Z",
    description: "Payment date and time",
  })
  @IsDateString({}, { message: "Paid at must be a valid date string" })
  @IsOptional()
  paidAt?: string;
}
