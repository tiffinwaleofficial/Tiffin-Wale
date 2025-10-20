import { ApiProperty } from "@nestjs/swagger";

export class RevenueTrendDto {
  @ApiProperty({ description: "Date of the data point", example: "2025-04-01" })
  date: string;

  @ApiProperty({
    description: "Revenue amount for this date",
    example: 1245.75,
  })
  amount: number;
}

export class RevenueBreakdownDto {
  @ApiProperty({ description: "Revenue from food items", example: 42500.8 })
  food: number;

  @ApiProperty({ description: "Revenue from delivery fees", example: 8750.25 })
  deliveryFees: number;

  @ApiProperty({ description: "Revenue from service fees", example: 6250.5 })
  serviceFees: number;

  @ApiProperty({ description: "Revenue from other sources", example: 1250.75 })
  other: number;
}

export class TopSellingItemDto {
  @ApiProperty({ description: "Item ID", example: "6507e9ce0cb7ea2d3c9d10b2" })
  id: string;

  @ApiProperty({ description: "Item name", example: "Butter Chicken" })
  name: string;

  @ApiProperty({ description: "Total units sold", example: 350 })
  unitsSold: number;

  @ApiProperty({ description: "Total revenue", example: 4550.5 })
  revenue: number;

  @ApiProperty({
    description: "Partner ID",
    example: "6507e9ce0cb7ea2d3c9d10a9",
  })
  partnerId: string;

  @ApiProperty({
    description: "Partner name",
    example: "Taj Mahal Indian Cuisine",
  })
  partnerName: string;
}

export class RevenueSummaryDto {
  @ApiProperty({ description: "Total revenue to date", example: 58750.25 })
  total: number;

  @ApiProperty({ description: "Revenue today", example: 1245.75 })
  today: number;

  @ApiProperty({ description: "Revenue this week", example: 8542.3 })
  thisWeek: number;

  @ApiProperty({ description: "Revenue this month", example: 32150.8 })
  thisMonth: number;

  @ApiProperty({
    description: "Revenue growth rate (month over month)",
    example: 0.15,
  })
  growthRate: number;

  @ApiProperty({ description: "Average order value", example: 22.45 })
  averageOrderValue: number;
}

export class RevenueStatsDto {
  @ApiProperty({ description: "Revenue summary" })
  summary: RevenueSummaryDto;

  @ApiProperty({
    description: "Revenue trends over time",
    type: [RevenueTrendDto],
  })
  trends: RevenueTrendDto[];

  @ApiProperty({ description: "Revenue breakdown by source" })
  breakdown: RevenueBreakdownDto;

  @ApiProperty({
    description: "Top 10 selling items",
    type: [TopSellingItemDto],
  })
  topSellingItems: TopSellingItemDto[];

  @ApiProperty({
    description: "Timestamp of when stats were generated",
    example: "2025-04-20T12:30:45.000Z",
  })
  timestamp: Date;
}
