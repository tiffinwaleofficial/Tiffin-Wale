import { ApiProperty } from "@nestjs/swagger";

export class UserGrowthDto {
  @ApiProperty({ description: "Date of the data point", example: "2025-04-01" })
  date: string;

  @ApiProperty({ description: "Number of users on this date", example: 145 })
  count: number;
}

export class UserActivityDto {
  @ApiProperty({
    description: "Number of active users in last 24 hours",
    example: 55,
  })
  last24Hours: number;

  @ApiProperty({
    description: "Number of active users in last 7 days",
    example: 95,
  })
  last7Days: number;

  @ApiProperty({
    description: "Number of active users in last 30 days",
    example: 130,
  })
  last30Days: number;
}

export class UserRetentionDto {
  @ApiProperty({ description: "Retention rate after 1 day", example: 0.75 })
  day1: number;

  @ApiProperty({ description: "Retention rate after 7 days", example: 0.6 })
  day7: number;

  @ApiProperty({ description: "Retention rate after 30 days", example: 0.4 })
  day30: number;
}

export class UserCountsDetailedDto {
  @ApiProperty({ description: "Total number of users", example: 150 })
  total: number;

  @ApiProperty({ description: "Number of customers", example: 120 })
  customers: number;

  @ApiProperty({ description: "Number of business partners", example: 25 })
  businessPartners: number;

  @ApiProperty({ description: "Number of admins", example: 5 })
  admins: number;
}

export class UserStatsDto {
  @ApiProperty({ description: "Current user counts" })
  counts: UserCountsDetailedDto;

  @ApiProperty({ description: "User growth over time", type: [UserGrowthDto] })
  growth: UserGrowthDto[];

  @ApiProperty({ description: "User activity metrics" })
  activity: UserActivityDto;

  @ApiProperty({ description: "User retention rates" })
  retention: UserRetentionDto;

  @ApiProperty({
    description: "Timestamp of when stats were generated",
    example: "2025-04-20T12:30:45.000Z",
  })
  timestamp: Date;
}
