import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsMongoId,
  IsOptional,
  IsDateString,
  ValidateNested,
  Min,
  ArrayMinSize,
} from "class-validator";

export class OrderItemDto {
  @ApiProperty({
    example: "6075c1a5a9f14a2c9c5df91a",
    description: "Menu Item ID",
  })
  @IsMongoId()
  @IsNotEmpty({ message: "Menu item ID is required" })
  mealId: string;

  @ApiProperty({ example: 2, description: "Quantity of the menu item" })
  @IsNumber({}, { message: "Quantity must be a number" })
  @Min(1, { message: "Quantity must be at least 1" })
  @IsNotEmpty({ message: "Quantity is required" })
  quantity: number;

  @ApiPropertyOptional({
    example: "No onions please",
    description: "Special instructions for this item",
  })
  @IsString({ message: "Special instructions must be a string" })
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty({ example: 12.99, description: "Price of the item" })
  @IsNumber({}, { message: "Price must be a number" })
  @Min(0, { message: "Price cannot be negative" })
  @IsNotEmpty({ message: "Price is required" })
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: "6075c1a5a9f14a2c9c5df91a",
    description: "Customer ID",
  })
  @IsMongoId({ message: "Invalid customer ID format" })
  @IsNotEmpty({ message: "Customer ID is required" })
  customer: string;

  @ApiProperty({
    example: "6075c1a5a9f14a2c9c5df91b",
    description: "Business partner ID",
  })
  @IsMongoId({ message: "Invalid business partner ID format" })
  @IsNotEmpty({ message: "Business partner ID is required" })
  businessPartner: string;

  @ApiProperty({
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
  @IsNotEmpty({ message: "Order items are required" })
  items: OrderItemDto[];

  @ApiProperty({ example: 25.98, description: "Total order amount" })
  @IsNumber({}, { message: "Total amount must be a number" })
  @Min(0, { message: "Total amount cannot be negative" })
  @IsNotEmpty({ message: "Total amount is required" })
  totalAmount: number;

  @ApiProperty({
    example: "123 Main St, New York, NY 10001",
    description: "Delivery address",
  })
  @IsString({ message: "Delivery address must be a string" })
  @IsNotEmpty({ message: "Delivery address is required" })
  deliveryAddress: string;

  @ApiPropertyOptional({
    example: "Leave at the door",
    description: "Delivery instructions",
  })
  @IsString({ message: "Delivery instructions must be a string" })
  @IsOptional()
  deliveryInstructions?: string;

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
}
