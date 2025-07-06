import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";

@ApiTags("analytics")
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("earnings")
  @ApiOperation({ summary: "Get earnings analytics" })
  @ApiQuery({ name: "period", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  earnings(@Query("period") period = "today", @Query("startDate") start?: string, @Query("endDate") end?: string) {
    return this.analyticsService.earnings(period, start, end);
  }

  @Get("orders")
  @ApiOperation({ summary: "Get order analytics" })
  @ApiQuery({ name: "period", required: false })
  orders(@Query("period") period = "week") {
    return this.analyticsService.orderStats(period);
  }

  @Get("revenue-history")
  @ApiOperation({ summary: "Get revenue history data" })
  @ApiQuery({ name: "months", required: false, type: Number })
  revenueHistory(@Query("months") months = 6) {
    return this.analyticsService.revenueHistory(Number(months));
  }
}