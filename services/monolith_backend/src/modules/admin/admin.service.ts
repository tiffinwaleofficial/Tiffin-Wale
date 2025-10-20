import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OrderStatus } from "../../common/interfaces/order.interface";
import { UserRole } from "../../common/interfaces/user.interface";
import { Order } from "../order/schemas/order.schema";
import { User } from "../user/schemas/user.schema";
import { MenuItem } from "../menu/schemas/menu-item.schema";
import { Category } from "../menu/schemas/category.schema";
import {
  SystemStatsDto,
  UserCountsDto,
  OrderCountsDto,
  MenuCountsDto,
  RecentActivityDto,
  UserStatsDto,
  OrderStatsDto,
  PartnerStatsDto,
  RevenueStatsDto,
  UserCountsDetailedDto,
  UserGrowthDto,
  UserActivityDto,
  UserRetentionDto,
  OrderVolumeDto,
  OrderPerformanceDto,
  OrderRevenueDto,
  PartnerCountsDto,
  PartnerGrowthDto,
  PartnerPerformanceDto,
  TopPartnerDto,
  PartnerCategoriesDto,
  RevenueSummaryDto,
  RevenueTrendDto,
  RevenueBreakdownDto,
  TopSellingItemDto,
  SystemSettingsDto,
} from "./dto";
import { Partner } from "../partner/schemas/partner.schema";
import { CustomerProfile } from "../customer/schemas/customer-profile.schema";
import { Subscription } from "../subscription/schemas/subscription.schema";
import { Payment } from "../payment/schemas/payment.schema";
import { Feedback } from "../feedback/schemas/feedback.schema";
import { Meal } from "../meal/schemas/meal.schema";

interface DashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingOrders: number;
  newUsersToday: number;
  newPartnersToday: number;
  ordersToday: number;
  revenueToday: number;
  revenueThisMonth: number;
  growthMetrics: {
    userGrowth: number;
    partnerGrowth: number;
    revenueGrowth: number;
  };
}

interface ActivityLog {
  id: string;
  type: "order" | "partner" | "customer" | "support" | "payout" | "system";
  refId: string;
  description: string;
  time: string;
  metadata?: any;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(CustomerProfile.name)
    private customerModel: Model<CustomerProfile>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    @InjectModel(Meal.name) private mealModel: Model<Meal>,
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  /**
   * Get system-wide statistics
   */
  async getSystemStats(): Promise<SystemStatsDto> {
    // Get user statistics
    const userCounts = await this.getUserCounts();

    // Get order statistics
    const orderCounts = await this.getOrderCounts();

    // Get menu statistics
    const menuCounts = await this.getMenuCounts();

    // Get recent activity
    const recentActivity = await this.getRecentActivity();

    // Return compiled stats
    return {
      users: userCounts,
      orders: orderCounts,
      menu: menuCounts,
      recentActivity,
      timestamp: new Date(),
    };
  }

  /**
   * Get detailed user statistics for admin dashboard
   */
  async getUserStats(): Promise<UserStatsDto> {
    // Get user counts
    const counts = await this.getUserCountsDetailed();

    // Get user growth data
    const growth = await this.getUserGrowthData();

    // Get user activity metrics
    const activity = await this.getUserActivityMetrics();

    // Get user retention rates
    const retention = await this.getUserRetentionRates();

    // Return compiled user stats
    return {
      counts,
      growth,
      activity,
      retention,
      timestamp: new Date(),
    };
  }

  /**
   * Helper method to get detailed user counts by role
   */
  private async getUserCountsDetailed(): Promise<UserCountsDetailedDto> {
    const total = await this.userModel.countDocuments();
    const customers = await this.userModel.countDocuments({
      role: UserRole.CUSTOMER,
    });
    const businessPartners = await this.userModel.countDocuments({
      role: UserRole.BUSINESS,
    });
    const admins = await this.userModel.countDocuments({
      role: { $in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    });

    return {
      total,
      customers,
      businessPartners,
      admins,
    };
  }

  /**
   * Helper method to get user growth data (last 30 days)
   */
  private async getUserGrowthData(): Promise<UserGrowthDto[]> {
    const growthData: UserGrowthDto[] = [];

    // Get data for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // For each day in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));

      // Count users registered up to and including this day
      const count = await this.userModel.countDocuments({
        createdAt: { $lte: new Date(date.setHours(23, 59, 59, 999)) },
      });

      growthData.push({
        date: startOfDay.toISOString().split("T")[0], // Format as YYYY-MM-DD
        count,
      });
    }

    return growthData;
  }

