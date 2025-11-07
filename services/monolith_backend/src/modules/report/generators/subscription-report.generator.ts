import { Injectable } from "@nestjs/common";
import { SubscriptionReportData } from "../interfaces/report-data.interface";
import { Subscription } from "../../subscription/schemas/subscription.schema";
import { SubscriptionPlan } from "../../subscription/schemas/subscription-plan.schema";
import { User } from "../../user/schemas/user.schema";

/**
 * Format-agnostic Subscription Report Data Generator
 * Prepares subscription report data that can be used by any format (PDF, Excel, CSV, etc.)
 */
@Injectable()
export class SubscriptionReportDataGenerator {
  /**
   * Transform Subscription document to SubscriptionReportData interface
   */
  async prepareSubscriptionReportData(
    subscription: Subscription,
    plan: SubscriptionPlan,
    customer: User,
    meals?: any[],
    payments?: any[],
  ): Promise<SubscriptionReportData> {
    return {
      subscriptionId: subscription._id.toString(),
      customer: {
        id: customer._id.toString(),
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
      },
      plan: {
        id: plan._id.toString(),
        name: plan.name,
        description: plan.description || "",
        price: plan.price,
        duration: this.formatDuration(plan.durationValue, plan.durationType),
      },
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      paymentFrequency: subscription.paymentFrequency,
      totalAmount: subscription.totalAmount,
      discountAmount: subscription.discountAmount,
      meals:
        meals?.map((meal) => ({
          date: meal.deliveryDate || meal.createdAt,
          mealType: meal.mealType || "lunch",
          items: meal.items || [],
          status: meal.status || "delivered",
        })) || [],
      paymentHistory:
        payments?.map((payment) => ({
          date: payment.createdAt || payment.paidAt,
          amount: payment.amount,
          status: payment.status || "completed",
          paymentMethod: payment.paymentMethod || "unknown",
        })) || [],
    };
  }

  /**
   * Format duration string
   */
  private formatDuration(duration: number, unit: string): string {
    // Handle DurationType enum values
    const unitStr = unit.charAt(0).toUpperCase() + unit.slice(1);
    return `${duration} ${unitStr}${duration > 1 ? "s" : ""}`;
  }
}
