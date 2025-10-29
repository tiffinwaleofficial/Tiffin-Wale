import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./schemas/order.schema";
import { OrderStatus } from "../../common/interfaces/order.interface";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { MarkOrderPaidDto } from "./dto/mark-order-paid.dto";
import { AddOrderReviewDto } from "./dto/add-order-review.dto";
import { AcceptOrderDto } from "./dto/accept-order.dto";
import { RejectOrderDto } from "./dto/reject-order.dto";
import { ReadyOrderDto } from "./dto/ready-order.dto";
import { EmailService } from "../email/email.service";
import { RedisService } from "../redis/redis.service";
import { NotificationsGateway } from "../notifications/notifications.gateway";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Validate that total amount matches sum of items
      const calculatedTotal = createOrderDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Allow a small difference (e.g., 0.01) due to potential floating-point issues
      if (Math.abs(calculatedTotal - createOrderDto.totalAmount) > 0.01) {
        throw new BadRequestException(
          `Total amount (${createOrderDto.totalAmount}) doesn't match the sum of item prices (${calculatedTotal})`,
        );
      }

      const newOrder = new this.orderModel(createOrderDto);
      const savedOrder = await newOrder.save();

      // Send order confirmation email (non-blocking)
      this.sendOrderConfirmationEmail(savedOrder).catch((error) => {
        console.error("Failed to send order confirmation email:", error);
      });

      return savedOrder;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findById(id: string): Promise<Order> {
    try {
      // Check Redis cache first
      const cachedOrder = await this.redisService.getOrder(id);
      if (cachedOrder) {
        return cachedOrder;
      }

      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // Cache the order in Redis
      await this.redisService.cacheOrder(id, order.toObject());

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Invalid order ID: ${id}`);
    }
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderModel.find({ status }).exec();
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.orderModel.find({ customer: customerId }).exec();
  }

  async findByPartner(partnerId: string): Promise<Order[]> {
    return this.orderModel.find({ businessPartner: partnerId }).exec();
  }

  async findAllForSuperAdmin(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    try {
      const query: any = {};

      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        this.orderModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("customer", "firstName lastName phoneNumber email")
          .populate("businessPartner", "businessName")
          .exec(),
        this.orderModel.countDocuments(query),
      ]);

      return {
        orders,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve orders: ${error.message}`,
      );
    }
  }

  async countAllOrders(): Promise<number> {
    return this.orderModel.countDocuments().exec();
  }

  async calculateTotalRevenue(): Promise<number> {
    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async findByPartnerId(
    partnerId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    try {
      const query: any = { businessPartner: partnerId };

      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        this.orderModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("customer", "firstName lastName phoneNumber email")
          .exec(),
        this.orderModel.countDocuments(query),
      ]);

      return {
        orders,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve partner orders: ${error.message}`,
      );
    }
  }

  async getTodayOrdersByPartnerId(partnerId: string): Promise<{
    orders: Order[];
    stats: {
      totalOrders: number;
      completedOrders: number;
      pendingOrders: number;
      totalRevenue: number;
    };
  }> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const query = {
        businessPartner: partnerId,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      };

      const orders = await this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .populate("customer", "firstName lastName phoneNumber email")
        .exec();

      const stats = {
        totalOrders: orders.length,
        completedOrders: orders.filter(
          (o) => o.status === OrderStatus.DELIVERED,
        ).length,
        pendingOrders: orders.filter((o) => o.status === OrderStatus.PENDING)
          .length,
        totalRevenue: orders
          .filter((o) => o.status === OrderStatus.DELIVERED)
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      };

      return { orders, stats };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve today's orders: ${error.message}`,
      );
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.findById(id);

      // If items are updated, validate the total amount
      if (updateOrderDto.items && updateOrderDto.totalAmount) {
        const calculatedTotal = updateOrderDto.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        // Allow a small difference (e.g., 0.01) due to potential floating-point issues
        if (Math.abs(calculatedTotal - updateOrderDto.totalAmount) > 0.01) {
          throw new BadRequestException(
            `Total amount (${updateOrderDto.totalAmount}) doesn't match the sum of item prices (${calculatedTotal})`,
          );
        }
      }

      // Don't allow changing status through general update
      if (updateOrderDto.status) {
        if (
          order.status === OrderStatus.DELIVERED ||
          order.status === OrderStatus.CANCELLED
        ) {
          throw new BadRequestException(
            `Cannot update an order that is already ${order.status}`,
          );
        }
      }

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(id, updateOrderDto, { new: true })
        .exec();

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to update order: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Order> {
    try {
      const order = await this.findById(id);

      // Only allow deletion of orders that are pending or cancelled
      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `Cannot delete an order that is already ${order.status}`,
        );
      }

      return this.orderModel.findByIdAndDelete(id).exec();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete order: ${error.message}`);
    }
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    try {
      const order = await this.findById(id);
      const { status } = updateStatusDto;

      // Status transition validation
      const isValidTransition = this.isValidStatusTransition(
        order.status,
        status,
      );
      if (!isValidTransition) {
        throw new BadRequestException(
          `Invalid status transition from ${order.status} to ${status}`,
        );
      }

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(id, { status }, { new: true })
        .exec();

      // Update order status via Motia stream and WebSocket
      await this.notificationsGateway.updateOrderStatusViaMotia({
        orderId: id,
        status: status as any,
        userId: updatedOrder.customer.toString(),
        partnerId: updatedOrder.businessPartner.toString(),
        message: `Order status updated to ${status}`,
      });

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update order status: ${error.message}`,
      );
    }
  }

  async markAsPaid(id: string, paymentDto: MarkOrderPaidDto): Promise<Order> {
    try {
      const order = await this.findById(id);

      // Prevent double payment
      if (order.isPaid) {
        throw new ConflictException("Order is already paid");
      }

      // Validate payment amount
      if (Math.abs(paymentDto.amount - order.totalAmount) > 0.01) {
        throw new BadRequestException(
          `Payment amount (${paymentDto.amount}) doesn't match order total (${order.totalAmount})`,
        );
      }

      const paidAt = paymentDto.paidAt
        ? new Date(paymentDto.paidAt)
        : new Date();

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          id,
          {
            isPaid: true,
            paymentDetails: {
              transactionId: paymentDto.transactionId,
              paymentMethod: paymentDto.paymentMethod,
              amount: paymentDto.amount,
              paidAt,
            },
          },
          { new: true },
        )
        .exec();

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to mark order as paid: ${error.message}`,
      );
    }
  }

  async addReview(id: string, reviewDto: AddOrderReviewDto): Promise<Order> {
    try {
      const order = await this.findById(id);

      // Can only review delivered orders
      if (order.status !== OrderStatus.DELIVERED) {
        throw new BadRequestException("Can only review delivered orders");
      }

      // Prevent duplicate reviews
      if (order.review) {
        throw new ConflictException("Order already has a review");
      }

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          id,
          {
            rating: reviewDto.rating,
            review: reviewDto.review,
          },
          { new: true },
        )
        .exec();

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to add order review: ${error.message}`,
      );
    }
  }

  // Helper method to validate status transitions
  private isValidStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): boolean {
    // Define valid transitions
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [], // Terminal state
      [OrderStatus.CANCELLED]: [], // Terminal state
    };

    return validTransitions[currentStatus].includes(newStatus);
  }

  // Email helper methods
  private async sendOrderConfirmationEmail(order: any): Promise<void> {
    try {
      await this.emailService.sendOrderConfirmation({
        orderNumber: order.orderNumber || order._id.toString(),
        customerEmail: order.customerEmail || "customer@example.com",
        customerName: order.customerName || "Customer",
        items: order.items || [],
        totalAmount: order.totalAmount || 0,
        deliveryAddress: order.deliveryAddress || "Address not provided",
        estimatedDeliveryTime: order.estimatedDeliveryTime || "30-45 minutes",
        partnerName: order.partnerName || "Restaurant Partner",
      });
    } catch (error) {
      console.error("Email service error:", error);
    }
  }

  private async sendOrderStatusUpdateEmail(
    order: any,
    status: "preparing" | "ready" | "delivered",
  ): Promise<void> {
    try {
      await this.emailService.sendOrderStatusUpdate({
        orderNumber: order.orderNumber || order._id.toString(),
        customerEmail: order.customerEmail || "customer@example.com",
        customerName: order.customerName || "Customer",
        status,
        estimatedTime: order.estimatedDeliveryTime,
        partnerName: order.partnerName || "Restaurant Partner",
      });
    } catch (error) {
      console.error("Email service error:", error);
    }
  }

  // Partner-specific order action methods
  async acceptOrder(
    orderId: string,
    acceptOrderDto: AcceptOrderDto,
    partnerId: string,
  ): Promise<Order> {
    try {
      const order = await this.findById(orderId);

      // Validate that the order belongs to this partner
      if (order.businessPartner.toString() !== partnerId) {
        throw new BadRequestException(
          "You can only accept orders assigned to your restaurant",
        );
      }

      // Validate status transition (can only accept pending orders)
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException(
          `Cannot accept order with status: ${order.status}. Only pending orders can be accepted.`,
        );
      }

      // Update order status to confirmed
      const updateData: any = {
        status: OrderStatus.CONFIRMED,
        acceptedAt: new Date(),
      };

      if (acceptOrderDto.estimatedTime) {
        updateData.estimatedDeliveryTime = new Date(
          Date.now() + acceptOrderDto.estimatedTime * 60 * 1000,
        );
      }

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(orderId, updateData, { new: true })
        .exec();

      // Send real-time notification via WebSocket
      await this.notificationsGateway.updateOrderStatusViaMotia({
        orderId,
        status: "confirmed",
        userId: updatedOrder.customer.toString(),
        partnerId,
        message:
          acceptOrderDto.message ||
          `Your order has been accepted${
            acceptOrderDto.estimatedTime
              ? ` and will be ready in ${acceptOrderDto.estimatedTime} minutes`
              : ""
          }`,
        estimatedTime: acceptOrderDto.estimatedTime,
      });

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to accept order: ${error.message}`);
    }
  }

  async rejectOrder(
    orderId: string,
    rejectOrderDto: RejectOrderDto,
    partnerId: string,
  ): Promise<Order> {
    try {
      const order = await this.findById(orderId);

      // Validate that the order belongs to this partner
      if (order.businessPartner.toString() !== partnerId) {
        throw new BadRequestException(
          "You can only reject orders assigned to your restaurant",
        );
      }

      // Validate status transition (can only reject pending or confirmed orders)
      if (
        ![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)
      ) {
        throw new BadRequestException(
          `Cannot reject order with status: ${order.status}. Only pending or confirmed orders can be rejected.`,
        );
      }

      // Update order status to cancelled
      const updateData = {
        status: OrderStatus.CANCELLED,
        rejectedAt: new Date(),
        rejectionReason: rejectOrderDto.reason,
        rejectionMessage: rejectOrderDto.message,
      };

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(orderId, updateData, { new: true })
        .exec();

      // Send real-time notification via WebSocket
      await this.notificationsGateway.updateOrderStatusViaMotia({
        orderId,
        status: "cancelled",
        userId: updatedOrder.customer.toString(),
        partnerId,
        message:
          rejectOrderDto.message ||
          `Your order has been rejected. Reason: ${rejectOrderDto.reason}`,
      });

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to reject order: ${error.message}`);
    }
  }

  async markOrderReady(
    orderId: string,
    readyOrderDto: ReadyOrderDto,
    partnerId: string,
  ): Promise<Order> {
    try {
      const order = await this.findById(orderId);

      // Validate that the order belongs to this partner
      if (order.businessPartner.toString() !== partnerId) {
        throw new BadRequestException(
          "You can only mark orders ready for your restaurant",
        );
      }

      // Validate status transition (can only mark ready from preparing status)
      if (order.status !== OrderStatus.PREPARING) {
        throw new BadRequestException(
          `Cannot mark order ready with status: ${order.status}. Only preparing orders can be marked as ready.`,
        );
      }

      // Update order status to ready
      const updateData: any = {
        status: OrderStatus.READY,
        readyAt: new Date(),
      };

      if (readyOrderDto.estimatedPickupTime) {
        updateData.estimatedPickupTime = new Date(
          Date.now() + readyOrderDto.estimatedPickupTime * 60 * 1000,
        );
      }

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(orderId, updateData, { new: true })
        .exec();

      // Send real-time notification via WebSocket
      await this.notificationsGateway.updateOrderStatusViaMotia({
        orderId,
        status: "ready",
        userId: updatedOrder.customer.toString(),
        partnerId,
        message:
          readyOrderDto.message ||
          `Your order is ready for pickup${
            readyOrderDto.estimatedPickupTime
              ? ` in ${readyOrderDto.estimatedPickupTime} minutes`
              : ""
          }`,
        estimatedTime: readyOrderDto.estimatedPickupTime,
      });

      // Send email notification
      this.sendOrderStatusUpdateEmail(updatedOrder, "ready").catch((error) => {
        console.error("Failed to send ready notification email:", error);
      });

      return updatedOrder;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to mark order ready: ${error.message}`,
      );
    }
  }

  /**
   * Find orders by customer and partner
   */
  async findByCustomerAndPartner(
    customerId: string,
    partnerId: string,
    options?: { page?: number; limit?: number },
  ): Promise<Order[]> {
    const query = this.orderModel.find({
      customer: customerId,
      businessPartner: partnerId,
    });

    // Apply pagination if provided
    if (options?.page && options?.limit) {
      const skip = (options.page - 1) * options.limit;
      query.skip(skip).limit(options.limit);
    }

    return query.sort({ createdAt: -1 }).exec();
  }
}