  /**
   * Helper method to get user activity metrics
   */
  private async getUserActivityMetrics(): Promise<UserActivityDto> {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Count users who have placed orders within these timeframes
    const activeUsers24h = await this.orderModel
      .distinct("customer")
      .countDocuments({
        createdAt: { $gte: last24Hours },
      });

    const activeUsers7d = await this.orderModel
      .distinct("customer")
      .countDocuments({
        createdAt: { $gte: last7Days },
      });

    const activeUsers30d = await this.orderModel
      .distinct("customer")
      .countDocuments({
        createdAt: { $gte: last30Days },
      });

    return {
      last24Hours: activeUsers24h,
      last7Days: activeUsers7d,
      last30Days: activeUsers30d,
    };
  }

  /**
   * Helper method to calculate user retention rates
   */
  private async getUserRetentionRates(): Promise<UserRetentionDto> {
    // For calculation of retention, we need:
    // 1. Users who registered X days ago
    // 2. Of those users, how many were active after registration

    const today = new Date();

    // Day 1 retention
    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const usersRegisteredTwoDaysAgo = await this.userModel.countDocuments({
      createdAt: {
        $gte: new Date(twoDaysAgo.setHours(0, 0, 0, 0)),
        $lt: new Date(twoDaysAgo.setHours(23, 59, 59, 999)),
      },
    });

    const activeUsersFromTwoDaysAgo = await this.orderModel
      .distinct("customer")
      .countDocuments({
        customer: {
          $in: await this.userModel
            .find({
              createdAt: {
                $gte: new Date(twoDaysAgo.setHours(0, 0, 0, 0)),
                $lt: new Date(twoDaysAgo.setHours(23, 59, 59, 999)),
              },
            })
            .distinct("_id"),
        },
        createdAt: { $gte: oneDayAgo },
      });

    // Day 7 retention
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const eightDaysAgo = new Date(today);
    eightDaysAgo.setDate(today.getDate() - 8);

    const usersRegisteredEightDaysAgo = await this.userModel.countDocuments({
      createdAt: {
        $gte: new Date(eightDaysAgo.setHours(0, 0, 0, 0)),
        $lt: new Date(eightDaysAgo.setHours(23, 59, 59, 999)),
      },
    });

    const activeUsersFromEightDaysAgo = await this.orderModel
      .distinct("customer")
      .countDocuments({
        customer: {
          $in: await this.userModel
            .find({
              createdAt: {
                $gte: new Date(eightDaysAgo.setHours(0, 0, 0, 0)),
                $lt: new Date(eightDaysAgo.setHours(23, 59, 59, 999)),
              },
            })
            .distinct("_id"),
        },
        createdAt: { $gte: sevenDaysAgo },
      });

    // Day 30 retention
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const thirtyOneDaysAgo = new Date(today);
    thirtyOneDaysAgo.setDate(today.getDate() - 31);

    const usersRegisteredThirtyOneDaysAgo = await this.userModel.countDocuments(
      {
        createdAt: {
          $gte: new Date(thirtyOneDaysAgo.setHours(0, 0, 0, 0)),
          $lt: new Date(thirtyOneDaysAgo.setHours(23, 59, 59, 999)),
        },
      },
    );

    const activeUsersFromThirtyOneDaysAgo = await this.orderModel
      .distinct("customer")
      .countDocuments({
        customer: {
          $in: await this.userModel
            .find({
              createdAt: {
                $gte: new Date(thirtyOneDaysAgo.setHours(0, 0, 0, 0)),
                $lt: new Date(thirtyOneDaysAgo.setHours(23, 59, 59, 999)),
              },
            })
            .distinct("_id"),
        },
        createdAt: { $gte: thirtyDaysAgo },
      });

    // Calculate rates (handle division by zero)
    const day1 =
      usersRegisteredTwoDaysAgo > 0
        ? activeUsersFromTwoDaysAgo / usersRegisteredTwoDaysAgo
        : 0;
    const day7 =
      usersRegisteredEightDaysAgo > 0
        ? activeUsersFromEightDaysAgo / usersRegisteredEightDaysAgo
        : 0;
    const day30 =
      usersRegisteredThirtyOneDaysAgo > 0
        ? activeUsersFromThirtyOneDaysAgo / usersRegisteredThirtyOneDaysAgo
        : 0;

    return {
      day1,
      day7,
      day30,
    };
  }

