import { Injectable } from "@nestjs/common";

@Injectable()
export class AnalyticsService {
  earnings(period: string, startDate?: string, endDate?: string) {
    return {
      period,
      startDate,
      endDate,
      totalRevenue: 1234.56,
      totalOrders: 89,
    };
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
