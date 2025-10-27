import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum } from "class-validator";

export enum RejectReason {
  OUT_OF_STOCK = "out_of_stock",
  RESTAURANT_CLOSED = "restaurant_closed",
  TOO_BUSY = "too_busy",
  DELIVERY_UNAVAILABLE = "delivery_unavailable",
  OTHER = "other",
}

export class RejectOrderDto {
  @ApiProperty({
    description: "Reason for rejecting the order",
    enum: RejectReason,
    example: RejectReason.OUT_OF_STOCK,
  })
  @IsEnum(RejectReason)
  reason: RejectReason;

  @ApiProperty({
    description: "Additional message explaining the rejection",
    example: "Sorry, we are out of this item today",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
