import { ApiProperty } from "@nestjs/swagger";

export class PartnerGrowthDto {
  @ApiProperty({ description: "Date of the data point", example: "2025-04-01" })
  date: string;

  @ApiProperty({ description: "Number of partners on this date", example: 22 })
  count: number;
}

export class PartnerPerformanceDto {
  @ApiProperty({ description: "Average partner rating", example: 4.3 })
  avgRating: number;

  @ApiProperty({
    description: "Average order preparation time (minutes)",
    example: 22.5,
  })
  avgPrepTime: number;

  @ApiProperty({ description: "Average order fulfillment rate", example: 0.95 })
  fulfillmentRate: number;

  @ApiProperty({
    description: "Average daily orders per partner",
    example: 12.3,
  })
  avgDailyOrders: number;
}

export class TopPartnerDto {
  @ApiProperty({
    description: "Partner ID",
    example: "6507e9ce0cb7ea2d3c9d10a9",
  })
  id: string;

  @ApiProperty({
    description: "Partner name",
    example: "Taj Mahal Indian Cuisine",
  })
  name: string;

  @ApiProperty({ description: "Partner rating", example: 4.8 })
  rating: number;

  @ApiProperty({ description: "Total orders", example: 235 })
  totalOrders: number;

  @ApiProperty({ description: "Total revenue", example: 12580.5 })
  totalRevenue: number;
}

export class PartnerCategoriesDto {
  @ApiProperty({ description: "Category name", example: "Indian" })
  name: string;

  @ApiProperty({
    description: "Number of partners in this category",
    example: 8,
  })
  count: number;
}

export class PartnerCountsDto {
  @ApiProperty({ description: "Total number of partners", example: 25 })
  total: number;

  @ApiProperty({ description: "Number of active partners", example: 22 })
  active: number;

  @ApiProperty({ description: "Number of pending approval", example: 3 })
  pending: number;
}

export class PartnerStatsDto {
  @ApiProperty({ description: "Partner counts" })
  counts: PartnerCountsDto;

  @ApiProperty({
    description: "Partner growth over time",
    type: [PartnerGrowthDto],
  })
  growth: PartnerGrowthDto[];

  @ApiProperty({ description: "Partner performance metrics" })
  performance: PartnerPerformanceDto;

  @ApiProperty({
    description: "Top 5 performing partners",
    type: [TopPartnerDto],
  })
  topPartners: TopPartnerDto[];

  @ApiProperty({
    description: "Partner categories",
    type: [PartnerCategoriesDto],
  })
  categories: PartnerCategoriesDto[];

  @ApiProperty({
    description: "Timestamp of when stats were generated",
    example: "2025-04-20T12:30:45.000Z",
  })
  timestamp: Date;
}
