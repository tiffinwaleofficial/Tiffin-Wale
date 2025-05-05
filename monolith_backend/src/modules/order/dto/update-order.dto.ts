import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsEnum,
  IsDateString,
  ValidateNested,
  Min,
  ArrayMinSize,
} from "class-validator";
import { OrderStatus } from "../../../common/interfaces/order.interface";
import { OrderItemDto } from "./create-order.dto";

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: "6075c1a5a9f14a2c9c5df91a",
    description: "Customer ID",
  })
  @IsMongoId({ message: "Invalid customer ID format" })
  @IsOptional()
  customer?: string;

  @ApiPropertyOptional({
    example: "6075c1a5a9f14a2c9c5df91b",
    description: "Business partner ID",
  })
  @IsMongoId({ message: "Invalid business partner ID format" })
  @IsOptional()
  businessPartner?: string;

  @ApiPropertyOptional({
    type: [OrderItemDto],
    description: "Array of order items",
    example: [
      {
        mealId: "6075c1a5a9f14a2c9c5df91a",
        quantity: 2,
        specialInstructions: "Extra spicy",
        price: 12.99,
      },
    ],
  })
  @IsArray({ message: "Items must be an array" })
  @ArrayMinSize(1, { message: "Order must have at least one item" })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  items?: OrderItemDto[];

  @ApiPropertyOptional({ example: 25.98, description: "Total order amount" })
  @IsNumber({}, { message: "Total amount must be a number" })
  @Min(0, { message: "Total amount cannot be negative" })
  @IsOptional()
  totalAmount?: number;

  @ApiPropertyOptional({
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
    description: "Order status",
  })
  @IsEnum(OrderStatus, { message: "Invalid order status" })
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({
    example: "123 Main St, New York, NY 10001",
    description: "Delivery address",
  })
  @IsString({ message: "Delivery address must be a string" })
  @IsOptional()
  deliveryAddress?: string;

  @ApiPropertyOptional({
    example: "Leave at the door",
    description: "Delivery instructions",
  })
  @IsString({ message: "Delivery instructions must be a string" })
  @IsOptional()
  deliveryInstructions?: string;

  @ApiPropertyOptional({ example: true, description: "Is the order paid" })
  @IsBoolean({ message: "IsPaid must be a boolean" })
  @IsOptional()
  isPaid?: boolean;

  @ApiPropertyOptional({
    example: "2023-04-20T18:00:00Z",
    description: "Scheduled delivery time",
  })
  @IsDateString(
    {},
    { message: "Scheduled delivery time must be a valid date string" },
  )
  @IsOptional()
  scheduledDeliveryTime?: string;

  @ApiPropertyOptional({
    example: "2023-04-20T18:15:00Z",
    description: "Actual delivery time",
  })
  @IsDateString(
    {},
    { message: "Actual delivery time must be a valid date string" },
  )
  @IsOptional()
  actualDeliveryTime?: string;
}
