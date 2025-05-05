import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "../../../common/interfaces/order.interface";

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
    description: "New order status",
  })
  @IsEnum(OrderStatus, { message: "Invalid order status" })
  @IsNotEmpty({ message: "Status is required" })
  status: OrderStatus;
}
