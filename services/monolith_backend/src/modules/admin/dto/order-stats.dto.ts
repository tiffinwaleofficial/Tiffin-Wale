import { ApiProperty } from "@nestjs/swagger";

export class OrderVolumeDto {
  @ApiProperty({ description: "Date of the data point", example: "2025-04-01" })
  date: string;

  @ApiProperty({ description: "Number of orders on this date", example: 45 })
  count: number;
}

export class OrderPerformanceDto {
  @ApiProperty({
    description: "Average time to prepare order (minutes)",
    example: 22.5,
  })
  avgPrepTime: number;

  @ApiProperty({
    description: "Average time to deliver order (minutes)",
    example: 35.8,
  })
  avgDeliveryTime: number;

  @ApiProperty({ description: "On-time delivery rate", example: 0.92 })
  onTimeRate: number;

  @ApiProperty({ description: "Cancellation rate", example: 0.03 })
  cancellationRate: number;
}

export class OrderRevenueDto {
  @ApiProperty({ description: "Total revenue", example: 58750.25 })
  total: number;

  @ApiProperty({ description: "Average order value", example: 22.45 })
  averageOrderValue: number;

  @ApiProperty({ description: "Revenue today", example: 1245.75 })
  today: number;

  @ApiProperty({ description: "Revenue this week", example: 8542.3 })
  thisWeek: number;

  @ApiProperty({ description: "Revenue this month", example: 32150.8 })
  thisMonth: number;
}

export class OrderStatusDetailedDto {
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

export class OrderStatsDto {
  @ApiProperty({ description: "Current order counts by status" })
  counts: OrderStatusDetailedDto;

  @ApiProperty({
    description: "Order volume over time",
    type: [OrderVolumeDto],
  })
  volume: OrderVolumeDto[];

  @ApiProperty({ description: "Order performance metrics" })
  performance: OrderPerformanceDto;

  @ApiProperty({ description: "Order revenue metrics" })
  revenue: OrderRevenueDto;

  @ApiProperty({
    description: "Timestamp of when stats were generated",
    example: "2025-04-20T12:30:45.000Z",
  })
  timestamp: Date;
}
