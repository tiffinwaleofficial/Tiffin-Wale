import { Injectable } from "@nestjs/common";
import { InvoiceData } from "../interfaces/report-data.interface";
import { Order } from "../../order/schemas/order.schema";
import { Subscription } from "../../subscription/schemas/subscription.schema";
import { User } from "../../user/schemas/user.schema";

/**
 * Format-agnostic Invoice Data Generator
 * Prepares invoice data that can be used by any format (PDF, Excel, CSV, etc.)
 */
@Injectable()
export class InvoiceDataGenerator {
  /**
   * Generate invoice data from order
   */
  async prepareInvoiceFromOrder(
    order: Order,
    customer: User,
  ): Promise<InvoiceData> {
    const items = order.items.map((item) => ({
      description: `Meal Item - ${item.mealId}`,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity,
    }));

    return {
      invoiceId: `INV-${order._id.toString()}`,
      invoiceNumber: `INV-${order._id.toString().slice(-8).toUpperCase()}`,
      type: "order",
      customer: {
        id: customer._id.toString(),
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        address: order.deliveryAddress,
      },
      items,
      subtotal: order.totalAmount,
      tax: 0, // Add if available
      discount: 0, // Add if available
      total: order.totalAmount,
      dueDate: new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from order date
      issueDate: order.createdAt,
      status: order.isPaid ? "Paid" : "Pending",
      paymentMethod: order.paymentDetails?.paymentMethod,
      referenceId: order._id.toString(),
    };
  }

  /**
   * Generate invoice data from subscription
   */
  async prepareInvoiceFromSubscription(
    subscription: Subscription,
    customer: User,
  ): Promise<InvoiceData> {
    return {
      invoiceId: `INV-SUB-${subscription._id.toString()}`,
      invoiceNumber: `INV-SUB-${subscription._id.toString().slice(-8).toUpperCase()}`,
      type: "subscription",
      customer: {
        id: customer._id.toString(),
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        address: "", // Add customer address if available
      },
      items: [
        {
          description: `Subscription Plan - ${subscription.paymentFrequency}`,
          quantity: 1,
          unitPrice: subscription.totalAmount,
          total: subscription.totalAmount,
        },
      ],
      subtotal: subscription.totalAmount,
      tax: 0,
      discount: subscription.discountAmount || 0,
      total: subscription.totalAmount - (subscription.discountAmount || 0),
      dueDate: subscription.nextRenewalDate || subscription.endDate,
      issueDate: subscription.startDate,
      status: subscription.isPaid ? "Paid" : "Pending",
      paymentMethod: subscription.paymentId ? "Online" : undefined,
      referenceId: subscription._id.toString(),
    };
  }
}
