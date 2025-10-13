import { Injectable, Logger } from "@nestjs/common";
import {
  Expo,
  ExpoPushMessage,
  ExpoPushTicket,
  ExpoPushReceiptId,
} from "expo-server-sdk";

export interface PushNotificationPayload {
  title: string;
  message: string;
  data?: Record<string, any>;
  sound?: "default" | null;
  badge?: number;
  priority?: "default" | "normal" | "high";
  ttl?: number;
  channelId?: string;
}

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private expo: Expo;

  constructor() {
    this.expo = new Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN,
      useFcmV1: true, // Use FCM v1 API
    });
  }

  /**
   * Send push notification to a single device
   */
  async sendToDevice(
    pushToken: string,
    payload: PushNotificationPayload,
  ): Promise<void> {
    try {
      if (!Expo.isExpoPushToken(pushToken)) {
        this.logger.error(`Invalid Expo push token: ${pushToken}`);
        return;
      }

      const message: ExpoPushMessage = {
        to: pushToken,
        title: payload.title,
        body: payload.message,
        data: payload.data || {},
        sound: payload.sound || "default",
        badge: payload.badge,
        priority: payload.priority || "high",
        ttl: payload.ttl || 3600, // 1 hour default
        channelId: payload.channelId || "default",
      };

      const tickets = await this.expo.sendPushNotificationsAsync([message]);
      await this.handlePushTickets(tickets, [pushToken]);

      this.logger.log(`Push notification sent to device: ${pushToken}`);
    } catch (error) {
      this.logger.error(
        `Error sending push notification to ${pushToken}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Send push notifications to multiple devices
   */
  async sendToMultipleDevices(
    pushTokens: string[],
    payload: PushNotificationPayload,
  ): Promise<void> {
    try {
      // Filter valid tokens
      const validTokens = pushTokens.filter((token) =>
        Expo.isExpoPushToken(token),
      );

      if (validTokens.length === 0) {
        this.logger.warn("No valid push tokens provided");
        return;
      }

      // Create messages
      const messages: ExpoPushMessage[] = validTokens.map((token) => ({
        to: token,
        title: payload.title,
        body: payload.message,
        data: payload.data || {},
        sound: payload.sound || "default",
        badge: payload.badge,
        priority: payload.priority || "high",
        ttl: payload.ttl || 3600,
        channelId: payload.channelId || "default",
      }));

      // Send in chunks (Expo recommends max 100 per chunk)
      const chunks = this.expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        const tickets = await this.expo.sendPushNotificationsAsync(chunk);
        await this.handlePushTickets(tickets, validTokens);
      }

      this.logger.log(
        `Push notifications sent to ${validTokens.length} devices`,
      );
    } catch (error) {
      this.logger.error(
        "Error sending push notifications to multiple devices:",
        error,
      );
      throw error;
    }
  }

  /**
   * Send order update notification
   */
  async sendOrderUpdate(
    pushTokens: string[],
    orderId: string,
    status: string,
    customerName?: string,
  ): Promise<void> {
    const statusMessages = {
      confirmed: "Your order has been confirmed! 🎉",
      preparing: "Your order is being prepared 👨‍🍳",
      ready: "Your order is ready for pickup! 📦",
      delivered: "Your order has been delivered! Enjoy! 🍽️",
      cancelled: "Your order has been cancelled 😔",
    };

    const payload: PushNotificationPayload = {
      title: "Order Update",
      message: statusMessages[status] || `Order status: ${status}`,
      data: {
        type: "order_update",
        orderId,
        status,
        timestamp: new Date().toISOString(),
      },
      channelId: "orders",
      priority: "high",
    };

    await this.sendToMultipleDevices(pushTokens, payload);
  }

  /**
   * Send new order notification to partner
   */
  async sendNewOrderNotification(
    pushTokens: string[],
    orderId: string,
    orderDetails: any,
  ): Promise<void> {
    const payload: PushNotificationPayload = {
      title: "New Order Received! 🔔",
      message: `Order #${orderDetails.orderNumber} - ₹${orderDetails.total}`,
      data: {
        type: "new_order",
        orderId,
        orderDetails,
        timestamp: new Date().toISOString(),
      },
      channelId: "orders",
      priority: "high",
      sound: "default",
    };

    await this.sendToMultipleDevices(pushTokens, payload);
  }

  /**
   * Send chat message notification
   */
  async sendChatNotification(
    pushTokens: string[],
    fromUserName: string,
    message: string,
    orderId?: string,
  ): Promise<void> {
    const payload: PushNotificationPayload = {
      title: `Message from ${fromUserName}`,
      message:
        message.length > 100 ? message.substring(0, 100) + "..." : message,
      data: {
        type: "chat_message",
        fromUserName,
        orderId,
        timestamp: new Date().toISOString(),
      },
      channelId: "chat",
      priority: "normal",
    };

    await this.sendToMultipleDevices(pushTokens, payload);
  }

  /**
   * Send promotional notification
   */
  async sendPromotionalNotification(
    pushTokens: string[],
    title: string,
    message: string,
    promoData?: any,
  ): Promise<void> {
    const payload: PushNotificationPayload = {
      title,
      message,
      data: {
        type: "promotion",
        ...promoData,
        timestamp: new Date().toISOString(),
      },
      channelId: "promotions",
      priority: "normal",
    };

    await this.sendToMultipleDevices(pushTokens, payload);
  }

  /**
   * Send meal reminder notification
   */
  async sendMealReminder(
    pushTokens: string[],
    mealType: string,
    scheduledTime: string,
  ): Promise<void> {
    const payload: PushNotificationPayload = {
      title: `${mealType} Reminder 🍽️`,
      message: `Your ${mealType.toLowerCase()} is scheduled for ${scheduledTime}`,
      data: {
        type: "meal_reminder",
        mealType,
        scheduledTime,
        timestamp: new Date().toISOString(),
      },
      channelId: "reminders",
      priority: "normal",
    };

    await this.sendToMultipleDevices(pushTokens, payload);
  }

  /**
   * Handle push notification tickets and check for errors
   */
  private async handlePushTickets(
    tickets: ExpoPushTicket[],
    pushTokens: string[],
  ): Promise<void> {
    const receiptIds: ExpoPushReceiptId[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      const pushToken = pushTokens[i];

      if (ticket.status === "error") {
        this.logger.error(
          `Push notification error for ${pushToken}:`,
          ticket.message,
        );

        // Handle specific error types
        if (ticket.details?.error === "DeviceNotRegistered") {
          this.logger.warn(`Device not registered: ${pushToken}`);
          // TODO: Mark device as inactive in database
        }
      } else if (ticket.status === "ok") {
        receiptIds.push(ticket.id);
      }
    }

    // Check receipts after a delay (optional)
    if (receiptIds.length > 0) {
      setTimeout(() => {
        this.checkPushReceipts(receiptIds);
      }, 15000); // Check after 15 seconds
    }
  }

  /**
   * Check push notification receipts for delivery confirmation
   */
  private async checkPushReceipts(
    receiptIds: ExpoPushReceiptId[],
  ): Promise<void> {
    try {
      const receiptIdChunks =
        this.expo.chunkPushNotificationReceiptIds(receiptIds);

      for (const chunk of receiptIdChunks) {
        const receipts =
          await this.expo.getPushNotificationReceiptsAsync(chunk);

        for (const receiptId in receipts) {
          const receipt = receipts[receiptId];

          if (receipt.status === "error") {
            this.logger.error(
              `Push notification delivery error for ${receiptId}:`,
              receipt.message,
            );

            if (receipt.details?.error === "DeviceNotRegistered") {
              this.logger.warn(
                `Device not registered for receipt: ${receiptId}`,
              );
              // TODO: Mark device as inactive in database
            }
          } else if (receipt.status === "ok") {
            this.logger.log(
              `Push notification delivered successfully: ${receiptId}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error("Error checking push notification receipts:", error);
    }
  }

  /**
   * Validate push token
   */
  isValidPushToken(token: string): boolean {
    return Expo.isExpoPushToken(token);
  }

  /**
   * Get push notification limits
   */
  getPushNotificationLimits(): { maxMessages: number; maxReceipts: number } {
    return {
      maxMessages: 100, // Expo's recommended chunk size
      maxReceipts: 1000, // Expo's recommended receipt chunk size
    };
  }
}
