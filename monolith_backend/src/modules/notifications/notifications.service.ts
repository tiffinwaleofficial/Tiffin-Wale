import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  DeviceRegistration,
  DeviceRegistrationDocument,
} from "./schemas/device-registration.schema";
import {
  Notification,
  NotificationDocument,
} from "./schemas/notification.schema";
import {
  NotificationTemplate,
  NotificationTemplateDocument,
} from "./schemas/notification-template.schema";
import { PushNotificationService } from "./push-notification.service";

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: "toast" | "modal" | "banner" | "push";
  variant: "success" | "error" | "warning" | "info" | "order" | "promotion";
  category: "order" | "promotion" | "system" | "chat" | "reminder";
  userId?: string;
  partnerId?: string;
  orderId?: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  channels?: string[];
  templateKey?: string;
  templateVariables?: Record<string, any>;
}

export interface RegisterDeviceDto {
  token: string;
  platform: "ios" | "android" | "web";
  deviceId: string;
  userId?: string;
  deviceName?: string;
  osVersion?: string;
  appVersion?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(DeviceRegistration.name)
    private deviceModel: Model<DeviceRegistrationDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationTemplate.name)
    private templateModel: Model<NotificationTemplateDocument>,
    private pushNotificationService: PushNotificationService,
  ) {}

  // Device Registration
  async registerDevice(dto: RegisterDeviceDto): Promise<DeviceRegistration> {
    try {
      // Check if device already exists
      let device = await this.deviceModel.findOne({
        $or: [{ token: dto.token }, { deviceId: dto.deviceId }],
      });

      if (device) {
        // Update existing device
        device.token = dto.token;
        device.platform = dto.platform;
        device.userId = dto.userId as any;
        device.deviceName = dto.deviceName;
        device.osVersion = dto.osVersion;
        device.appVersion = dto.appVersion;
        device.isActive = true;
        device.lastUsed = new Date();
        await device.save();
      } else {
        // Create new device registration
        device = new this.deviceModel({
          ...dto,
          userId: dto.userId as any,
          isActive: true,
          lastUsed: new Date(),
        });
        await device.save();
      }

      this.logger.log(`Device registered: ${dto.platform} - ${dto.deviceId}`);
      return device;
    } catch (error) {
      this.logger.error("Error registering device:", error);
      throw error;
    }
  }

  async unregisterDevice(token: string): Promise<void> {
    try {
      await this.deviceModel.updateOne({ token }, { isActive: false });
      this.logger.log(`Device unregistered: ${token}`);
    } catch (error) {
      this.logger.error("Error unregistering device:", error);
      throw error;
    }
  }

  async updateDeviceUser(token: string, userId: string): Promise<void> {
    try {
      await this.deviceModel.updateOne(
        { token },
        { userId: userId as any, lastUsed: new Date() },
      );
      this.logger.log(`Device user updated: ${token} -> ${userId}`);
    } catch (error) {
      this.logger.error("Error updating device user:", error);
      throw error;
    }
  }

  // Notification Creation and Sending
  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    try {
      const notificationData = { ...dto };

      // If using template, merge template data
      if (dto.templateKey) {
        const template = await this.templateModel.findOne({
          key: dto.templateKey,
          isActive: true,
        });

        if (template) {
          notificationData.title = this.processTemplate(
            template.title,
            dto.templateVariables || {},
          );
          notificationData.message = this.processTemplate(
            template.message,
            dto.templateVariables || {},
          );
          notificationData.variant = template.variant as any;
          notificationData.category = template.category as any;
          notificationData.channels = dto.channels || template.defaultChannels;
        }
      }

      const notification = new this.notificationModel({
        ...notificationData,
        userId: dto.userId as any,
        partnerId: dto.partnerId as any,
        orderId: dto.orderId as any,
        status: dto.scheduledFor ? "pending" : "sent",
        channels: dto.channels || ["websocket", "push"],
      });

      await notification.save();

      // Send immediately if not scheduled
      if (!dto.scheduledFor) {
        await this.sendNotification(notification);
      }

      return notification;
    } catch (error) {
      this.logger.error("Error creating notification:", error);
      throw error;
    }
  }

  async sendNotification(notification: NotificationDocument): Promise<void> {
    try {
      const channels = notification.channels || ["websocket"];

      // Send via WebSocket (handled by gateway)
      if (channels.includes("websocket")) {
        // The gateway will handle WebSocket sending
        notification.status = "sent";
        notification.sentAt = new Date();
      }

      // Send via Push Notification
      if (channels.includes("push") && notification.userId) {
        const devices = await this.deviceModel.find({
          userId: notification.userId,
          isActive: true,
        });

        for (const device of devices) {
          if (this.shouldSendNotification(device, notification)) {
            await this.pushNotificationService.sendToDevice(device.token, {
              title: notification.title,
              message: notification.message,
              data: {
                notificationId: notification._id.toString(),
                type: notification.type,
                variant: notification.variant,
                category: notification.category,
                ...notification.data,
              },
            });
          }
        }
      }

      await notification.save();
      this.logger.log(`Notification sent: ${notification._id}`);
    } catch (error) {
      this.logger.error("Error sending notification:", error);
      notification.status = "failed";
      notification.errorMessage = error.message;
      await notification.save();
    }
  }

  // Order-specific notifications
  async notifyOrderStatusChange(
    orderId: string,
    status: string,
    userId: string,
    partnerId?: string,
  ): Promise<void> {
    const statusMessages = {
      confirmed: "Your order has been confirmed! 🎉",
      preparing: "Your order is being prepared 👨‍🍳",
      ready: "Your order is ready for pickup! 📦",
      delivered: "Your order has been delivered! Enjoy your meal! 🍽️",
      cancelled: "Your order has been cancelled 😔",
    };

    await this.createNotification({
      title: "Order Update",
      message: statusMessages[status] || `Order status updated to ${status}`,
      type: "toast",
      variant: status === "cancelled" ? "error" : "success",
      category: "order",
      userId,
      orderId,
      data: { orderId, status, partnerId },
      channels: ["websocket", "push"],
    });
  }

  async notifyNewOrder(
    orderId: string,
    partnerId: string,
    orderDetails: any,
  ): Promise<void> {
    await this.createNotification({
      title: "New Order Received! 🔔",
      message: `Order #${orderDetails.orderNumber} - ₹${orderDetails.total}`,
      type: "modal",
      variant: "order",
      category: "order",
      partnerId,
      orderId,
      data: { orderId, ...orderDetails },
      channels: ["websocket", "push"],
    });
  }

  // Chat notifications
  async notifyNewMessage(
    fromUserId: string,
    toUserId: string,
    message: string,
    orderId?: string,
  ): Promise<void> {
    await this.createNotification({
      title: "New Message",
      message: message.length > 50 ? message.substring(0, 50) + "..." : message,
      type: "toast",
      variant: "info",
      category: "chat",
      userId: toUserId,
      data: { fromUserId, orderId, messagePreview: message },
      channels: ["websocket", "push"],
    });
  }

  // Scheduled notifications (cron jobs)
  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();
      const scheduledNotifications = await this.notificationModel.find({
        status: "pending",
        scheduledFor: { $lte: now },
      });

      for (const notification of scheduledNotifications) {
        await this.sendNotification(notification);
      }

      if (scheduledNotifications.length > 0) {
        this.logger.log(
          `Processed ${scheduledNotifications.length} scheduled notifications`,
        );
      }
    } catch (error) {
      this.logger.error("Error processing scheduled notifications:", error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyMealReminders(): Promise<void> {
    // Send meal reminders to active subscribers
    this.logger.log("Sending daily meal reminders...");
    // Implementation for meal reminders
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async sendEveningPromotions(): Promise<void> {
    // Send evening promotional notifications
    this.logger.log("Sending evening promotions...");
    // Implementation for promotional notifications
  }

  // Utility methods
  async markAsRead(notificationId: string, userId?: string): Promise<void> {
    const query: any = { _id: notificationId };
    if (userId) {
      query.userId = userId;
    }

    await this.notificationModel.updateOne(query, {
      isRead: true,
      readAt: new Date(),
    });
  }

  async getPendingNotifications(
    userId: string,
  ): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({
        userId,
        status: "sent",
        isRead: false,
      })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async getNotificationHistory(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<NotificationDocument[]> {
    const skip = (page - 1) * limit;
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  private shouldSendNotification(
    device: DeviceRegistrationDocument,
    notification: NotificationDocument,
  ): boolean {
    // Check user preferences
    const category = notification.category;
    if (!device.preferences[category]) {
      return false;
    }

    // Check quiet hours
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
    const { start, end } = device.quietHours;

    if (currentTime >= start && currentTime <= end) {
      // Only allow urgent notifications during quiet hours
      return (
        notification.variant === "error" || notification.category === "order"
      );
    }

    return true;
  }

  private processTemplate(
    template: string,
    variables: Record<string, any>,
  ): string {
    let processed = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      processed = processed.replace(placeholder, String(value));
    }

    return processed;
  }
}
