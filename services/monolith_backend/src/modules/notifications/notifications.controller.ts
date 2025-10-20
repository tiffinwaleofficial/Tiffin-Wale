import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  NotificationsService,
  CreateNotificationDto,
  RegisterDeviceDto,
} from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post("register-device")
  @ApiOperation({ summary: "Register device for push notifications" })
  @ApiResponse({ status: 201, description: "Device registered successfully" })
  async registerDevice(@Body() dto: RegisterDeviceDto, @Request() req) {
    // Auto-assign user ID from authenticated request
    if (req.user?.id) {
      dto.userId = req.user.id;
    }

    return this.notificationsService.registerDevice(dto);
  }

  @Delete("unregister-device")
  @ApiOperation({ summary: "Unregister device from push notifications" })
  @ApiResponse({ status: 200, description: "Device unregistered successfully" })
  async unregisterDevice(@Body() body: { token: string }) {
    await this.notificationsService.unregisterDevice(body.token);
    return { message: "Device unregistered successfully" };
  }

  @Put("update-device")
  @ApiOperation({ summary: "Update device user association" })
  @ApiResponse({ status: 200, description: "Device updated successfully" })
  async updateDevice(@Body() body: { token: string; userId: string }) {
    await this.notificationsService.updateDeviceUser(body.token, body.userId);
    return { message: "Device updated successfully" };
  }

  @Post("send")
  @ApiOperation({ summary: "Send notification" })
  @ApiResponse({ status: 201, description: "Notification sent successfully" })
  async sendNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(dto);
  }

  @Post("send-order-update")
  @ApiOperation({ summary: "Send order status update notification" })
  @ApiResponse({
    status: 201,
    description: "Order notification sent successfully",
  })
  async sendOrderUpdate(
    @Body()
    body: {
      orderId: string;
      status: string;
      userId: string;
      partnerId?: string;
    },
  ) {
    await this.notificationsService.notifyOrderStatusChange(
      body.orderId,
      body.status,
      body.userId,
      body.partnerId,
    );
    return { message: "Order notification sent successfully" };
  }

  @Post("send-new-order")
  @ApiOperation({ summary: "Notify partner of new order" })
  @ApiResponse({
    status: 201,
    description: "New order notification sent successfully",
  })
  async sendNewOrderNotification(
    @Body() body: { orderId: string; partnerId: string; orderDetails: any },
  ) {
    await this.notificationsService.notifyNewOrder(
      body.orderId,
      body.partnerId,
      body.orderDetails,
    );
    return { message: "New order notification sent successfully" };
  }

  @Post("send-message")
  @ApiOperation({ summary: "Send chat message notification" })
  @ApiResponse({
    status: 201,
    description: "Message notification sent successfully",
  })
  async sendMessageNotification(
    @Body()
    body: {
      fromUserId: string;
      toUserId: string;
      message: string;
      orderId?: string;
    },
  ) {
    await this.notificationsService.notifyNewMessage(
      body.fromUserId,
      body.toUserId,
      body.message,
      body.orderId,
    );
    return { message: "Message notification sent successfully" };
  }

  @Get("history")
  @ApiOperation({ summary: "Get notification history" })
  @ApiResponse({
    status: 200,
    description: "Notification history retrieved successfully",
  })
  async getNotificationHistory(
    @Request() req,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    const userId = req.user.id;
    return this.notificationsService.getNotificationHistory(
      userId,
      page,
      limit,
    );
  }

  @Get("pending")
  @ApiOperation({ summary: "Get pending notifications" })
  @ApiResponse({
    status: 200,
    description: "Pending notifications retrieved successfully",
  })
  async getPendingNotifications(@Request() req) {
    const userId = req.user.id;
    return this.notificationsService.getPendingNotifications(userId);
  }

  @Put(":id/read")
  @ApiOperation({ summary: "Mark notification as read" })
  @ApiResponse({ status: 200, description: "Notification marked as read" })
  async markAsRead(@Param("id") notificationId: string, @Request() req) {
    const userId = req.user.id;
    await this.notificationsService.markAsRead(notificationId, userId);
    return { message: "Notification marked as read" };
  }

  // Partner-specific endpoints
  @Post("partner/order-ready")
  @ApiOperation({ summary: "Notify student that order is ready" })
  @ApiResponse({ status: 201, description: "Order ready notification sent" })
  async notifyOrderReady(
    @Body()
    body: {
      orderId: string;
      userId: string;
      estimatedPickupTime?: string;
    },
  ) {
    await this.notificationsService.createNotification({
      title: "Order Ready! 📦",
      message: body.estimatedPickupTime
        ? `Your order is ready for pickup! Estimated time: ${body.estimatedPickupTime}`
        : "Your order is ready for pickup!",
      type: "modal",
      variant: "success",
      category: "order",
      userId: body.userId,
      orderId: body.orderId,
      data: {
        orderId: body.orderId,
        status: "ready",
        estimatedPickupTime: body.estimatedPickupTime,
      },
      channels: ["websocket", "push"],
    });

    return { message: "Order ready notification sent successfully" };
  }

  @Post("partner/delay-notification")
  @ApiOperation({ summary: "Notify student of order delay" })
  @ApiResponse({ status: 201, description: "Delay notification sent" })
  async notifyOrderDelay(
    @Body()
    body: {
      orderId: string;
      userId: string;
      delayReason: string;
      newEstimatedTime: string;
    },
  ) {
    await this.notificationsService.createNotification({
      title: "Order Delayed ⏰",
      message: `Your order is delayed. ${body.delayReason}. New estimated time: ${body.newEstimatedTime}`,
      type: "banner",
      variant: "warning",
      category: "order",
      userId: body.userId,
      orderId: body.orderId,
      data: {
        orderId: body.orderId,
        delayReason: body.delayReason,
        newEstimatedTime: body.newEstimatedTime,
      },
      channels: ["websocket", "push"],
    });

    return { message: "Delay notification sent successfully" };
  }

  // Promotional notifications
  @Post("promotion/broadcast")
  @ApiOperation({ summary: "Send promotional notification to all users" })
  @ApiResponse({ status: 201, description: "Promotional notification sent" })
  async sendPromotionalNotification(
    @Body()
    body: {
      title: string;
      message: string;
      userType: "student" | "partner" | "all";
      promoCode?: string;
      validUntil?: Date;
    },
  ) {
    // This would typically be restricted to admin users
    await this.notificationsService.createNotification({
      title: body.title,
      message: body.message,
      type: "banner",
      variant: "promotion",
      category: "promotion",
      data: {
        promoCode: body.promoCode,
        validUntil: body.validUntil,
      },
      channels: ["websocket", "push"],
    });

    return { message: "Promotional notification sent successfully" };
  }

  @Post("send-enhanced")
  @ApiOperation({
    summary: "Send enhanced notification with dual Expo + Firebase delivery",
  })
  @ApiResponse({
    status: 201,
    description: "Enhanced notification sent successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        notificationId: { type: "string" },
        deliveryStats: {
          type: "object",
          properties: {
            expo: {
              type: "object",
              properties: {
                sent: { type: "number" },
                failed: { type: "number" },
              },
            },
            firebase: {
              type: "object",
              properties: {
                sent: { type: "number" },
                failed: { type: "number" },
              },
            },
          },
        },
      },
    },
  })
  async sendEnhancedNotification(@Body() dto: CreateNotificationDto) {
    const result =
      await this.notificationsService.sendEnhancedNotification(dto);
    return {
      success: result.success,
      notificationId:
        result.expoResult?.id || result.firebaseResult?.name || "unknown",
      deliveryStats: result.deliveryStats,
      expoResult: result.expoResult,
      firebaseResult: result.firebaseResult,
    };
  }

  @Post("send-topic")
  @ApiOperation({ summary: "Send notification to Firebase topic" })
  @ApiResponse({
    status: 201,
    description: "Topic notification sent successfully",
  })
  async sendTopicNotification(
    @Body()
    body: {
      topic: string;
      notification: {
        title: string;
        body: string;
        data?: Record<string, any>;
        imageUrl?: string;
      };
    },
  ) {
    const result = await this.notificationsService.sendTopicNotification(
      body.topic,
      body.notification,
    );
    return { success: true, messageId: result };
  }
}
