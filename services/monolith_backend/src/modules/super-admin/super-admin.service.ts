import { Injectable } from "@nestjs/common";
import { CustomerService } from "../customer/customer.service";
import { OrderService } from "../order/order.service";
import { PartnerService } from "../partner/partner.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { SupportService } from "../support/support.service";
import { MenuService } from "../menu/menu.service";
import { TicketStatus } from "../support/schemas/support-ticket.schema";
import { UpdatePartnerStatusDto } from "./dto/update-partner-status.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { UpdateCustomerStatusDto } from "./dto/update-customer-status.dto";
import { UpdateCustomerProfileDto } from "../customer/dto/update-customer-profile.dto";

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly subscriptionService: SubscriptionService,
    private readonly supportService: SupportService,
    private readonly menuService: MenuService,
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
}
