import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MealType, MealStatus } from "../schemas/meal.schema";

class MenuItemResponseDto {
  @ApiProperty({
    description: "Menu item ID",
    example: "60d21b4667d0d8992e610c85",
  })
  id: string;

  @ApiProperty({
    description: "Menu item name",
    example: "Butter Chicken",
  })
  name: string;

  @ApiProperty({
    description: "Menu item description",
    example: "Creamy chicken curry with butter and spices",
  })
  description: string;

  @ApiProperty({
    description: "Menu item price",
    example: 180,
  })
  price: number;

  @ApiPropertyOptional({
    description: "Menu item image URL",
    example: "https://example.com/images/butter-chicken.jpg",
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: "Whether the item is vegetarian",
    example: false,
  })
  isVegetarian?: boolean;
}

export class MealResponseDto {
  @ApiProperty({
    description: "Meal ID",
    example: "60d21b4667d0d8992e610d01",
  })
  id: string;

  @ApiProperty({
    description: "Meal type",
    enum: MealType,
    example: MealType.LUNCH,
  })
  type: MealType;

  @ApiProperty({
    description: "Scheduled date for the meal",
    example: "2023-07-22T12:00:00Z",
  })
  scheduledDate: string;

  @ApiProperty({
    description: "Menu items included in the meal",
    type: [MenuItemResponseDto],
  })
  menuItems: MenuItemResponseDto[];

  @ApiProperty({
    description: "Status of the meal",
    enum: MealStatus,
    example: MealStatus.SCHEDULED,
  })
  status: MealStatus;

  @ApiProperty({
    description: "Customer ID",
    example: "60d21b4667d0d8992e610c87",
  })
  customerId: string;

  @ApiPropertyOptional({
    description: "Business partner ID",
    example: "60d21b4667d0d8992e610c88",
  })
  businessPartnerId?: string;

  @ApiPropertyOptional({
    description: "Business partner name",
    example: "Spice Garden Restaurant",
  })
  businessPartnerName?: string;

  @ApiProperty({
    description: "Whether the meal has been rated",
    example: false,
  })
  isRated: boolean;

  @ApiPropertyOptional({
    description: "Rating of the meal (1-5)",
    example: 4,
  })
  rating?: number;

  @ApiPropertyOptional({
    description: "Review of the meal",
    example: "Delicious food, on time delivery",
  })
  review?: string;

  @ApiPropertyOptional({
    description: "Reason for cancellation",
    example: "Customer requested cancellation",
  })
  cancellationReason?: string;

  @ApiPropertyOptional({
    description: "Delivery notes",
    example: "Please leave at reception",
  })
  deliveryNotes?: string;

  @ApiPropertyOptional({
    description: "Date when meal was delivered",
    example: "2023-07-22T13:15:00Z",
  })
  deliveredAt?: string;

  @ApiProperty({
    description: "Date when meal was created",
    example: "2023-07-21T10:00:00Z",
  })
  createdAt: string;

  @ApiProperty({
    description: "Date when meal was last updated",
    example: "2023-07-22T12:30:00Z",
  })
  updatedAt: string;
}