  /**
   * Helper method to get user counts by role
   */
  private async getUserCounts(): Promise<UserCountsDto> {
    const totalUsers = await this.userModel.countDocuments();
    const customers = await this.userModel.countDocuments({
      role: UserRole.CUSTOMER,
    });
    const businessPartners = await this.userModel.countDocuments({
      role: UserRole.BUSINESS,
    });
    const admins = await this.userModel.countDocuments({
      role: { $in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    });

    return {
      total: totalUsers,
      customers,
      businessPartners,
      admins,
    };
  }

  /**
   * Helper method to get order counts by status
   */
  private async getOrderCounts(): Promise<OrderCountsDto> {
    const totalOrders = await this.orderModel.countDocuments();
    const pending = await this.orderModel.countDocuments({
      status: OrderStatus.PENDING,
    });
    const confirmed = await this.orderModel.countDocuments({
      status: OrderStatus.CONFIRMED,
    });
    const preparing = await this.orderModel.countDocuments({
      status: OrderStatus.PREPARING,
    });
    const ready = await this.orderModel.countDocuments({
      status: OrderStatus.READY,
    });
    const delivered = await this.orderModel.countDocuments({
      status: OrderStatus.DELIVERED,
    });
    const cancelled = await this.orderModel.countDocuments({
      status: OrderStatus.CANCELLED,
    });

    return {
      total: totalOrders,
      pending,
      confirmed,
      preparing,
      ready,
      delivered,
      cancelled,
    };
  }

  /**
   * Helper method to get menu statistics
   */
  private async getMenuCounts(): Promise<MenuCountsDto> {
    const items = await this.menuItemModel.countDocuments();
    const categories = await this.categoryModel.countDocuments();

    return {
      items,
      categories,
    };
  }

  /**
   * Helper method to get recent activity metrics
   */
  private async getRecentActivity(): Promise<RecentActivityDto> {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const newUsers = await this.userModel.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    const newOrders = await this.orderModel.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    const completedDeliveries = await this.orderModel.countDocuments({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: last24Hours },
    });

    return {
      newUsers,
      newOrders,
      completedDeliveries,
    };
  }

  /**
   * Get detailed order statistics for admin dashboard
   */
  async getOrderStats(): Promise<OrderStatsDto> {
    // Get detailed order counts by status
    const counts = await this.getOrderCounts();

    // Get order volume over time (last 30 days)
    const volume = await this.getOrderVolumeData();

    // Get order performance metrics
    const performance = await this.getOrderPerformanceMetrics();

    // Get order revenue metrics
    const revenue = await this.getOrderRevenueMetrics();

    // Return compiled order stats
    return {
      counts,
      volume,
      performance,
      revenue,
      timestamp: new Date(),
    };
  }

  /**
   * Helper method to get order volume data (last 30 days)
   */
  private async getOrderVolumeData(): Promise<OrderVolumeDto[]> {
    const volumeData: OrderVolumeDto[] = [];

    // Get data for the last 30 days
    const today = new Date();

    // For each day in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      // Count orders for this day
      const count = await this.orderModel.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      volumeData.push({
        date: startOfDay.toISOString().split("T")[0], // Format as YYYY-MM-DD
        count,
      });
    }

