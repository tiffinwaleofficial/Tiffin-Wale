import { ApiProperty } from "@nestjs/swagger";

export class UserCountsDto {
  @ApiProperty({ description: "Total number of users", example: 150 })
  total: number;

  @ApiProperty({ description: "Number of customers", example: 120 })
  customers: number;

  @ApiProperty({ description: "Number of business partners", example: 25 })
  businessPartners: number;

  @ApiProperty({ description: "Number of admins", example: 5 })
  admins: number;
}

export class OrderCountsDto {
  @ApiProperty({ description: "Total number of orders", example: 500 })
  total: number;

  @ApiProperty({ description: "Number of pending orders", example: 30 })
  pending: number;

  @ApiProperty({ description: "Number of confirmed orders", example: 50 })
  confirmed: number;

  @ApiProperty({ description: "Number of preparing orders", example: 40 })
  preparing: number;

  @ApiProperty({ description: "Number of ready orders", example: 20 })
  ready: number;

  @ApiProperty({ description: "Number of delivered orders", example: 350 })
  delivered: number;

  @ApiProperty({ description: "Number of cancelled orders", example: 10 })
  cancelled: number;
}

export class MenuCountsDto {
  @ApiProperty({ description: "Total number of menu items", example: 250 })
  items: number;

  @ApiProperty({ description: "Number of categories", example: 15 })
  categories: number;
}

export class RecentActivityDto {
  @ApiProperty({
    description: "Number of new users in last 24 hours",
    example: 8,
  })
  newUsers: number;

  @ApiProperty({
    description: "Number of new orders in last 24 hours",
    example: 35,
  })
  newOrders: number;

  @ApiProperty({
    description: "Number of completed deliveries in last 24 hours",
    example: 28,
  })
  completedDeliveries: number;
}

export class SystemStatsDto {
  @ApiProperty({ description: "User statistics" })
  users: UserCountsDto;

  @ApiProperty({ description: "Order statistics" })
  orders: OrderCountsDto;

  @ApiProperty({ description: "Menu statistics" })
  menu: MenuCountsDto;

  @ApiProperty({ description: "Recent activity statistics" })
  recentActivity: RecentActivityDto;

  @ApiProperty({
    description: "Timestamp of when stats were generated",
    example: "2025-04-20T12:30:45.000Z",
  })
  timestamp: Date;
}
