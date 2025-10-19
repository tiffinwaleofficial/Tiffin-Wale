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
import { FirebaseNotificationService } from "./firebase-notification.service";
import { RedisService } from "../redis/redis.service";

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
    private firebaseNotificationService: FirebaseNotificationService,
    private redisService: RedisService,
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

  // Enhanced notification methods with Firebase + Expo dual support

  /**
   * Send enhanced notification with dual delivery (Expo + Firebase)
   */
  async sendEnhancedNotification(dto: CreateNotificationDto): Promise<{
    success: boolean;
    expoResult?: any;
    firebaseResult?: any;
    deliveryStats: {
      expo: { sent: number; failed: number };
      firebase: { sent: number; failed: number };
    };
  }> {
    try {
      const deliveryStats = {
        expo: { sent: 0, failed: 0 },
        firebase: { sent: 0, failed: 0 },
      };

      // Get target devices
      const devices = await this.getTargetDevices(dto);

      if (devices.length === 0) {
        this.logger.warn("No target devices found for notification");
        return { success: false, deliveryStats };
      }

      // Cache notification preferences
      const preferences = await this.getCachedNotificationPreferences(
        dto.userId,
      );

      // Check if user has enabled this notification category
      if (!this.isNotificationAllowed(dto.category, preferences)) {
        this.logger.log(
          `Notification blocked by user preferences: ${dto.category}`,
        );
        return { success: false, deliveryStats };
      }

      // Separate devices by platform for optimal delivery
      const expoTokens = devices
        .filter((d) => d.platform === "ios" || d.platform === "android")
        .map((d) => d.token);

      const webTokens = devices
        .filter((d) => d.platform === "web")
        .map((d) => d.token);

      let expoResult, firebaseResult;

      // Send via Expo for mobile devices (React Native apps)
      if (expoTokens.length > 0) {
        try {
          expoResult = await this.pushNotificationService.sendToMultipleDevices(
            expoTokens,
            {
              title: dto.title,
              message: dto.message,
              data: dto.data || {},
              priority: dto.variant === "error" ? "high" : "default",
              sound: "default",
            },
          );
          deliveryStats.expo.sent = expoTokens.length;
        } catch (error) {
          this.logger.error("Expo notification failed:", error);
          deliveryStats.expo.failed = expoTokens.length;
        }
      }

      // Send via Firebase for web devices and enhanced features
      if (webTokens.length > 0) {
        try {
          firebaseResult =
            await this.firebaseNotificationService.sendToMultipleDevices(
              webTokens,
              {
                title: dto.title,
                body: dto.message,
                data: this.convertDataToStringMap(dto.data || {}),
                priority: dto.variant === "error" ? "high" : "normal",
                sound: "default",
                imageUrl: dto.data?.imageUrl,
                clickAction: dto.data?.clickAction,
                channelId: dto.category,
              },
            );
          deliveryStats.firebase.sent = firebaseResult.successCount;
          deliveryStats.firebase.failed = firebaseResult.failureCount;
        } catch (error) {
          this.logger.error("Firebase notification failed:", error);
          deliveryStats.firebase.failed = webTokens.length;
        }
      }

      // Save notification to database
      const notification = new this.notificationModel({
        title: dto.title,
        message: dto.message,
        type: dto.type,
        variant: dto.variant,
        category: dto.category,
        userId: dto.userId,
        partnerId: dto.partnerId,
        orderId: dto.orderId,
        data: dto.data,
        scheduledFor: dto.scheduledFor,
        channels: dto.channels,
        deliveryStats,
        sentAt: new Date(),
        isRead: false,
      });

      await notification.save();

      // Cache notification for real-time updates
      await this.cacheNotificationForUser(notification, dto.userId);

      // Update delivery analytics
      await this.updateNotificationAnalytics(dto.category, deliveryStats);

      const totalSent = deliveryStats.expo.sent + deliveryStats.firebase.sent;
      const totalFailed =
        deliveryStats.expo.failed + deliveryStats.firebase.failed;

      this.logger.log(
        `Enhanced notification sent: ${totalSent} successful, ${totalFailed} failed`,
      );

      return {
        success: totalSent > 0,
        expoResult,
        firebaseResult,
        deliveryStats,
      };
    } catch (error) {
      this.logger.error("Enhanced notification failed:", error);
      throw error;
    }
  }

  /**
   * Send batch notifications with smart delivery optimization
   */
  async sendBatchNotifications(
    notifications: CreateNotificationDto[],
  ): Promise<{
    totalSent: number;
    totalFailed: number;
    results: any[];
  }> {
    try {
      const results = [];
      let totalSent = 0;
      let totalFailed = 0;

      // Process notifications in batches to respect rate limits
      const batchSize = 100;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);

        const batchPromises = batch.map((notification) =>
          this.sendEnhancedNotification(notification),
        );

        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const stats = result.value.deliveryStats;
            totalSent += stats.expo.sent + stats.firebase.sent;
            totalFailed += stats.expo.failed + stats.firebase.failed;
            results.push(result.value);
          } else {
            totalFailed += 1;
            results.push({ success: false, error: result.reason });
            this.logger.error(
              `Batch notification ${i + index} failed:`,
              result.reason,
            );
          }
        });

        // Add delay between batches
        if (i + batchSize < notifications.length) {
          await this.delay(200);
        }
      }

      this.logger.log(
        `Batch notifications completed: ${totalSent} sent, ${totalFailed} failed`,
      );

      return { totalSent, totalFailed, results };
    } catch (error) {
      this.logger.error("Batch notifications failed:", error);
      throw error;
    }
  }

  /**
   * Send topic-based notifications (Firebase only)
   */
  async sendTopicNotification(
    topic: string,
    notification: {
      title: string;
      body: string;
      data?: Record<string, any>;
      imageUrl?: string;
    },
  ): Promise<string> {
    try {
      return await this.firebaseNotificationService.sendToTopic(topic, {
        title: notification.title,
        body: notification.body,
        data: this.convertDataToStringMap(notification.data || {}),
        imageUrl: notification.imageUrl,
        priority: "normal",
      });
    } catch (error) {
      this.logger.error(`Topic notification failed for ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe users to notification topics
   */
  async subscribeToTopic(userIds: string[], topic: string): Promise<void> {
    try {
      const devices = await this.deviceModel.find({
        userId: { $in: userIds },
        isActive: true,
      });

      const tokens = devices.map((d) => d.token);

      if (tokens.length > 0) {
        await this.firebaseNotificationService.subscribeToTopic(tokens, topic);

        // Cache topic subscriptions
        for (const userId of userIds) {
          await this.redisService.add_to_list(
            `user_topics:${userId}`,
            topic,
            100,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Failed to subscribe users to topic ${topic}:`, error);
      throw error;
    }
  }

  // Helper methods

  private async getTargetDevices(
    dto: CreateNotificationDto,
  ): Promise<DeviceRegistration[]> {
    const query: any = { isActive: true };

    if (dto.userId) {
      query.userId = dto.userId;
    } else if (dto.partnerId) {
      query.userId = dto.partnerId;
    }

    return this.deviceModel.find(query);
  }

  private async getCachedNotificationPreferences(
    userId?: string,
  ): Promise<any> {
    if (!userId) return { all: true };

    try {
      const cached = await this.redisService.get<string>(
        `notification_preferences:${userId}`,
      );
      if (cached) {
        return JSON.parse(cached);
      }

      // Default preferences if not cached
      const defaultPrefs = {
        orderUpdates: true,
        subscriptionNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        partnerNotifications: true,
        paymentNotifications: true,
        systemNotifications: true,
      };

      await this.redisService.set(
        `notification_preferences:${userId}`,
        JSON.stringify(defaultPrefs),
        { ttl: 3600 },
      );
      return defaultPrefs;
    } catch (error) {
      this.logger.error("Failed to get notification preferences:", error);
      return { all: true };
    }
  }

  private isNotificationAllowed(category: string, preferences: any): boolean {
    const categoryMap = {
      order: "orderUpdates",
      promotion: "marketingEmails",
      system: "systemNotifications",
      chat: "systemNotifications",
      reminder: "systemNotifications",
    };

    const prefKey = categoryMap[category] || "systemNotifications";
    return preferences[prefKey] !== false;
  }

  private async cacheNotificationForUser(
    notification: any,
    userId?: string,
  ): Promise<void> {
    if (!userId) return;

    try {
      const cacheKey = `user_notifications:${userId}`;
      await this.redisService.add_to_list(
        cacheKey,
        JSON.stringify({
          id: notification._id,
          title: notification.title,
          message: notification.message,
          category: notification.category,
          sentAt: notification.sentAt,
          isRead: notification.isRead,
        }),
        50,
      ); // Keep last 50 notifications
    } catch (error) {
      this.logger.error("Failed to cache notification:", error);
    }
  }

  private async updateNotificationAnalytics(
    category: string,
    stats: any,
  ): Promise<void> {
    try {
      const date = new Date().toISOString().split("T")[0];

      // Daily notification stats
      await this.redisService.increment(
        `notifications:daily:${date}:sent`,
        stats.expo.sent + stats.firebase.sent,
      );
      await this.redisService.increment(
        `notifications:daily:${date}:failed`,
        stats.expo.failed + stats.firebase.failed,
      );

      // Category stats
      await this.redisService.increment(
        `notifications:category:${category}:sent`,
        stats.expo.sent + stats.firebase.sent,
      );
      await this.redisService.increment(
        `notifications:category:${category}:failed`,
        stats.expo.failed + stats.firebase.failed,
      );

      // Platform stats
      await this.redisService.increment(
        `notifications:platform:expo:sent`,
        stats.expo.sent,
      );
      await this.redisService.increment(
        `notifications:platform:expo:failed`,
        stats.expo.failed,
      );
      await this.redisService.increment(
        `notifications:platform:firebase:sent`,
        stats.firebase.sent,
      );
      await this.redisService.increment(
        `notifications:platform:firebase:failed`,
        stats.firebase.failed,
      );
    } catch (error) {
      this.logger.error("Failed to update notification analytics:", error);
    }
  }

  private convertDataToStringMap(
    data: Record<string, any>,
  ): Record<string, string> {
    const stringMap: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      stringMap[key] =
        typeof value === "string" ? value : JSON.stringify(value);
    }
    return stringMap;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
