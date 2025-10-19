import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly redisService: RedisService) {}
  async earnings(period: string, startDate?: string, endDate?: string) {
    const cacheKey = `earnings:${period}:${startDate || "all"}:${endDate || "all"}`;

    // Check Redis cache first
    const cachedData = await this.redisService.getAnalytics(
      "earnings",
      `${period}_${startDate}_${endDate}`,
    );
    if (cachedData) {
      return cachedData;
    }

    // Generate analytics data (in real implementation, this would query the database)
    const data = {
      period,
      startDate,
      endDate,
      totalRevenue: 1234.56,
      totalOrders: 89,
      timestamp: new Date().toISOString(),
    };

    // Cache the analytics data
    await this.redisService.cacheAnalytics(
      "earnings",
      data,
      `${period}_${startDate}_${endDate}`,
    );

    return data;
  }

  orderStats(period: string) {
    return {
      period,
      orders: {
        pending: 12,
        preparing: 5,
        delivered: 60,
        cancelled: 2,
      },
    };
  }

  revenueHistory(months: number) {
    return Array.from({ length: months }).map((_, i) => ({
      month: i + 1,
      revenue: Math.round(Math.random() * 5000) / 100,
    }));
  }
}
