import { IsString, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OrderReceiptDto {
  @ApiProperty({ description: "Order ID" })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({
    description: "Include detailed items in receipt",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeItems?: boolean;

  @ApiPropertyOptional({
    description: "Include payment information",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includePayment?: boolean;
}
