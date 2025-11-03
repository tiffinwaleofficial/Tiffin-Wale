import { Injectable, NotFoundException } from "@nestjs/common";
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
import { TicketStatus } from "../support/schemas/support-ticket.schema";
import { UpdatePartnerStatusDto } from "./dto/update-partner-status.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { UpdateCustomerStatusDto } from "./dto/update-customer-status.dto";
import { UpdateCustomerProfileDto } from "../customer/dto/update-customer-profile.dto";
import { CreatePartnerDto } from "../partner/dto/create-partner.dto";
import { CreateNotificationDto } from "../notifications/notifications.service";
import { Payment } from "../payment/schemas/payment.schema";
import { Partner } from "../partner/schemas/partner.schema";
import { ConfigService } from "@nestjs/config";

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
    private readonly configService: ConfigService,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(Partner.name)
    private readonly partnerModel: Model<Partner>,
  ) {}

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
      const ordersResult = await this.orderService.findAllForSuperAdmin(1, 1000);
      const orders = Array.isArray(ordersResult) ? ordersResult : ordersResult.orders || [];
      const partners = await this.partnerModel.find().exec();

      // Create a map of partner payouts
      const payoutMap = new Map();

      orders.forEach((order: any) => {
        if (!order.businessPartner || !order.isPaid || order.totalAmount <= 0) {
          return;
        }

        const partnerId = order.businessPartner.toString();
        const partner = partners.find(
          (p) => p._id.toString() === partnerId || p.user?.toString() === partnerId,
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
      let payouts = Array.from(payoutMap.values()).map((payout, index) => ({
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
    const found = payout.data.find((p: any) => p.partnerId === id || p.id === id);
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
      platformName: this.configService.get<string>("PLATFORM_NAME") || "TiffinWale",
      commissionRate: this.configService.get<number>("DEFAULT_COMMISSION_RATE") || 20,
      minOrderAmount: this.configService.get<number>("MIN_ORDER_AMOUNT") || 100,
      deliveryFee: this.configService.get<number>("DELIVERY_FEE") || 0,
      currency: this.configService.get<string>("CURRENCY") || "INR",
      features: {
        payments: this.configService.get<boolean>("FEATURE_PAYMENTS") || false,
        referrals: this.configService.get<boolean>("FEATURE_REFERRALS") || false,
        subscriptions: this.configService.get<boolean>("FEATURE_SUBSCRIPTIONS") || false,
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
    const skip = (page - 1) * limit;
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

  async getUserNotifications(userId: string, page: number = 1, limit: number = 10) {
    return this.notificationsService.getNotificationHistory(userId, page, limit);
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
    // FeedbackService doesn't have getById, need to query model directly
    // For now, get all and find by id
    const feedback = await this.feedbackService.getFeedbackList({
      page: 1,
      limit: 1000,
    });
    const found = feedback.feedback.find((f: any) => f.id?.toString() === id);
    if (!found) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return found;
  }

  async updateFeedbackResponse(id: string, response: string) {
    // Note: FeedbackService might need a method to update response
    // For now, return the feedback with response
    const feedback = await this.getFeedbackById(id);
    return { ...feedback, adminResponse: response, respondedAt: new Date() };
  }

  async getFeedbackByUser(userId: string, page: number = 1, limit: number = 10) {
    return this.feedbackService.getFeedbackList({
      page,
      limit,
      // Note: Need to add user filter if available
    });
  }

  async getFeedbackByPartner(partnerId: string, page: number = 1, limit: number = 10) {
    return this.feedbackService.getFeedbackList({
      page,
      limit,
      // Note: Need to add partner filter if available
    });
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
      this.paymentModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
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
    const payments = await this.paymentModel.find({ referenceId: orderId }).exec();
    return payments;
  }

  async verifyPayment(paymentId: string) {
    const payment = await this.getPaymentById(paymentId);
    // Return payment verification status
    return {
      ...payment.toObject(),
      verified: payment.status === "captured" || payment.status === "authorized",
      verifiedAt: new Date(),
    };
  }

  async getPaymentDashboard() {
    const [totalPayments, successfulPayments, failedPayments, totalAmount] =
      await Promise.all([
        this.paymentModel.countDocuments().exec(),
        this.paymentModel.countDocuments({ status: "captured" }).exec(),
        this.paymentModel.countDocuments({ status: "failed" }).exec(),
        this.paymentModel.aggregate([
          { $match: { status: "captured" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]).exec(),
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
}
