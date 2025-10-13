import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtService } from "@nestjs/jwt";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userType?: "student" | "partner" | "admin";
}

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  namespace: "/notifications",
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedUsers = new Map<string, AuthenticatedSocket>();

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`🔌 New WebSocket connection attempt from ${client.id}`);
    try {
      // Extract user info from token (you'll need to implement token validation)
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization;

      this.logger.log(`🔑 Token received: ${token ? "Present" : "Missing"}`);

      if (!token) {
        this.logger.warn(
          `❌ No token provided, disconnecting client ${client.id}`,
        );
        client.disconnect();
        return;
      }

      // Validate token and extract user info
      const userInfo = await this.validateToken(token);
      if (!userInfo) {
        this.logger.warn(
          `❌ Token validation failed, disconnecting client ${client.id}`,
        );
        client.disconnect();
        return;
      }

      this.logger.log(
        `✅ User authenticated: ${userInfo.userId} (${userInfo.userType})`,
      );

      client.userId = userInfo.userId;
      client.userType = userInfo.userType;

      // Join user-specific room
      client.join(`user_${client.userId}`);

      // Join user-type room for broadcast messages
      client.join(`${client.userType}_users`);

      // Store connection
      this.connectedUsers.set(client.userId, client);

      this.logger.log(`User ${client.userId} (${client.userType}) connected`);

      // Send pending notifications
      await this.sendPendingNotifications(client.userId, client);
    } catch (error) {
      this.logger.error("Connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  @SubscribeMessage("join_order_room")
  async handleJoinOrderRoom(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (client.userId) {
      client.join(`order_${data.orderId}`);
      this.logger.log(
        `User ${client.userId} joined order room: ${data.orderId}`,
      );
    }
  }

  @SubscribeMessage("leave_order_room")
  async handleLeaveOrderRoom(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (client.userId) {
      client.leave(`order_${data.orderId}`);
      this.logger.log(`User ${client.userId} left order room: ${data.orderId}`);
    }
  }

  @SubscribeMessage("mark_notification_read")
  async handleMarkNotificationRead(
    @MessageBody() data: { notificationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      await this.notificationsService.markAsRead(
        data.notificationId,
        client.userId,
      );
      client.emit("notification_marked_read", {
        notificationId: data.notificationId,
      });
    } catch (error) {
      this.logger.error("Error marking notification as read:", error);
    }
  }

  // Real-time notification methods
  async sendToUser(userId: string, notification: any) {
    const userRoom = `user_${userId}`;
    this.server.to(userRoom).emit("notification", notification);
    this.logger.log(`Sent notification to user ${userId}`);
  }

  async sendToPartner(partnerId: string, notification: any) {
    const partnerRoom = `user_${partnerId}`;
    this.server.to(partnerRoom).emit("notification", notification);
    this.logger.log(`Sent notification to partner ${partnerId}`);
  }

  async sendOrderUpdate(orderId: string, update: any) {
    const orderRoom = `order_${orderId}`;
    this.server.to(orderRoom).emit("order_update", {
      orderId,
      ...update,
      timestamp: new Date(),
    });
    this.logger.log(`Sent order update for order ${orderId}`);
  }

  async broadcastToStudents(notification: any) {
    this.server.to("student_users").emit("notification", notification);
    this.logger.log("Broadcast notification to all students");
  }

  async broadcastToPartners(notification: any) {
    this.server.to("partner_users").emit("notification", notification);
    this.logger.log("Broadcast notification to all partners");
  }

  // Partner-Student communication
  async notifyStudentFromPartner(
    studentId: string,
    partnerId: string,
    message: any,
  ) {
    const notification = {
      id: `partner_msg_${Date.now()}`,
      type: "toast",
      variant: "info",
      category: "chat",
      title: "Message from Restaurant",
      message: message.text,
      data: {
        partnerId,
        messageId: message.id,
        orderId: message.orderId,
      },
      timestamp: new Date(),
    };

    await this.sendToUser(studentId, notification);
  }

  async notifyPartnerFromStudent(
    partnerId: string,
    studentId: string,
    message: any,
  ) {
    const notification = {
      id: `student_msg_${Date.now()}`,
      type: "toast",
      variant: "info",
      category: "chat",
      title: "Message from Customer",
      message: message.text,
      data: {
        studentId,
        messageId: message.id,
        orderId: message.orderId,
      },
      timestamp: new Date(),
    };

    await this.sendToPartner(partnerId, notification);
  }

  private async validateToken(token: string): Promise<{
    userId: string;
    userType: "student" | "partner" | "admin";
  } | null> {
    try {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace("Bearer ", "");

      // Validate token using JwtService
      const decoded = await this.jwtService.verifyAsync(cleanToken);

      if (!decoded || !decoded.sub) {
        this.logger.warn("Invalid token: missing user ID");
        return null;
      }

      // Map role to userType
      let userType: "student" | "partner" | "admin" = "student";
      if (decoded.role === "business_partner") {
        userType = "partner";
      } else if (decoded.role === "admin" || decoded.role === "super_admin") {
        userType = "admin";
      }

      return {
        userId: decoded.sub,
        userType,
      };
    } catch (error) {
      this.logger.error("Token validation error:", error);
      return null;
    }
  }

  private async sendPendingNotifications(
    userId: string,
    client: AuthenticatedSocket,
  ) {
    try {
      const pendingNotifications =
        await this.notificationsService.getPendingNotifications(userId);

      for (const notification of pendingNotifications) {
        client.emit("notification", {
          id: notification._id,
          type: notification.type,
          variant: notification.variant,
          category: notification.category,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          timestamp: notification.createdAt,
        });
      }

      if (pendingNotifications.length > 0) {
        this.logger.log(
          `Sent ${pendingNotifications.length} pending notifications to user ${userId}`,
        );
      }
    } catch (error) {
      this.logger.error("Error sending pending notifications:", error);
    }
  }
}
