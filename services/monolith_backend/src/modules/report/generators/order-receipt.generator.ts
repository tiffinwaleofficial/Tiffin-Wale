import { Injectable } from "@nestjs/common";
import { OrderReceiptData } from "../interfaces/report-data.interface";
import { Order } from "../../order/schemas/order.schema";
import { User } from "../../user/schemas/user.schema";
import { Partner } from "../../partner/schemas/partner.schema";

/**
 * Format-agnostic Order Receipt Data Generator
 * Prepares order receipt data that can be used by any format (PDF, Excel, CSV, etc.)
 */
@Injectable()
export class OrderReceiptDataGenerator {
  /**
   * Transform Order document to OrderReceiptData interface
   */
  async prepareOrderReceiptData(
    order: Order,
    customer: User,
    partner: Partner,
  ): Promise<OrderReceiptData> {
    // Extract order items
    const items = order.items.map((item) => ({
      name: item.mealId || "Meal Item", // You'll need to fetch actual meal name
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      specialInstructions: item.specialInstructions,
    }));

    // Calculate totals
    const subtotal = order.totalAmount;
    const deliveryFee = 0; // Add if available in order schema
    const tax = 0; // Add if available in order schema
    const discount = 0; // Add if available in order schema
    const total = order.totalAmount;

    return {
      orderId: order._id.toString(),
      orderNumber: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      customer: {
        id: customer._id.toString(),
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phoneNumber,
        address: order.deliveryAddress,
      },
      partner: {
        id: partner._id.toString(),
        businessName: partner.businessName,
        address: this.formatAddress(partner.address),
      },
      items,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      paymentMethod: order.paymentDetails?.paymentMethod,
      paymentStatus: order.isPaid ? "Paid" : "Pending",
      orderDate: order.createdAt,
      deliveryDate: order.deliveryDate || order.scheduledDeliveryTime,
      deliveryAddress: order.deliveryAddress,
      deliveryInstructions: order.deliveryInstructions,
    };
  }

  /**
   * Format address object to string
   */
  private formatAddress(address: any): string {
    if (typeof address === "string") {
      return address;
    }
    if (address && typeof address === "object") {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.postalCode,
        address.country,
      ].filter(Boolean);
      return parts.join(", ");
    }
    return "";
  }
}
