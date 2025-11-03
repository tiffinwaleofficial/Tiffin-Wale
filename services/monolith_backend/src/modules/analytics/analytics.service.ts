import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RedisService } from "../redis/redis.service";
import { Subscription } from "../subscription/schemas/subscription.schema";
import { SubscriptionPlan } from "../subscription/schemas/subscription-plan.schema";
import { Order } from "../order/schemas/order.schema";
import { PartnerService } from "../partner/partner.service";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(SubscriptionPlan.name)
    private readonly subscriptionPlanModel: Model<SubscriptionPlan>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly partnerService: PartnerService,
  ) {}

  async earnings(
    userId: string,
    period: string,
    startDate?: string,
    endDate?: string,
  ) {
    const partner = await this.partnerService.findByUserId(userId);
    if (!partner) {
      throw new Error("Partner not found");
    }

    const partnerId = partner._id.toString();

    const cachedData = await this.redisService.getAnalytics(
      "earnings",
      `${partnerId}_${period}_${startDate || "all"}_${endDate || "all"}`,
    );
    if (cachedData) {
      return cachedData;
    }

    // Calculate date range based on period
    const now = new Date();
    let dateFilter: any = {};

    if (period === "today") {
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);
      dateFilter = {
        createdAt: { $gte: todayStart, $lt: todayEnd },
      };
    } else if (period === "week") {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      dateFilter = {
        createdAt: { $gte: weekStart },
      };
    } else if (period === "month") {
      const monthStart = new Date(now);
      monthStart.setMonth(monthStart.getMonth() - 1);
      dateFilter = {
        createdAt: { $gte: monthStart },
      };
    } else if (period === "all") {
      // No date filter for "all"
      dateFilter = {};
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const partnerPlans = await this.subscriptionPlanModel
      .find({ partner: partnerId })
      .select("_id")
      .exec();
    const planIds = partnerPlans.map((plan) => plan._id);

    const subscriptionQuery: any = {
      plan: { $in: planIds },
      ...dateFilter,
    };

    const subscriptions = await this.subscriptionModel
      .find(subscriptionQuery)
      .populate("plan")
      .exec();

    const totalRevenue = subscriptions.reduce(
      (sum, sub) => sum + (sub.totalAmount || 0),
      0,
    );

    let totalOrders = 0;
    for (const subscription of subscriptions) {
      const plan = subscription.plan as any;
      if (!plan) continue;

      const startDate = new Date(subscription.startDate);
      const endDate = new Date(subscription.endDate);
      const operationalDays = plan.operationalDays || [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      let operationalDaysCount = 0;
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();
        if (operationalDays.includes(dayOfWeek)) {
          operationalDaysCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const mealsPerDay = plan.mealsPerDay || 1;
      totalOrders += operationalDaysCount * mealsPerDay;
    }

    const data = {
      period,
      startDate,
      endDate,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      timestamp: new Date().toISOString(),
    };

    // Cache the analytics data
    await this.redisService.cacheAnalytics(
      "earnings",
      data,
      `${partnerId}_${period}_${startDate || "all"}_${endDate || "all"}`,
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

  async revenueHistory(userId: string, months: number) {
    const partner = await this.partnerService.findByUserId(userId);
    if (!partner) {
      throw new Error("Partner not found");
    }

    const partnerId = partner._id.toString();
    const cacheKey = `revenueHistory:${partnerId}:${months}`;

    const cachedData = await this.redisService.getAnalytics(
      "revenueHistory",
      cacheKey,
    );
    if (cachedData) {
      return cachedData;
    }

    const partnerPlans = await this.subscriptionPlanModel
      .find({ partner: partnerId })
      .select("_id")
      .exec();
    const planIds = partnerPlans.map((plan) => plan._id);

    const now = new Date();
    const history: { month: number; revenue: number }[] = [];

    for (let i = 0; i < months; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        1,
      );

      const subscriptions = await this.subscriptionModel
        .find({
          plan: { $in: planIds },
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        })
        .exec();

      const revenue = subscriptions.reduce(
        (sum, sub) => sum + (sub.totalAmount || 0),
        0,
      );

      history.unshift({
        month: targetDate.getMonth() + 1,
        revenue: Math.round(revenue * 100) / 100,
      });
    }

    await this.redisService.cacheAnalytics("revenueHistory", history, cacheKey);

    return history;
  }
}
