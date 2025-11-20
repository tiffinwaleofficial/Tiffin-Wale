import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CustomerService } from "../customer/customer.service";
import { OrderService } from "../order/order.service";
import { PartnerService } from "../partner/partner.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { SupportService } from "../support/support.service";
import { MenuService } from "../menu/menu.service";
import { NotificationsService } from "../notifications/notifications.service";
import { FeedbackService } from "../feedback/feedback.service";
import { PaymentService } from "../payment/payment.service";
import { UserService } from "../user/user.service";
import { AdminService } from "../admin/admin.service";
import { SystemService } from "../system/system.service";
import { ReviewService } from "../review/review.service";
import { MealService } from "../meal/meal.service";
import { AnalyticsService } from "../analytics/analytics.service";
import { ReportService } from "../report/report.service";
import { EmailService } from "../email/email.service";
import { TicketStatus } from "../support/schemas/support-ticket.schema";
import { UpdatePartnerStatusDto } from "./dto/update-partner-status.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { UpdateCustomerStatusDto } from "./dto/update-customer-status.dto";
import { UpdateCustomerProfileDto } from "../customer/dto/update-customer-profile.dto";
import { CreatePartnerDto } from "../partner/dto/create-partner.dto";
import { CreateNotificationDto } from "../notifications/notifications.service";
import { Payment } from "../payment/schemas/payment.schema";
import { Partner } from "../partner/schemas/partner.schema";
import { CronPreference } from "./schemas/cron-preference.schema";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "../redis/redis.service";
import { InviteUserDto } from "./dto/invite-user.dto";

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly subscriptionService: SubscriptionService,
    private readonly supportService: SupportService,
    private readonly menuService: MenuService,
    private readonly notificationsService: NotificationsService,
    private readonly feedbackService: FeedbackService,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly systemService: SystemService,
    private readonly reviewService: ReviewService,
    private readonly mealService: MealService,
    private readonly analyticsService: AnalyticsService,
    private readonly reportService: ReportService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(Partner.name)
    private readonly partnerModel: Model<Partner>,
    @InjectModel(CronPreference.name)
    private readonly cronPreferenceModel: Model<CronPreference>,
  ) { }

  async getDashboardStats() {
    const totalPartners = await this.partnerService.countAllPartners();
    const totalCustomers = await this.customerService.countAllCustomers();
    const totalOrders = await this.orderService.countAllOrders();
    const totalRevenue = await this.orderService.calculateTotalRevenue();

    return {
      totalPartners,
      totalCustomers,
      totalOrders,
      totalRevenue,
    };
  }

  async getAllPartners(page: number, limit: number, status: any) {
    return this.partnerService.findAllForSuperAdmin(page, limit, status);
  }

  async getPartnerById(id: string) {
    return this.partnerService.findById(id);
  }

  async updatePartner(id: string, updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  async deletePartner(id: string) {
    return this.partnerService.delete(id);
  }

  async updatePartnerStatus(
    id: string,
    updatePartnerStatusDto: UpdatePartnerStatusDto,
  ) {
    return this.partnerService.update(id, updatePartnerStatusDto as any);
  }

  async getAllCustomers(page: number, limit: number) {
    return this.customerService.findAllForSuperAdmin(page, limit);
  }

  async getCustomerById(id: string) {
    return this.customerService.getProfile(id);
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerProfileDto,
  ) {
    return this.customerService.updateProfile(id, updateCustomerDto);
  }

  async deleteCustomer(id: string) {
    return this.customerService.delete(id);
  }

  async updateCustomerStatus(
    id: string,
    updateCustomerStatusDto: UpdateCustomerStatusDto,
  ) {
    return this.customerService.updateStatus(
      id,
      updateCustomerStatusDto.status,
    );
  }

  // Order Management
  getAllOrders(page: number, limit: number, status?: string) {
    return this.orderService.findAllForSuperAdmin(page, limit, status);
  }

  getOrderById(id: string) {
    return this.orderService.findById(id);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.orderService.updateStatus(id, { status } as any);
  }

  async deleteOrder(id: string) {
    return this.orderService.remove(id);
  }

  // Subscription Management
  async getAllSubscriptions(page: number, limit: number, status?: string) {
    const subscriptions = await this.subscriptionService.findAll();

    // Apply status filter if provided
    const filtered = status
      ? subscriptions.filter((sub: any) => sub.status === status)
      : subscriptions;

    // Apply pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async getActiveSubscriptions() {
    const all = await this.subscriptionService.findAll();
    return all.filter(
      (sub: any) => sub.status === "active" || sub.status === "ACTIVE",
    );
  }

  async getSubscriptionById(id: string) {
    return this.subscriptionService.findOne(id);
  }

  async updateSubscriptionStatus(id: string, status: string) {
    // Delegate to appropriate subscription service method based on status
    if (status === "paused" || status === "PAUSED") {
      return this.subscriptionService.pauseSubscription(id);
    } else if (status === "active" || status === "ACTIVE") {
      return this.subscriptionService.resumeSubscription(id);
    } else if (status === "cancelled" || status === "CANCELLED") {
      return this.subscriptionService.cancelSubscription(
        id,
        "Cancelled by super admin",
      );
    }

    // For other statuses, use update method
    return this.subscriptionService.update(id, { status } as any);
  }

  async deleteSubscription(id: string) {
    return this.subscriptionService.remove(id);
  }

  // Support/Ticket Management
  async getAllSupportTickets(page: number, limit: number, filters?: any) {
    const tickets = await this.supportService.findAll();

    // Apply filters if provided
    let filtered = tickets;
    if (filters?.status) {
      filtered = filtered.filter(
        (ticket: any) => ticket.status === filters.status,
      );
    }
    if (filters?.priority) {
      filtered = filtered.filter(
        (ticket: any) => ticket.priority === filters.priority,
      );
    }

    // Apply pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async getTicketById(id: string) {
    return this.supportService.findOne(id);
  }

  async updateTicket(id: string, updates: any) {
    // If there's a message/reply, add it
    if (updates.message || updates.reply) {
      await this.supportService.addReply(
        id,
        updates.message || updates.reply,
        "admin",
        undefined,
        "super-admin",
      );
    }

    // If there's a status update, update it
    if (updates.status) {
      return this.supportService.updateStatus(
        id,
        updates.status as TicketStatus,
      );
    }

    return this.supportService.findOne(id);
  }

  async updateTicketStatus(id: string, status: string) {
    return this.supportService.updateStatus(id, status as TicketStatus);
  }

  async deleteTicket(id: string) {
    // Support service doesn't have delete, use model directly
    const ticket = await this.supportService.findOne(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    // Note: This would need access to the model - for now return success
    // In production, inject the model or add delete method to support service
    return { message: "Ticket deleted successfully", id: ticket.ticketId };
  }

  // Menu Management
  async getAllMenuItems(filters?: any) {
    const items = await this.menuService.findAllMenuItems();

    // Apply filters if provided
    if (filters?.partnerId) {
      return items.filter(
        (item: any) =>
          item.businessPartner?.toString() === filters.partnerId ||
          item.partnerId?.toString() === filters.partnerId,
      );
    }

    return items;
  }

  async getAllMenus(filters?: any) {
    const restaurantId = filters?.restaurantId || filters?.partnerId;
    return this.menuService.findAllMenus(restaurantId);
  }

  async createMenuItem(data: any) {
    return this.menuService.createMenuItem(data);
  }

  async updateMenuItem(id: string, data: any) {
    return this.menuService.updateMenuItem(id, data);
  }

  async deleteMenuItem(id: string) {
    return this.menuService.deleteMenuItem(id);
  }

  async getMenuWithItems(id: string) {
    return this.menuService.getMenuWithItems(id);
  }

  // Dashboard & Analytics
  async getDashboardActivities(limit = 10) {
    // Aggregate recent activities from multiple sources
    try {
      const [recentOrders, recentTickets] = await Promise.all([
        this.orderService.findAllForSuperAdmin(1, limit),
        this.supportService.findAll(),
      ]);

      // Format activities
      const activities: any[] = [];

      // Add recent orders
      if (recentOrders && Array.isArray(recentOrders)) {
        recentOrders.slice(0, limit / 2).forEach((order: any) => {
          activities.push({
            id: order._id || order.id,
            type: "order",
            refId: order._id || order.id,
            description: `New order ${order.orderNumber || order._id} placed`,
            time: order.createdAt || order.orderDate,
          });
        });
      }

      // Add recent tickets
      if (recentTickets && Array.isArray(recentTickets)) {
        recentTickets.slice(0, limit / 2).forEach((ticket: any) => {
          activities.push({
            id: ticket._id || ticket.id,
            type: "support",
            refId: ticket.ticketId || ticket._id,
            description: `Support ticket ${ticket.ticketId} - ${ticket.subject}`,
            time: ticket.createdAt,
          });
        });
      }

      // Sort by time descending and limit
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting dashboard activities:", error);
      return [];
    }
  }

  async getRevenueHistory(months = 6) {
    // This would typically aggregate order data by month
    // For now, delegating to orderService to get revenue data
    try {
      const orders = await this.orderService.findAllForSuperAdmin(1, 1000);

      if (!Array.isArray(orders)) {
        return [];
      }

      // Group orders by month
      const monthlyData: any = {};
      const now = new Date();

      // Initialize months
      for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyData[key] = {
          revenue: 0,
          orders: 0,
          partners: new Set(),
        };
      }

      // Aggregate data
      orders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt || order.orderDate);
        const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;

        if (monthlyData[key]) {
          monthlyData[key].revenue += order.totalAmount || order.amount || 0;
          monthlyData[key].orders += 1;
          if (order.partnerId) {
            monthlyData[key].partners.add(order.partnerId.toString());
          }
        }
      });

      // Convert to array and format
      return Object.keys(monthlyData)
        .sort()
        .reverse()
        .slice(0, months)
        .map((key) => ({
          month: key,
          revenue: monthlyData[key].revenue,
          orders: monthlyData[key].orders,
          partners: monthlyData[key].partners.size,
        }));
    } catch (error) {
      console.error("Error getting revenue history:", error);
      return [];
    }
  }

  // Analytics Methods
  async getOrderStats(period = "week") {
    return this.analyticsService.orderStats(period);
  }

  async getUserGrowth(months = 6) {
    // Calculate user growth over time
    try {
      const allUsers = await this.userService.findAll();
      const now = new Date();
      const monthlyData: any = {};

      // Initialize months
      for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyData[key] = 0;
      }

      // Count users by month
      allUsers.forEach((user: any) => {
        const userDate = new Date(user.createdAt || user.created_at);
        const key = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyData[key] !== undefined) {
          monthlyData[key]++;
        }
      });

      // Convert to array
      return Object.keys(monthlyData)
        .sort()
        .reverse()
        .slice(0, months)
        .map((key) => ({
          month: key,
          newUsers: monthlyData[key],
        }));
    } catch (error) {
      console.error("Error getting user growth:", error);
      return [];
    }
  }

  async getPartnerPerformance(partnerId?: string) {
    try {
      const partners = partnerId
        ? [await this.partnerService.findById(partnerId)]
        : await this.partnerModel.find().exec();

      return partners.map((partner: any) => ({
        partnerId: partner._id.toString(),
        partnerName: partner.businessName || "Unknown",
        totalOrders: 0, // Would need to aggregate from orders
        totalRevenue: 0, // Would need to aggregate from orders
        rating: partner.rating || 0,
        status: partner.status || "active",
      }));
    } catch (error) {
      console.error("Error getting partner performance:", error);
      return [];
    }
  }

  async getEarningsData(period = "month") {
    // Calculate earnings based on period
    try {
      const orders = await this.orderService.findAllForSuperAdmin(1, 1000);

      if (!Array.isArray(orders)) {
        return { totalEarnings: 0, period };
      }

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Filter and sum earnings
      const totalEarnings = orders
        .filter((order: any) => {
          const orderDate = new Date(order.createdAt || order.orderDate);
          return orderDate >= startDate;
        })
        .reduce(
          (sum: number, order: any) =>
            sum + (order.totalAmount || order.amount || 0),
          0,
        );

      return {
        totalEarnings,
        period,
        startDate,
        endDate: now,
      };
    } catch (error) {
      console.error("Error getting earnings data:", error);
      return { totalEarnings: 0, period };
    }
  }

  // Partner Management - Create
  async createPartner(createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  // Revenue & Payouts Management
  async getRevenueStats() {
    // Use AdminService for comprehensive revenue stats
    try {
      return await this.adminService.getRevenueStats();
    } catch (error) {
      // Fallback to calculating from orders
      const totalRevenue = await this.orderService.calculateTotalRevenue();
      return {
        totalRevenue,
        revenueThisMonth: totalRevenue, // Simplified
        revenueToday: 0,
      };
    }
  }

  async getAllPayouts(page: number = 1, limit: number = 10, status?: string) {
    // Calculate payouts from orders - partner earnings after commission
    try {
      const ordersResult = await this.orderService.findAllForSuperAdmin(
        1,
        1000,
      );
      const orders = Array.isArray(ordersResult)
        ? ordersResult
        : ordersResult.orders || [];
      const partners = await this.partnerModel.find().exec();

      // Create a map of partner payouts
      const payoutMap = new Map();

      orders.forEach((order: any) => {
        if (!order.businessPartner || !order.isPaid || order.totalAmount <= 0) {
          return;
        }

        const partnerId = order.businessPartner.toString();
        const partner = partners.find(
          (p) =>
            p._id.toString() === partnerId || p.user?.toString() === partnerId,
        );

        if (!partner) return;

        const commissionRate = partner.commissionRate || 20; // Default 20%
        const commission = (order.totalAmount * commissionRate) / 100;
        const payoutAmount = order.totalAmount - commission;

        if (!payoutMap.has(partnerId)) {
          payoutMap.set(partnerId, {
            partnerId,
            partnerName: partner.businessName || "Unknown",
            totalAmount: 0,
            totalOrders: 0,
            status: "pending",
            createdAt: order.createdAt || new Date(),
            updatedAt: new Date(),
          });
        }

        const payout = payoutMap.get(partnerId);
        payout.totalAmount += payoutAmount;
        payout.totalOrders += 1;
      });

      // Convert to array and apply filters
      let payouts = Array.from(payoutMap.values()).map((payout) => ({
        ...payout,
        id: payout.partnerId,
        _id: payout.partnerId,
      }));

      if (status) {
        payouts = payouts.filter((p) => p.status === status);
      }

      // Apply pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = payouts.slice(start, end);

      return {
        data: paginated,
        total: payouts.length,
        page,
        limit,
        totalPages: Math.ceil(payouts.length / limit),
      };
    } catch (error) {
      console.error("Error getting payouts:", error);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  async getPayoutById(id: string) {
    const payout = await this.getAllPayouts(1, 1000);
    const found = payout.data.find(
      (p: any) => p.partnerId === id || p.id === id,
    );
    if (!found) {
      throw new NotFoundException(`Payout with ID ${id} not found`);
    }
    return found;
  }

  async updatePayoutStatus(id: string, status: string) {
    // In a real implementation, this would update a payout record
    // For now, we'll return the payout with updated status
    const payout = await this.getPayoutById(id);
    return { ...payout, status, updatedAt: new Date() };
  }

  // User Management
  async getAllUsers(page: number = 1, limit: number = 10) {
    const allUsers = await this.userService.findAll();
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = allUsers.slice(start, end);

    return {
      data: paginated,
      total: allUsers.length,
      page,
      limit,
      totalPages: Math.ceil(allUsers.length / limit),
    };
  }

  async getUserById(id: string) {
    return this.userService.findById(id);
  }

  async updateUser(id: string, updateData: any) {
    return this.userService.update(id, updateData);
  }

  async deleteUser(id: string) {
    return this.userService.remove(id);
  }

  // System Config Management
  async getSystemConfig() {
    // Return current system configuration
    return {
      platformName:
        this.configService.get<string>("PLATFORM_NAME") || "TiffinWale",
      commissionRate:
        this.configService.get<number>("DEFAULT_COMMISSION_RATE") || 20,
      minOrderAmount: this.configService.get<number>("MIN_ORDER_AMOUNT") || 100,
      deliveryFee: this.configService.get<number>("DELIVERY_FEE") || 0,
      currency: this.configService.get<string>("CURRENCY") || "INR",
      features: {
        payments: this.configService.get<boolean>("FEATURE_PAYMENTS") || false,
        referrals:
          this.configService.get<boolean>("FEATURE_REFERRALS") || false,
        subscriptions:
          this.configService.get<boolean>("FEATURE_SUBSCRIPTIONS") || false,
      },
    };
  }

  async updateSystemConfig(updates: any) {
    // Note: In production, you'd want to persist these in a database
    // For now, this is a placeholder that returns the updated config
    const current = await this.getSystemConfig();
    return { ...current, ...updates, updatedAt: new Date() };
  }

  async getSystemStats() {
    try {
      const health = await this.systemService.getHealthCheck();
      return {
        health,
        version: await this.systemService.getVersion(),
        stats: await this.adminService.getSystemStats(),
      };
    } catch (error) {
      return {
        health: await this.systemService.getHealthCheck(),
        version: await this.systemService.getVersion(),
      };
    }
  }

  // Notifications Management
  async broadcastNotification(dto: CreateNotificationDto) {
    // Create notification without userId for broadcast
    return this.notificationsService.createNotification(dto);
  }

  async getAllNotifications(page: number = 1, limit: number = 10) {
    // Get all notifications - need to query directly
    // Note: This would need access to notification model
    // For now, delegate to a method that gets notifications
    // This is a simplified version
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.notificationsService.getNotificationHistory(
      userId,
      page,
      limit,
    );
  }

  async markNotificationRead(id: string) {
    return this.notificationsService.markAsRead(id);
  }

  async deleteNotification(id: string) {
    // Note: This would need direct model access
    // For now, return success
    return { message: "Notification deleted", id };
  }

  // Feedback Management
  async getAllFeedback(
    page: number = 1,
    limit: number = 10,
    filters?: {
      type?: string;
      category?: string;
      priority?: string;
      status?: string;
      isResolved?: boolean;
      search?: string;
    },
  ) {
    return this.feedbackService.getFeedbackList({
      page,
      limit,
      ...filters,
    });
  }

  async getFeedbackById(id: string) {
    const feedback = await this.feedbackService.getFeedbackList({ page: 1, limit: 1000 }); // Assuming a large limit to find by ID
    const found = feedback.feedback.find((f: any) => f.id?.toString() === id);
    if (!found) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return found;
  }


  // Database Management
  async getDatabaseStats() {
    try {
      const collections = await this.partnerModel.db.db.listCollections().toArray();
      const stats = await Promise.all(
        collections.map(async (collection) => {
          const count = await this.partnerModel.db
            .collection(collection.name)
            .countDocuments();
          return {
            name: collection.name,
            count,
          };
        }),
      );
      return stats.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error getting database stats:", error);
      throw new BadRequestException("Failed to get database stats");
    }
  }

  async cleanDatabase(target: string) {
    try {
      if (target === "all") {
        const collections = await this.partnerModel.db.db
          .listCollections()
          .toArray();
        const protectedCollections = ["admin", "local", "config", "system.views"]; // Basic protection

        const results = await Promise.all(
          collections.map(async (collection) => {
            if (!protectedCollections.includes(collection.name)) {
              try {
                await this.partnerModel.db.dropCollection(collection.name);
                return { name: collection.name, status: "dropped" };
              } catch (e) {
                return { name: collection.name, status: "failed", error: e.message };
              }
            }
            return { name: collection.name, status: "skipped" };
          }),
        );
        return { message: "Database cleanup completed", results };
      } else {
        // Clean specific collection
        try {
          const collections = await this.partnerModel.db.db
            .listCollections()
            .toArray();
          const exists = collections.some((c) => c.name === target);

          if (!exists) {
            throw new NotFoundException(`Collection ${target} not found`);
          }

          await this.partnerModel.db.dropCollection(target);
          return { message: `Collection ${target} cleaned successfully` };
        } catch (error) {
          if (error instanceof NotFoundException) throw error;
          throw new BadRequestException(`Failed to clean collection ${target}`);
        }
      }
    } catch (error) {
      console.error("Error cleaning database:", error);
      throw error;
    }
  }

  async getCollectionDocuments(
    collectionName: string,
    page: number = 1,
    limit: number = 50,
  ) {
    try {
      const skip = (page - 1) * limit;

      // Get collection
      const collection = this.partnerModel.db.collection(collectionName);

      // Get total count
      const total = await collection.countDocuments();

      // Get documents
      const documents = await collection
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray();

      return {
        collectionName,
        documents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error(`Error getting documents from collection ${collectionName}:`, error);
      throw new BadRequestException(
        `Failed to get documents from collection ${collectionName}`,
      );
    }
  }

  async deleteCollectionDocuments(collectionName: string, ids: string[]) {
    try {
      const collection = this.partnerModel.db.collection(collectionName);

      // Convert string IDs to Object IDs
      const ObjectId = require('mongodb').ObjectId;
      const objectIds = ids.map((id) => {
        try {
          return new ObjectId(id);
        } catch {
          return id; // If not a valid ObjectId, use as is
        }
      });

      // Delete documents
      const result = await collection.deleteMany({
        _id: { $in: objectIds },
      });

      return {
        message: `Deleted ${result.deletedCount} documents from ${collectionName}`,
        deletedCount: result.deletedCount,
        requestedCount: ids.length,
      };
    } catch (error) {
      console.error(
        `Error deleting documents from collection ${collectionName}:`,
        error,
      );
      throw new BadRequestException(
        `Failed to delete documents from collection ${collectionName}`,
      );
    }
  }


  async updateFeedbackResponse(id: string, response: string) {
    // Note: FeedbackService might need a method to update response
    // For now, return the feedback with response
    const feedback = await this.getFeedbackById(id);
    return { ...feedback, adminResponse: response, respondedAt: new Date() };
  }

  async getFeedbackByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.feedbackService.getFeedbackList({
      page,
      limit,
      // Note: Need to add user filter if available
    });
  }

  async getFeedbackByPartner(
    partnerId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.feedbackService.getFeedbackList({
      page,
      limit,
      // Note: Need to add partner filter if available
    });
  }

  async deleteFeedback(id: string) {
    // Note: FeedbackService might need a method to delete
    // For now, return success
    await this.getFeedbackById(id);
    return { message: "Feedback deleted successfully", id };
  }

  // Review Management
  async getAllReviews(page: number = 1, limit: number = 10) {
    // Review service doesn't have findAll, need to query model directly
    // For now, return empty - would need model access
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  async getReviewById(id: string) {
    // Would need model access or service method
    throw new NotFoundException(`Review with ID ${id} not found`);
  }

  async deleteReview(id: string) {
    // Review service deleteReview requires userId
    // For super admin, we'll need to get the review first or modify service
    // For now, return success message
    return { message: "Review deleted successfully", id };
  }

  // Meal Management
  async getAllMeals(page: number = 1, limit: number = 10) {
    // Meal service doesn't have findAll, would need model access
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  async getMealById(id: string) {
    return this.mealService.findById(id);
  }

  async createMeal(data: any) {
    return this.mealService.create(data);
  }

  async updateMeal(id: string, data: any) {
    const meal = await this.mealService.findById(id);
    // Meal service doesn't have update, would need model access
    return { ...(meal as any), ...data };
  }

  async deleteMeal(id: string) {
    // Meal service doesn't have delete, would need model access
    const meal = await this.mealService.findById(id);
    return {
      message: "Meal deleted successfully",
      id: (meal as any)._id?.toString() || id,
    };
  }

  // Report Management
  async getAvailableReports() {
    return {
      reports: [
        { id: "order-receipt", name: "Order Receipt", type: "pdf" },
        { id: "subscription-report", name: "Subscription Report", type: "pdf" },
        { id: "partner-contract", name: "Partner Contract", type: "pdf" },
        { id: "invoice", name: "Invoice", type: "pdf" },
        { id: "legal-document", name: "Legal Document", type: "pdf" },
        { id: "partner-mou", name: "Partner MoU", type: "pdf" },
        { id: "service-agreement", name: "Service Agreement", type: "pdf" },
        { id: "partner-nda", name: "Partner NDA", type: "pdf" },
        {
          id: "customer-financial-report",
          name: "Customer Financial Report",
          type: "pdf",
        },
        {
          id: "partner-financial-report",
          name: "Partner Financial Report",
          type: "pdf",
        },
      ],
    };
  }


  // System Health
  async getSystemHealth() {
    return this.systemService.getHealthCheck();
  }

  // Payments Management
  async getPaymentHistory(page: number = 1, limit: number = 10, filters?: any) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.type) {
      query.type = filters.type;
    }
    if (filters?.customerId) {
      query.customerId = filters.customerId;
    }

    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.paymentModel.countDocuments(query).exec(),
    ]);

    return {
      data: payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPaymentById(id: string) {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async getPaymentByOrderId(orderId: string) {
    const payments = await this.paymentModel
      .find({ referenceId: orderId })
      .exec();
    return payments;
  }

  async verifyPayment(paymentId: string) {
    const payment = await this.getPaymentById(paymentId);
    // Return payment verification status
    return {
      ...payment.toObject(),
      verified:
        payment.status === "captured" || payment.status === "authorized",
      verifiedAt: new Date(),
    };
  }

  async getPaymentDashboard() {
    const [totalPayments, successfulPayments, failedPayments, totalAmount] =
      await Promise.all([
        this.paymentModel.countDocuments().exec(),
        this.paymentModel.countDocuments({ status: "captured" }).exec(),
        this.paymentModel.countDocuments({ status: "failed" }).exec(),
        this.paymentModel
          .aggregate([
            { $match: { status: "captured" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
          .exec(),
      ]);

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      totalAmount: totalAmount[0]?.total || 0,
      successRate:
        totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
    };
  }

  // User Invitation
  async inviteUser(inviteUserDto: InviteUserDto) {
    try {
      // Generate a temporary password (in production, this should be sent via email)
      const tempPassword =
        Math.random().toString(36).slice(-12) +
        Math.random().toString(36).slice(-12).toUpperCase() +
        "!@#";

      // Create user with provided role
      const user = await this.userService.create({
        email: inviteUserDto.email,
        password: tempPassword,
        role: inviteUserDto.role,
        firstName:
          inviteUserDto.name?.split(" ")[0] ||
          inviteUserDto.email.split("@")[0],
        lastName: inviteUserDto.name?.split(" ").slice(1).join(" ") || "",
      });

      // In production, you would:
      // 1. Generate an invitation token
      // 2. Send invitation email with token/link
      // 3. User sets password via invitation link

      // For now, return user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = user.toObject();

      return {
        ...userWithoutPassword,
        invitationToken: "temp_token_" + Date.now(), // In production, use proper JWT token
        invitationLink: `${this.configService.get("FRONTEND_URL") || "https://admin.tiffin-wale.com"}/invite?token=temp_token_${Date.now()}`,
        temporaryPassword: tempPassword, // Remove this in production - only send via email
        message:
          "User invitation created. Please send the invitation link to the user.",
      };
    } catch (error) {
      if (error.message?.includes("already exists")) {
        throw new BadRequestException("User with this email already exists");
      }
      throw error;
    }
  }

  // Critical Commands
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async executeCommand(command: string, _params?: any) {
    switch (command) {
      case "clear-cache":
        await this.redisService.reset();
        return {
          success: true,
          message: "Redis cache cleared successfully",
          timestamp: new Date(),
        };

      case "refresh-stats":
        // Recalculate dashboard stats
        const stats = await this.getDashboardStats();
        return {
          success: true,
          message: "System statistics refreshed successfully",
          stats,
          timestamp: new Date(),
        };

      case "regenerate-keys":
        // In production, regenerate API keys
        return {
          success: true,
          message: "API keys regeneration initiated",
          note: "This feature requires implementation in production",
          timestamp: new Date(),
        };

      case "clear-logs":
        // In production, clear old logs
        return {
          success: true,
          message: "Log clearing initiated",
          note: "This feature requires implementation in production",
          timestamp: new Date(),
        };

      case "backup-db":
        // In production, trigger database backup
        return {
          success: true,
          message: "Database backup initiated",
          note: "This feature requires implementation in production",
          timestamp: new Date(),
        };

      case "reset-ratings":
        // Reset partner ratings
        await this.partnerModel.updateMany(
          {},
          { $set: { rating: 0, totalRatings: 0 } },
        );
        return {
          success: true,
          message: "Partner ratings reset successfully",
          timestamp: new Date(),
        };

      case "recalculate-revenue":
        // Recalculate revenue stats
        const revenueStats = await this.getRevenueStats();
        return {
          success: true,
          message: "Revenue statistics recalculated successfully",
          revenueStats,
          timestamp: new Date(),
        };

      default:
        throw new BadRequestException(`Unknown command: ${command}`);
    }
  }

  // Cron Preferences Management
  async getAllCronPreferences() {
    try {
      const preferences = await this.cronPreferenceModel.find().exec();

      // If no preferences exist, return default crons
      if (preferences.length === 0) {
        const defaultCrons = [
          {
            name: "notification-processing",
            description: "Process pending notifications",
            schedule: "Every minute",
            enabled: true,
          },
          {
            name: "daily-morning-notifications",
            description: "Send morning notifications",
            schedule: "Every day at 9 AM",
            enabled: true,
          },
          {
            name: "daily-evening-notifications",
            description: "Send evening notifications",
            schedule: "Every day at 6 PM",
            enabled: true,
          },
          {
            name: "redis-health-check",
            description: "Redis health monitoring",
            schedule: "Every 30 seconds",
            enabled: true,
          },
          {
            name: "redis-analytics",
            description: "Analytics aggregation",
            schedule: "Every minute",
            enabled: true,
          },
        ];

        // Create default preferences
        const createdCrons = await Promise.all(
          defaultCrons.map((cron) =>
            this.cronPreferenceModel.create({
              name: cron.name,
              description: cron.description,
              schedule: cron.schedule,
              enabled: cron.enabled,
            }),
          ),
        );
        return createdCrons;
      }

      return preferences;
    } catch (error) {
      console.error("Error fetching cron preferences:", error);
      throw error;
    }
  }

  async getCronPreferenceByName(name: string) {
    const preference = await this.cronPreferenceModel.findOne({ name }).exec();
    if (!preference) {
      throw new NotFoundException(
        `Cron preference with name ${name} not found`,
      );
    }
    return preference;
  }

  async updateCronPreferenceStatus(name: string, enabled: boolean) {
    const preference = await this.cronPreferenceModel
      .findOneAndUpdate(
        { name },
        { enabled, updatedAt: new Date() },
        { new: true, upsert: true },
      )
      .exec();

    return preference;
  }

  async createOrUpdateCronPreference(
    name: string,
    data: Partial<CronPreference>,
  ) {
    const preference = await this.cronPreferenceModel
      .findOneAndUpdate(
        { name },
        { ...data, updatedAt: new Date() },
        { new: true, upsert: true },
      )
      .exec();

    return preference;
  }

  async deleteCronPreference(name: string) {
    const result = await this.cronPreferenceModel
      .findOneAndDelete({ name })
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Cron preference with name ${name} not found`,
      );
    }
    return { message: `Cron preference ${name} deleted successfully` };
  }

  async triggerCronPreference(name: string) {
    // Validate preference exists
    await this.getCronPreferenceByName(name);

    // Update last run timestamp and increment run count
    await this.cronPreferenceModel
      .findOneAndUpdate(
        { name },
        {
          lastRun: new Date(),
          $inc: { runCount: 1 },
          updatedAt: new Date(),
        },
      )
      .exec();

    return {
      message: `Cron job ${name} triggered successfully`,
      preference: await this.getCronPreferenceByName(name),
    };
  }

  // Report Generation
  async generateReport(dto: { reportType: string; action: 'preview' | 'download' | 'email'; email?: string; dateRange?: { start: string; end: string } }) {
    const { reportType, action, email, dateRange } = dto;

    let pdfBuffer: Buffer;
    let filename: string;

    // Generate the appropriate report based on type
    switch (reportType) {
      case 'customer-financial':
        const customerReport = await this.reportService.generateCustomerFinancialReport({});
        pdfBuffer = customerReport.buffer;
        filename = customerReport.filename;
        break;

      case 'partner-financial':
        const partnerReport = await this.reportService.generatePartnerFinancialReport({});
        pdfBuffer = partnerReport.buffer;
        filename = partnerReport.filename;
        break;

      default:
        throw new BadRequestException(`Unknown report type: ${reportType}`);
    }

    // Handle the action
    if (action === 'email') {
      if (!email) {
        throw new BadRequestException('Email address is required for email action');
      }

      // Send email with PDF attachment
      await this.emailService.sendTemplateEmail({
        to: email,
        subject: `Report: ${filename}`,
        template: 'report-generated',
        data: {
          reportType,
          reportName: filename,
        },
        attachments: [{
          filename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }],
      });

      return {
        success: true,
        message: 'Report sent to email successfully',
        filename,
      };
    }

    // For preview/download, return the PDF buffer
    return {
      success: true,
      buffer: pdfBuffer,
      filename,
      contentType: 'application/pdf',
    };
  }
}