    return volumeData;
  }

  /**
   * Helper method to get order performance metrics
   */
  private async getOrderPerformanceMetrics(): Promise<OrderPerformanceDto> {
    // Calculate average preparation time (from confirmed to ready)
    const prepTimeOrders = await this.orderModel
      .find({
        status: { $in: [OrderStatus.READY, OrderStatus.DELIVERED] },
      })
      .select("createdAt updatedAt status");

    let totalPrepTime = 0;
    let prepOrderCount = 0;

    for (const order of prepTimeOrders) {
      // Simple estimation for now - will need order history tracking for accuracy
      const prepTime =
        (order.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 60); // in minutes
      if (prepTime > 0 && prepTime < 120) {
        // Sanity check to exclude anomalies
        totalPrepTime += prepTime;
        prepOrderCount++;
      }
    }

    const avgPrepTime = prepOrderCount > 0 ? totalPrepTime / prepOrderCount : 0;

    // Calculate average delivery time (from ready to delivered)
    // Note: This is a simplification; proper tracking would require order status history
    const deliveryTimeOrders = await this.orderModel
      .find({
        status: OrderStatus.DELIVERED,
      })
      .select("createdAt updatedAt");

    let totalDeliveryTime = 0;
    let deliveryOrderCount = 0;

    for (const order of deliveryTimeOrders) {
      const deliveryTime =
        (order.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 60); // in minutes
      if (deliveryTime > 0 && deliveryTime < 180) {
        // Sanity check
        totalDeliveryTime += deliveryTime;
        deliveryOrderCount++;
      }
    }

    const avgDeliveryTime =
      deliveryOrderCount > 0 ? totalDeliveryTime / deliveryOrderCount : 0;

    // Calculate on-time delivery rate (simplification)
    const totalDelivered = await this.orderModel.countDocuments({
      status: OrderStatus.DELIVERED,
    });
    const lateDeliveries = await this.orderModel.countDocuments({
      status: OrderStatus.DELIVERED,
      // This would need a proper "expectedDeliveryTime" field in the schema
      // For now, we'll simulate with a random proportion
      // In a real implementation, you'd compare with expected delivery times
    });

    // For the simulation, we'll just use a fixed rate
    const onTimeRate =
      totalDelivered > 0
        ? (totalDelivered - lateDeliveries) / totalDelivered
        : 0.92;

    // Calculate cancellation rate
    const totalOrders = await this.orderModel.countDocuments();
    const cancelledOrders = await this.orderModel.countDocuments({
      status: OrderStatus.CANCELLED,
    });

    const cancellationRate =
      totalOrders > 0 ? cancelledOrders / totalOrders : 0;

    return {
      avgPrepTime,
      avgDeliveryTime,
      onTimeRate,
      cancellationRate,
    };
  }

  /**
   * Helper method to get order revenue metrics
   */
  private async getOrderRevenueMetrics(): Promise<OrderRevenueDto> {
    // Calculate total revenue from all completed orders
    const allCompletedOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
    });

    let totalRevenue = 0;
    for (const order of allCompletedOrders) {
      totalRevenue += order.totalAmount || 0;
    }

    // Calculate average order value
    const averageOrderValue =
      allCompletedOrders.length > 0
        ? totalRevenue / allCompletedOrders.length
        : 0;

    // Calculate revenue for today
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const todayOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: startOfToday, $lte: endOfToday },
    });

    let todayRevenue = 0;
    for (const order of todayOrders) {
      todayRevenue += order.totalAmount || 0;
    }

    // Calculate revenue for this week
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const weekOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: startOfWeek, $lte: endOfToday },
    });

    let weekRevenue = 0;
    for (const order of weekOrders) {
      weekRevenue += order.totalAmount || 0;
    }

    // Calculate revenue for this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Start of month
    startOfMonth.setHours(0, 0, 0, 0);

    const monthOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: startOfMonth, $lte: endOfToday },
    });

    let monthRevenue = 0;
    for (const order of monthOrders) {
      monthRevenue += order.totalAmount || 0;
    }

    return {
      total: totalRevenue,
      averageOrderValue,
      today: todayRevenue,
      thisWeek: weekRevenue,
      thisMonth: monthRevenue,
    };
  }

  /**
   * Get detailed partner statistics for admin dashboard
   */
  async getPartnerStats(): Promise<PartnerStatsDto> {
    // Get partner counts
    const counts = await this.getPartnerCounts();

    // Get partner growth data (last 30 days)
    const growth = await this.getPartnerGrowthData();

    // Get partner performance metrics
    const performance = await this.getPartnerPerformanceMetrics();

    // Get top performing partners
    const topPartners = await this.getTopPartners();

    // Get partner categories distribution
    const categories = await this.getPartnerCategories();

    // Return compiled partner stats
    return {
      counts,
      growth,
      performance,
      topPartners,
      categories,
      timestamp: new Date(),
    };
  }

  /**
   * Helper method to get partner counts
   */
  private async getPartnerCounts(): Promise<PartnerCountsDto> {
    const total = await this.userModel.countDocuments({
      role: UserRole.BUSINESS,
    });

    // Count active partners (those with at least one menu item)
    const activePartnerIds = await this.menuItemModel.distinct("partner");
    const active = await this.userModel.countDocuments({
      _id: { $in: activePartnerIds },
      role: UserRole.BUSINESS,
    });

    // Count pending partners (assuming we have a status field; this is a simplification)
    const pending = total - active;

    return {
      total,
      active,
      pending,
    };
  }

  /**
   * Helper method to get partner growth data (last 30 days)
   */
  private async getPartnerGrowthData(): Promise<PartnerGrowthDto[]> {
    const growthData: PartnerGrowthDto[] = [];

    // Get data for the last 30 days
    const today = new Date();

    // For each day in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));

      // Count partners registered up to and including this day
      const count = await this.userModel.countDocuments({
        role: UserRole.BUSINESS,
        createdAt: { $lte: new Date(date.setHours(23, 59, 59, 999)) },
      });

      growthData.push({
        date: startOfDay.toISOString().split("T")[0], // Format as YYYY-MM-DD
        count,
      });
    }

    return growthData;
  }

  /**
   * Helper method to get partner performance metrics
   */
  private async getPartnerPerformanceMetrics(): Promise<PartnerPerformanceDto> {
    // Calculate average partner rating
    // This is a simplification; in a real system, you'd have a reviews collection
    const avgRating = 4.3; // Mock value for now

    // Calculate average preparation time for all partners
    const prepTimeOrders = await this.orderModel
      .find({
        status: { $in: [OrderStatus.READY, OrderStatus.DELIVERED] },
      })
      .select("createdAt updatedAt status");

    let totalPrepTime = 0;
    let prepOrderCount = 0;

    for (const order of prepTimeOrders) {
      const prepTime =
        (order.updatedAt.getTime() - order.createdAt.getTime()) / (1000 * 60); // in minutes
      if (prepTime > 0 && prepTime < 120) {
        // Sanity check
        totalPrepTime += prepTime;
        prepOrderCount++;
      }
    }

    const avgPrepTime = prepOrderCount > 0 ? totalPrepTime / prepOrderCount : 0;

    // Calculate fulfillment rate (orders completed / orders received)
    const totalOrders = await this.orderModel.countDocuments();
    const completedOrders = await this.orderModel.countDocuments({
      status: OrderStatus.DELIVERED,
    });

    const fulfillmentRate = totalOrders > 0 ? completedOrders / totalOrders : 0;

    // Calculate average daily orders per partner
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const dailyOrders = await this.orderModel.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    const partnerCount = await this.userModel.countDocuments({
      role: UserRole.BUSINESS,
    });

    const avgDailyOrders = partnerCount > 0 ? dailyOrders / partnerCount : 0;

    return {
      avgRating,
      avgPrepTime,
      fulfillmentRate,
      avgDailyOrders,
    };
  }

  /**
   * Helper method to get top performing partners
   */
  private async getTopPartners(): Promise<TopPartnerDto[]> {
    // Get all business user accounts with necessary fields
    const partners = await this.userModel
      .find({
        role: UserRole.BUSINESS,
      })
      .select("_id firstName lastName email")
      .lean();

    const topPartners: TopPartnerDto[] = [];

    // For each partner, aggregate their order data
    for (const partner of partners) {
      // Find all completed orders for this partner
      const orders = await this.orderModel
        .find({
          businessPartner: partner._id, // Using correct field name from Order schema
          status: OrderStatus.DELIVERED,
        })
        .lean();

      if (orders.length === 0) continue;

      // Calculate metrics
      const totalOrders = orders.length;
      let totalRevenue = 0;

      for (const order of orders) {
        totalRevenue += order.totalAmount || 0;
      }

      // Get average rating (would come from a reviews collection in a real app)
      // For now, generate a random rating between 3.5 and 5.0
      const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;

      // Generate a name from the first and last name, or use email as fallback
      const name =
        partner.firstName && partner.lastName
          ? `${partner.firstName} ${partner.lastName}`
          : partner.email;

      topPartners.push({
        id: partner._id.toString(),
        name,
        rating,
        totalOrders,
        totalRevenue,
      });
    }

    // Sort by revenue (highest first) and take top 5
    return topPartners
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }

  /**
   * Helper method to get partner categories distribution
   */
  private async getPartnerCategories(): Promise<PartnerCategoriesDto[]> {
    // Get all categories
    const categories = await this.categoryModel.find().lean();

    const result: PartnerCategoriesDto[] = [];

    // For each category, count how many partners have items in this category
    for (const category of categories) {
      // Find menu items with this category
      const menuItems = await this.menuItemModel
        .find({
          categories: category._id,
        })
        .distinct("partner");

      // Count unique partners
      const count = menuItems.length;

      result.push({
        name: category.name,
        count,
      });
    }

    // Sort by count (highest first)
    return result.sort((a, b) => b.count - a.count);
  }

  /**
   * Get detailed revenue statistics for admin dashboard
   */
  async getRevenueStats(): Promise<RevenueStatsDto> {
    // Get revenue summary
    const summary = await this.getRevenueSummary();

    // Get revenue trends over time
    const trends = await this.getRevenueTrends();

    // Get revenue breakdown by source
    const breakdown = await this.getRevenueBreakdown();

    // Get top selling items
    const topSellingItems = await this.getTopSellingItems();

    // Return compiled revenue stats
    return {
      summary,
      trends,
      breakdown,
      topSellingItems,
      timestamp: new Date(),
    };
  }

  /**
   * Helper method to get revenue summary
   */
  private async getRevenueSummary(): Promise<RevenueSummaryDto> {
    // Calculate total revenue from all completed orders
    const allCompletedOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
    });

    let totalRevenue = 0;
    for (const order of allCompletedOrders) {
      totalRevenue += order.totalAmount || 0;
    }

    // Calculate revenue for today
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const todayOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: startOfToday, $lte: endOfToday },
    });

    let todayRevenue = 0;
    for (const order of todayOrders) {
      todayRevenue += order.totalAmount || 0;
    }

    // Calculate revenue for this week
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const weekOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: startOfWeek, $lte: endOfToday },
    });

    let weekRevenue = 0;
    for (const order of weekOrders) {
      weekRevenue += order.totalAmount || 0;
    }

    // Calculate revenue for this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Start of month
    startOfMonth.setHours(0, 0, 0, 0);

    const monthOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: startOfMonth, $lte: endOfToday },
    });

    let monthRevenue = 0;
    for (const order of monthOrders) {
      monthRevenue += order.totalAmount || 0;
    }

    // Calculate growth rate (compared to last month)
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const lastMonthOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
      updatedAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    });

    let lastMonthRevenue = 0;
    for (const order of lastMonthOrders) {
      lastMonthRevenue += order.totalAmount || 0;
    }

    const growthRate =
      lastMonthRevenue > 0
        ? (monthRevenue - lastMonthRevenue) / lastMonthRevenue
        : 0;

    // Calculate average order value
    const averageOrderValue =
      allCompletedOrders.length > 0
        ? totalRevenue / allCompletedOrders.length
        : 0;

    return {
      total: totalRevenue,
      today: todayRevenue,
      thisWeek: weekRevenue,
      thisMonth: monthRevenue,
      growthRate,
      averageOrderValue,
    };
  }

  /**
   * Helper method to get revenue trends over time
   */
  private async getRevenueTrends(): Promise<RevenueTrendDto[]> {
    const trends: RevenueTrendDto[] = [];

    // Get data for the last 30 days
    const today = new Date();

    // For each day in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (29 - i));
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      // Get orders for this day
      const dayOrders = await this.orderModel.find({
        status: OrderStatus.DELIVERED,
        updatedAt: { $gte: startOfDay, $lte: endOfDay },
      });

      // Calculate total revenue for this day
      let amount = 0;
      for (const order of dayOrders) {
        amount += order.totalAmount || 0;
      }

      trends.push({
        date: startOfDay.toISOString().split("T")[0], // Format as YYYY-MM-DD
        amount,
      });
    }

    return trends;
  }

  /**
   * Helper method to get revenue breakdown by source
   */
  private async getRevenueBreakdown(): Promise<RevenueBreakdownDto> {
    // In a real implementation, this would calculate various revenue sources
    // For this example, we'll use approximate values based on total revenue

    // Get total revenue
    const allCompletedOrders = await this.orderModel.find({
      status: OrderStatus.DELIVERED,
    });

    let totalRevenue = 0;
    for (const order of allCompletedOrders) {
      totalRevenue += order.totalAmount || 0;
    }

    // Approximate breakdown (in a real system, you'd have these fields in the order)
    const food = totalRevenue * 0.75; // 75% of revenue from food
    const deliveryFees = totalRevenue * 0.15; // 15% from delivery fees
    const serviceFees = totalRevenue * 0.08; // 8% from service fees
    const other = totalRevenue * 0.02; // 2% from other sources

    return {
      food,
      deliveryFees,
      serviceFees,
      other,
    };
  }

  /**
   * Helper method to get top selling items
   */
  private async getTopSellingItems(): Promise<TopSellingItemDto[]> {
    // This would ideally use MongoDB aggregation for better performance

    // Get all menu items with populated business partner
    const menuItems = await this.menuItemModel
      .find()
      .populate("businessPartner", "firstName lastName email")
      .lean();

    // For each menu item, calculate total units sold and revenue
    const itemStats: TopSellingItemDto[] = [];

    for (const item of menuItems) {
      // Skip if no business partner
      if (!item.businessPartner) continue;

      // Type assertion for TypeScript
      const businessPartner = item.businessPartner as any;

      // Find orders containing this item (simplified approach)
      const orders = await this.orderModel
        .find({
          status: OrderStatus.DELIVERED,
          businessPartner: businessPartner._id,
          // In a real app, you'd have a way to look for this specific item in the order
        })
        .lean();

      // Skip items with no orders
      if (orders.length === 0) continue;

      // For this simulation, we'll estimate units sold based on order count
      // In a real app, you'd count actual order line items
      const unitsSold = Math.floor(orders.length * (1 + Math.random())); // Random multiplier for variation

      // Calculate revenue (price * units sold)
      const revenue = item.price * unitsSold;

      // Generate a name from the first and last name, or use email as fallback
      const partnerName =
        businessPartner.firstName && businessPartner.lastName
          ? `${businessPartner.firstName} ${businessPartner.lastName}`
          : businessPartner.email;

      // Add to stats
      itemStats.push({
        id: item._id.toString(),
        name: item.name,
        unitsSold,
        revenue,
        partnerId: businessPartner._id.toString(),
        partnerName,
      });
    }

    // Sort by revenue (highest first) and take top 10
    return itemStats.sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(
    settings: SystemSettingsDto,
  ): Promise<SystemSettingsDto> {
    // In a real implementation, you would update settings in a database
    // For this example, we'll just return the input settings with a mock ID and timestamp

    return {
      ...settings,
      id: "6507e9ce0cb7ea2d3c9d10c1", // Mock ID
      updatedAt: new Date(),
    } as any; // Cast as any for the additional fields not in the DTO
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    // Parallel queries for better performance
    const [
      totalUsers,
      totalPartners,
      totalOrders,
      activeSubscriptions,
      pendingOrders,
      newUsersToday,
      newPartnersToday,
      ordersToday,
      revenueData,
      revenueTodayData,
      revenueThisMonthData,
      lastMonthRevenueData,
      lastMonthUsers,
      lastMonthPartners,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: "CUSTOMER" }),
      this.partnerModel.countDocuments(),
      this.orderModel.countDocuments(),
      this.subscriptionModel.countDocuments({ status: "ACTIVE" }),
      this.orderModel.countDocuments({
        status: { $in: ["PENDING", "CONFIRMED"] },
      }),
      this.userModel.countDocuments({
        role: "CUSTOMER",
        createdAt: { $gte: today },
      }),
      this.partnerModel.countDocuments({ createdAt: { $gte: today } }),
      this.orderModel.countDocuments({ createdAt: { $gte: today } }),
      this.orderModel.aggregate([
        { $match: { status: "DELIVERED" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      this.orderModel.aggregate([
        { $match: { status: "DELIVERED", createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      this.orderModel.aggregate([
        { $match: { status: "DELIVERED", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      this.orderModel.aggregate([
        {
          $match: {
            status: "DELIVERED",
            createdAt: { $gte: lastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      this.userModel.countDocuments({
        role: "CUSTOMER",
        createdAt: { $gte: lastMonth, $lte: endOfLastMonth },
      }),
      this.partnerModel.countDocuments({
        createdAt: { $gte: lastMonth, $lte: endOfLastMonth },
      }),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const revenueToday = revenueTodayData[0]?.total || 0;
    const revenueThisMonth = revenueThisMonthData[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueData[0]?.total || 0;

    // Calculate growth metrics
    const userGrowth =
      lastMonthUsers > 0
        ? ((newUsersToday * 30 - lastMonthUsers) / lastMonthUsers) * 100
        : 0;
    const partnerGrowth =
      lastMonthPartners > 0
        ? ((newPartnersToday * 30 - lastMonthPartners) / lastMonthPartners) *
          100
        : 0;
    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((revenueThisMonth - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    return {
      totalUsers,
      totalPartners,
      totalOrders,
      totalRevenue,
      activeSubscriptions,
      pendingOrders,
      newUsersToday,
      newPartnersToday,
      ordersToday,
      revenueToday,
      revenueThisMonth,
      growthMetrics: {
        userGrowth: Math.round(userGrowth * 100) / 100,
        partnerGrowth: Math.round(partnerGrowth * 100) / 100,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      },
    };
  }

  async getRecentActivities(limit = 10): Promise<ActivityLog[]> {
    const activities: ActivityLog[] = [];

    // Get recent orders
    const recentOrders = await this.orderModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(Math.floor(limit / 2))
      .populate("customerId", "firstName lastName")
      .populate("partnerId", "name")
      .lean();

    // Get recent partners
    const recentPartners = await this.partnerModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(Math.floor(limit / 4))
      .lean();

    // Get recent customers
    const recentCustomers = await this.userModel
      .find({ role: "CUSTOMER" })
      .sort({ createdAt: -1 })
      .limit(Math.floor(limit / 4))
      .lean();

    // Format order activities
    recentOrders.forEach((order) => {
      activities.push({
        id: order._id.toString(),
        type: "order",
        refId: order._id.toString().slice(-6),
        description: `Order ${order._id.toString().slice(-6)} ${order.status.toLowerCase()}`,
        time: this.formatTimeAgo(order.createdAt),
        metadata: {
          amount: order.totalAmount,
          customer: order.customer,
          partner: order.businessPartner,
          status: order.status,
        },
      });
    });

    // Format partner activities
    recentPartners.forEach((partner) => {
      activities.push({
        id: partner._id.toString(),
        type: "partner",
        refId: partner._id.toString(),
        description: `New partner '${partner.businessName}' ${partner.status === "approved" ? "onboarded" : "registered"}`,
        time: this.formatTimeAgo(new Date()),
        metadata: { name: partner.businessName, status: partner.status },
      });
    });

    // Format customer activities
    recentCustomers.forEach((customer) => {
      activities.push({
        id: customer._id.toString(),
        type: "customer",
        refId: customer._id.toString(),
        description: `New customer '${customer.firstName} ${customer.lastName}' registered`,
        time: this.formatTimeAgo(customer.createdAt),
        metadata: {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
        },
      });
    });

    // Sort by time and return limited results
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  }

  // Generate activity logs from recent orders
  private async generateOrderActivities(orders: any[]): Promise<ActivityLog[]> {
    return orders.map((order) => ({
      id: order._id.toString(),
      type: "order",
      refId: order._id.toString().slice(-6), // Use last 6 chars of ID instead of orderNumber
      description: `Order ${order._id.toString().slice(-6)} ${order.status.toLowerCase()}`,
      time: this.formatTimeAgo(order.createdAt),
      metadata: {
        customer: order.customer,
        partner: order.businessPartner,
        amount: order.totalAmount,
      },
    }));
  }

  // Generate activity logs from recent partners
  private async generatePartnerActivities(
    partners: any[],
  ): Promise<ActivityLog[]> {
    return partners.map((partner) => ({
      id: partner._id.toString(),
      type: "partner",
      refId: partner._id.toString(),
      description: `New partner '${partner.businessName}' ${partner.status === "approved" ? "onboarded" : "registered"}`,
      time: this.formatTimeAgo(partner.createdAt),
      metadata: { name: partner.businessName, status: partner.status },
    }));
  }

  async getAllOrders(
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: string;
      search?: string;
    } = {},
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$or = [
        { _id: { $regex: filters.search, $options: "i" } },
        { deliveryAddress: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .populate("customer")
        .populate("businessPartner")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.orderModel.countDocuments(query),
    ]);

    const formattedOrders = orders.map((order) => {
      const customer = order.customer as any;
      const partner = order.businessPartner as any;

      return {
        id: order._id.toString(),
        orderId: order._id.toString().slice(-6),
        customerId: customer?._id?.toString(),
        customerName: customer
          ? `${customer.firstName} ${customer.lastName}`
          : "Unknown",
        partnerId: partner?._id?.toString(),
        partnerName: partner?.businessName || "Unknown",
        tiffinType: "Lunch", // Default value since field doesn't exist
        status: order.status,
        totalAmount: order.totalAmount,
        paymentStatus: order.isPaid ? "Paid" : "Pending",
        orderDate: order.createdAt.toISOString(),
        deliveryDate: order.scheduledDeliveryTime?.toISOString() || null,
        deliveryAddress: order.deliveryAddress,
        deliveryPartner: null, // Field doesn't exist in schema
      };
    });

    return {
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(
    id: string,
    status: string,
    adminId: string,
    reason?: string,
  ) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status as any;
    if (reason) {
      // Add reason to delivery instructions since notes field doesn't exist
      order.deliveryInstructions = reason;
    }
    await order.save();

    return {
      message: "Order status updated successfully",
      order: {
        id: order._id.toString(),
        status: order.status,
        updatedAt: order.updatedAt,
      },
    };
  }

  async getAllPartners(
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: string;
      search?: string;
    } = {},
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$or = [
        { businessName: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [partners, total] = await Promise.all([
      this.partnerModel
        .find(query)
        .populate("user")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.partnerModel.countDocuments(query),
    ]);

    const formattedPartners = partners.map((partner) => {
      const user = partner.user as any;
      return {
        id: partner._id.toString(),
        name: partner.businessName,
        contactPerson: user?.firstName + " " + user?.lastName || "Unknown",
        mobile: user?.phoneNumber || "Not provided",
        email: user?.email || "Not provided",
        registeredDate: new Date().toISOString().split("T")[0], // Use current date as fallback
        status: partner.status,
        city: partner.address?.city || "Unknown",
        commissionRate: 10, // Default value since field doesn't exist
      };
    });

    return {
      partners: formattedPartners,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updatePartnerStatus(partnerId: string, status: string) {
    const partner = await this.partnerModel.findById(partnerId);
    if (!partner) {
      throw new NotFoundException("Partner not found");
    }

    const validStatuses = ["ACTIVE", "INACTIVE", "PENDING_APPROVAL", "BANNED"];
    if (!validStatuses.includes(status.toUpperCase())) {
      throw new BadRequestException("Invalid status");
    }

    partner.status = status.toUpperCase() as any;
    await partner.save();

    return partner;
  }

  async getAllCustomers(page: number, limit: number, filters: any) {
    const skip = (page - 1) * limit;
    const query: any = { role: "CUSTOMER" };

    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: "i" } },
        { lastName: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
        { phoneNumber: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(query),
    ]);

    return {
      customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllSubscriptions(page: number, limit: number, filters: any) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.status) {
      query.status = filters.status.toUpperCase();
    }

    if (filters.planType) {
      query["plan.type"] = filters.planType;
    }

    const [subscriptions, total] = await Promise.all([
      this.subscriptionModel
        .find(query)
        .populate("customerId", "firstName lastName email")
        .populate("planId", "name type price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.subscriptionModel.countDocuments(query),
    ]);

    return {
      subscriptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRevenueAnalytics(
    period: string,
    startDate?: string,
    endDate?: string,
  ) {
    const query: any = { status: "DELIVERED" };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    } else {
      const now = new Date();
      switch (period) {
        case "today":
          query.createdAt = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
          break;
        case "week":
          query.createdAt = {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          };
          break;
        case "month":
          query.createdAt = {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          };
          break;
      }
    }

    const revenueData = await this.orderModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    return (
      revenueData[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }
    );
  }

  async getAllSupportTickets(
    page: number,
    limit: number,
    filters?: { status?: string; priority?: string },
  ) {
    // TODO: Implement when support ticket schema is ready
    return {
      tickets: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  async updateSupportTicket(
    id: string,
    body: { status?: string; response?: string; priority?: string },
    updatedBy: string,
  ) {
    // TODO: Implement when support ticket schema is ready
    return { message: "Support ticket updated", id, updatedBy };
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
}
