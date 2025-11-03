import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { GetCurrentUser } from "../../common/decorators/user.decorator";

@ApiTags("analytics")
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("earnings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get earnings analytics for current partner" })
  @ApiQuery({ name: "period", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  async earnings(
    @GetCurrentUser() user: any,
    @Query("period") period = "today",
    @Query("startDate") start?: string,
    @Query("endDate") end?: string,
  ) {
    // Get partner ID from user
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    return this.analyticsService.earnings(userId, period, start, end);
  }

  @Get("orders")
  @ApiOperation({ summary: "Get order analytics" })
  @ApiQuery({ name: "period", required: false })
  orders(@Query("period") period = "week") {
    return this.analyticsService.orderStats(period);
  }

  @Get("revenue-history")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get revenue history data for current partner" })
  @ApiQuery({ name: "months", required: false, type: Number })
  async revenueHistory(
    @GetCurrentUser() user: any,
    @Query("months") months = 6,
  ) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    return this.analyticsService.revenueHistory(userId, Number(months));
  }
}
