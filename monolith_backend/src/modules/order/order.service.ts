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
import { EmailService } from "../email/email.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly emailService: EmailService,
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
      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
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
}
