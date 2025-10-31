import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Subscription,
  SubscriptionStatus,
} from "./schemas/subscription.schema";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { EmailService } from "../email/email.service";
import { OrderService } from "../order/order.service";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    private readonly emailService: EmailService,
    private readonly orderService: OrderService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    console.log("🔄 SubscriptionService: Creating subscription with data:", {
      customer: createSubscriptionDto.customer,
      plan: createSubscriptionDto.plan,
      startDate: createSubscriptionDto.startDate,
      endDate: createSubscriptionDto.endDate,
    });

    const newSubscription = new this.subscriptionModel(createSubscriptionDto);
    const savedSubscription = await newSubscription.save();

    console.log(
      "✅ SubscriptionService: Subscription saved with ID:",
      savedSubscription._id,
    );

    // Populate plan to get details
    await savedSubscription.populate("plan");
    console.log("✅ SubscriptionService: Plan populated:", {
      planId:
        typeof savedSubscription.plan === "object"
          ? savedSubscription.plan._id
          : savedSubscription.plan,
      planName:
        typeof savedSubscription.plan === "object"
          ? savedSubscription.plan.name
          : "N/A",
    });

    // Generate orders automatically (non-blocking but with logging)
    console.log(
      "🚀 SubscriptionService: Starting order generation for subscription:",
      savedSubscription._id,
    );
    this.generateSubscriptionOrders(savedSubscription)
      .then(() => {
        console.log(
          "✅ SubscriptionService: Order generation completed for subscription:",
          savedSubscription._id,
        );
      })
      .catch((error) => {
        console.error(
          "❌ SubscriptionService: Failed to generate subscription orders:",
          error,
        );
        console.error("❌ SubscriptionService: Error stack:", error.stack);
      });

    // Send subscription confirmation email (non-blocking)
    this.sendSubscriptionConfirmationEmail(savedSubscription).catch((error) => {
      console.error("Failed to send subscription confirmation email:", error);
    });

    return savedSubscription;
  }

  /**
   * Automatically generate orders for a subscription based on plan schedule
   */
  private async generateSubscriptionOrders(
    subscription: Subscription,
  ): Promise<void> {
    try {
      console.log(
        "📦 SubscriptionService: generateSubscriptionOrders called for subscription:",
        subscription._id,
      );

      // Ensure plan is populated
      if (!subscription.plan || typeof subscription.plan === "string") {
        console.log("📦 SubscriptionService: Populating plan...");
        await subscription.populate("plan");
      }

      const plan = subscription.plan as any;
      if (!plan) {
        console.error("❌ SubscriptionService: Plan is null or undefined");
        return;
      }

      console.log("📦 SubscriptionService: Plan details:", {
        planId: plan._id,
        planName: plan.name,
        partner: plan.partner,
        mealsPerDay: plan.mealsPerDay,
        operationalDays: plan.operationalDays,
        deliverySlots: plan.deliverySlots,
      });

      if (!plan.partner) {
        console.error(
          "❌ SubscriptionService: Subscription plan missing partner information",
        );
        return;
      }

      const partnerId =
        typeof plan.partner === "string" ? plan.partner : plan.partner._id;

      // Ensure customer is populated
      let customerId: string;
      if (typeof subscription.customer === "string") {
        customerId = subscription.customer;
        console.log(
          "📦 SubscriptionService: Customer is string ID:",
          customerId,
        );
      } else {
        customerId = subscription.customer._id;
        console.log(
          "📦 SubscriptionService: Customer is object with ID:",
          customerId,
        );
      }

      console.log("📦 SubscriptionService: Order generation params:", {
        partnerId,
        customerId,
        subscriptionId: subscription._id,
      });

      // Get operational days (default to all days if not specified)
      const operationalDays = plan.operationalDays || [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      console.log("📦 SubscriptionService: Operational days:", operationalDays);

      // Get delivery slots
      const deliverySlots = plan.deliverySlots || {};
      console.log(
        "📦 SubscriptionService: Delivery slots from plan:",
        JSON.stringify(deliverySlots, null, 2),
      );

      const enabledSlots = [];
      if (deliverySlots.morning?.enabled) {
        enabledSlots.push({
          type: "breakfast",
          slot: "morning",
          timeRange: deliverySlots.morning.timeRange,
        });
        console.log("✅ SubscriptionService: Morning slot enabled");
      }
      if (deliverySlots.afternoon?.enabled) {
        enabledSlots.push({
          type: "lunch",
          slot: "afternoon",
          timeRange: deliverySlots.afternoon.timeRange,
        });
        console.log("✅ SubscriptionService: Afternoon slot enabled");
      }
      if (deliverySlots.evening?.enabled) {
        enabledSlots.push({
          type: "dinner",
          slot: "evening",
          timeRange: deliverySlots.evening.timeRange,
        });
        console.log("✅ SubscriptionService: Evening slot enabled");
      }

      console.log("📦 SubscriptionService: Enabled slots:", enabledSlots);

      // Limit to mealsPerDay (e.g., 2 meals/day)
      const activeSlots = enabledSlots.slice(0, plan.mealsPerDay || 2);
      console.log(
        "📦 SubscriptionService: Active slots (limited to mealsPerDay):",
        activeSlots,
      );

      if (activeSlots.length === 0) {
        console.error(
          "❌ SubscriptionService: No delivery slots enabled for subscription plan",
        );
        return;
      }

      // Generate orders for each day in subscription period
      const startDate = new Date(subscription.startDate);
      const endDate = new Date(subscription.endDate);
      const currentDate = new Date(startDate);

      console.log("📦 SubscriptionService: Date range:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days: Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
      });

      // Get delivery address - try to populate customer if not already populated
      let deliveryAddressString = "Address to be updated";
      try {
        if (
          !subscription.customer ||
          typeof subscription.customer === "string"
        ) {
          await subscription.populate("customer");
        }
        const customer = subscription.customer as any;
        // Try to get address from customer object if it exists
        if (customer?.address) {
          const addr = customer.address;
          deliveryAddressString =
            typeof addr === "string"
              ? addr
              : `${addr.street || ""}, ${addr.city || ""}, ${addr.state || ""} ${addr.pincode || ""}`.trim();
        }
      } catch (error) {
        console.warn("Could not fetch customer address, using placeholder");
      }

      const ordersToCreate = [];

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();

        // Check if this day is operational
        if (!operationalDays.includes(dayOfWeek)) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        // Create orders for each active delivery slot
        for (const slot of activeSlots) {
          const orderDate = new Date(currentDate);

          // Set delivery time based on slot (simplified - would need actual time parsing)
          const scheduledTime = new Date(orderDate);
          if (slot.slot === "morning") {
            scheduledTime.setHours(9, 0, 0, 0); // 9 AM
          } else if (slot.slot === "afternoon") {
            scheduledTime.setHours(13, 0, 0, 0); // 1 PM
          } else if (slot.slot === "evening") {
            scheduledTime.setHours(19, 0, 0, 0); // 7 PM
          }

          // Create order items from meal specification
          const items = [];
          let totalAmount = 0;

          if (plan.mealSpecification) {
            const spec = plan.mealSpecification;

            // Add rotis
            if (spec.rotis) {
              items.push({
                mealId: "plan-rotis", // Placeholder - would need actual meal IDs
                quantity: spec.rotis,
                price: 0, // Included in plan
                specialInstructions: `Subscription meal - ${slot.type}`,
              });
            }

            // Add sabzis
            if (spec.sabzis && spec.sabzis.length > 0) {
              spec.sabzis.forEach((sabzi: any) => {
                items.push({
                  mealId: `plan-sabzi-${sabzi.name}`,
                  quantity: 1,
                  price: 0,
                  specialInstructions: `${sabzi.name} (${sabzi.quantity}) - ${slot.type}`,
                });
              });
            }

            // Add dal
            if (spec.dal) {
              items.push({
                mealId: "plan-dal",
                quantity: 1,
                price: 0,
                specialInstructions: `${spec.dal.type} - ${spec.dal.quantity} - ${slot.type}`,
              });
            }

            // Add rice
            if (spec.rice) {
              items.push({
                mealId: "plan-rice",
                quantity: 1,
                price: 0,
                specialInstructions: `${spec.rice.type || "Plain"} Rice - ${spec.rice.quantity} - ${slot.type}`,
              });
            }

            // Add salad
            if (spec.salad) {
              items.push({
                mealId: "plan-salad",
                quantity: 1,
                price: 0,
                specialInstructions: `Fresh Salad - ${slot.type}`,
              });
            }

            // Calculate total (delivery fee per meal)
            totalAmount = plan.deliveryFee || 0;
          }

          if (items.length === 0) {
            // Fallback: create a basic meal item
            items.push({
              mealId: "plan-meal",
              quantity: 1,
              price: 0,
              specialInstructions: `Subscription meal for ${slot.type}`,
            });
            totalAmount = plan.deliveryFee || 0;
          }

          // Extract date part for deliveryDate (used by frontend for filtering)
          const orderDeliveryDate = new Date(orderDate);
          orderDeliveryDate.setHours(0, 0, 0, 0);

          ordersToCreate.push({
            customer: customerId,
            businessPartner: partnerId,
            items: items,
            totalAmount: totalAmount,
            deliveryAddress: deliveryAddressString || "Address to be updated",
            deliveryInstructions: `Subscription order - ${plan.name}`,
            scheduledDeliveryTime: scheduledTime.toISOString(),
            deliveryDate: orderDeliveryDate.toISOString(), // Add deliveryDate for frontend filtering
            mealType: slot.type,
            deliverySlot: slot.slot,
            deliveryTimeRange: slot.timeRange,
            subscription: subscription._id.toString(),
            subscriptionPlan: plan._id.toString(),
            dayOfWeek: dayOfWeek,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Create orders in batches (to avoid overwhelming the system)
      console.log(
        `📦 SubscriptionService: Generating ${ordersToCreate.length} orders for subscription ${subscription._id}`,
      );

      if (ordersToCreate.length === 0) {
        console.warn(
          "⚠️ SubscriptionService: No orders to create! Check subscription dates and operational days.",
        );
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < ordersToCreate.length; i++) {
        const orderData = ordersToCreate[i];
        try {
          console.log(
            `📦 SubscriptionService: Creating order ${i + 1}/${ordersToCreate.length} for ${orderData.scheduledDeliveryTime}`,
          );
          const createdOrder = await this.orderService.create(orderData as any);
          console.log(
            `✅ SubscriptionService: Order created successfully:`,
            createdOrder._id,
          );
          successCount++;
        } catch (error: any) {
          console.error(
            `❌ SubscriptionService: Failed to create order for ${orderData.scheduledDeliveryTime}:`,
            error.message || error,
          );
          console.error(
            `❌ SubscriptionService: Order data that failed:`,
            JSON.stringify(orderData, null, 2),
          );
          failCount++;
          // Continue with other orders even if one fails
        }
      }

      console.log(
        `✅ SubscriptionService: Order generation complete for subscription ${subscription._id}. Success: ${successCount}, Failed: ${failCount}`,
      );
    } catch (error: any) {
      console.error(
        "❌ SubscriptionService: Error generating subscription orders:",
        error,
      );
      console.error("❌ SubscriptionService: Error message:", error.message);
      console.error("❌ SubscriptionService: Error stack:", error.stack);
      // Don't throw - subscription creation should still succeed even if order generation fails
      // Error is already logged above for debugging
    }
  }

  /**
   * Regenerate orders for an existing subscription (useful if orders weren't created initially)
   */
  async regenerateOrders(
    subscriptionId: string,
  ): Promise<{ success: boolean; ordersCreated: number; errors: number }> {
    try {
      const subscription = await this.subscriptionModel
        .findById(subscriptionId)
        .exec();
      if (!subscription) {
        throw new NotFoundException(
          `Subscription with ID ${subscriptionId} not found`,
        );
      }

      await subscription.populate("plan");
      await subscription.populate("customer");

      console.log(
        `🔄 SubscriptionService: Regenerating orders for subscription ${subscriptionId}`,
      );

      // Call the private method to generate orders
      await this.generateSubscriptionOrders(subscription);

      return { success: true, ordersCreated: 0, errors: 0 }; // Actual count would be tracked in generateSubscriptionOrders
    } catch (error: any) {
      console.error(
        `❌ SubscriptionService: Failed to regenerate orders:`,
        error,
      );
      throw error;
    }
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel
      .find()
      .populate("customer")
      .populate("plan")
      .exec();
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findById(id)
      .populate("customer")
      .populate("plan")
      .exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async findByCustomer(customerId: string): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({ customer: customerId })
      .populate("plan")
      .exec();
  }

  async getCurrentSubscription(
    customerId: string,
  ): Promise<Subscription | null> {
    const subscription = await this.subscriptionModel
      .findOne({
        customer: customerId,
        status: {
          $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING],
        },
        endDate: { $gt: new Date() },
      })
      .populate("plan")
      .sort({ createdAt: -1 })
      .exec();

    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    if (Object.keys(updateSubscriptionDto).length === 0) {
      throw new BadRequestException("Update data cannot be empty");
    }

    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(id, updateSubscriptionDto, { new: true })
      .populate("customer")
      .populate("plan")
      .exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.subscriptionModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return { deleted: true };
  }

  async cancelSubscription(id: string, reason: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException("Subscription is already cancelled");
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    subscription.autoRenew = false;

    return subscription.save();
  }

  async pauseSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status === SubscriptionStatus.PAUSED) {
      throw new BadRequestException("Subscription is already paused");
    }

    subscription.status = SubscriptionStatus.PAUSED;

    return subscription.save();
  }

  async resumeSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException("Only paused subscriptions can be resumed");
    }

    subscription.status = SubscriptionStatus.ACTIVE;

    return subscription.save();
  }

  // Email helper methods for subscription notifications
  private async sendSubscriptionConfirmationEmail(
    subscription: any,
  ): Promise<void> {
    try {
      await this.emailService.sendSubscriptionConfirmation({
        customerEmail: subscription.customerEmail || "customer@example.com",
        customerName: subscription.customerName || "Customer",
        planName:
          subscription.planName || subscription.plan || "Subscription Plan",
        startDate: subscription.startDate || subscription.createdAt,
        endDate: subscription.endDate || subscription.expiryDate,
        amount: subscription.amount || subscription.price || 0,
        billingCycle:
          subscription.billingCycle || subscription.frequency || "monthly",
      });
    } catch (error) {
      console.error("Subscription confirmation email service error:", error);
    }
  }

  async sendSubscriptionExpiryWarning(subscriptionData: {
    customerEmail: string;
    customerName: string;
    planName: string;
    expiryDate: string;
    daysLeft: number;
  }): Promise<void> {
    try {
      await this.emailService.sendSubscriptionExpiryWarning(subscriptionData);
    } catch (error) {
      console.error("Failed to send subscription expiry warning email:", error);
    }
  }

  async sendSubscriptionRenewalConfirmation(subscriptionData: {
    customerEmail: string;
    customerName: string;
    planName: string;
    renewalDate: string;
    amount: number;
  }): Promise<void> {
    try {
      // This would be implemented when you have subscription renewal logic
      console.log(
        "Subscription renewal email would be sent to:",
        subscriptionData.customerEmail,
      );
      // await this.emailService.sendSubscriptionRenewal(subscriptionData);
    } catch (error) {
      console.error("Failed to send subscription renewal email:", error);
    }
  }

  async sendSubscriptionCancellationConfirmation(subscriptionData: {
    customerEmail: string;
    customerName: string;
    planName: string;
    cancellationDate: string;
    refundAmount?: number;
  }): Promise<void> {
    try {
      // This would be implemented when you have subscription cancellation logic
      console.log(
        "Subscription cancellation email would be sent to:",
        subscriptionData.customerEmail,
      );
      // await this.emailService.sendSubscriptionCancellation(subscriptionData);
    } catch (error) {
      console.error("Failed to send subscription cancellation email:", error);
    }
  }

  /**
   * Find subscriptions by partner
   */
  async findByPartner(
    partnerId: string,
    status?: string,
  ): Promise<Subscription[]> {
    const query: any = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Get all subscription plans for this partner
    const subscriptions = await this.subscriptionModel
      .find(query)
      .populate({
        path: "plan",
        match: { partner: partnerId },
      })
      .populate("customer")
      .sort({ createdAt: -1 })
      .exec();

    // Filter out subscriptions where plan is null (not belonging to this partner)
    return subscriptions.filter((sub) => sub.plan !== null);
  }

  /**
   * Find subscription by customer and partner
   */
  async findByCustomerAndPartner(
    customerId: string,
    partnerId: string,
  ): Promise<Subscription | null> {
    const subscription = await this.subscriptionModel
      .findOne({ customer: customerId })
      .populate({
        path: "plan",
        match: { partner: partnerId },
      })
      .exec();

    // Return null if plan doesn't match (not this partner's plan)
    if (!subscription || !subscription.plan) {
      return null;
    }

    return subscription;
  }
}
