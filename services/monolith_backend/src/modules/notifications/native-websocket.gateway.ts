import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtService } from "@nestjs/jwt";
import { IncomingMessage } from "http";
import { URL } from "url";
import * as WebSocket from "ws";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  userType?: "student" | "partner" | "admin";
  isAlive?: boolean;
}

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

/**
 * Native WebSocket Gateway for universal compatibility
 * Works with React Native's native WebSocket API, Expo Go, and all platforms
 * Runs alongside Socket.IO gateway for maximum compatibility
 */
@Injectable()
export class NativeWebSocketGateway implements OnModuleInit, OnModuleDestroy {
  private server: WebSocket.Server;

  private readonly logger = new Logger(NativeWebSocketGateway.name);
  private connectedUsers = new Map<string, AuthenticatedWebSocket>();
  private heartbeatInterval: NodeJS.Timeout;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.logger.log("🚀 Initializing Native WebSocket Gateway");

    // Check if running on Vercel (serverless) or local development
    const isVercel =
      process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    if (isVercel) {
      this.logger.log("🌐 Running on Vercel - WebSocket serverless mode");
      // On Vercel, WebSocket connections are handled through HTTP upgrade
      // The actual WebSocket server will be created when needed
      return;
    }

    this.logger.log(
      "🏠 Running locally - Creating WebSocket server on port 3002",
    );
    this.server = new WebSocket.Server({
      port: 3002,
      verifyClient: () => {
        // Allow all connections, we'll handle auth in handleConnection
        return true;
      },
    });

    this.server.on(
      "connection",
      (client: AuthenticatedWebSocket, request: IncomingMessage) => {
        this.handleConnection(client, request);
      },
    );

    this.server.on("error", (error) => {
      this.logger.error("Native WebSocket Server error:", error);
    });

    // Start heartbeat to keep connections alive
    this.startHeartbeat();

    this.logger.log(
      "✅ Native WebSocket Gateway initialized successfully on port 3002",
    );
  }

  private async handleConnection(
    client: AuthenticatedWebSocket,
    request: IncomingMessage,
  ) {
    this.logger.log(`🔌 New native WebSocket connection attempt`);

    try {
      // Extract token from query parameters or headers
      const url = new URL(request.url, `http://${request.headers.host}`);
      const token =
        url.searchParams.get("token") ||
        request.headers.authorization?.replace("Bearer ", "");

      this.logger.log(`🔑 Token received: ${token ? "Present" : "Missing"}`);

      if (!token) {
        this.logger.warn("❌ No token provided, disconnecting client");
        client.close(1008, "Token required");
        return;
      }

      // Validate token and extract user info
      const userInfo = await this.validateToken(token);
      if (!userInfo) {
        this.logger.warn("❌ Token validation failed, disconnecting client");
        client.close(1008, "Invalid token");
        return;
      }

      this.logger.log(
        `✅ User authenticated: ${userInfo.userId} (${userInfo.userType})`,
      );

      // Set user info on client
      client.userId = userInfo.userId;
      client.userType = userInfo.userType as "student" | "partner" | "admin";
      client.isAlive = true;

      // Store connection
      this.connectedUsers.set(client.userId, client);

      // Set up message handler
      client.on("message", (data: Buffer) => {
        this.handleMessage(client, data);
      });

      // Set up pong handler for heartbeat
      client.on("pong", () => {
        client.isAlive = true;
      });

      // Set up close handler
      client.on("close", () => {
        this.handleDisconnect(client);
      });

      this.logger.log(
        `User ${client.userId} (${client.userType}) connected via native WebSocket`,
      );

      // Send welcome message
      this.sendMessage(client, {
        type: "connected",
        data: { message: "Connected to TiffinWale notifications" },
        timestamp: Date.now(),
      });

      // Send pending notifications
      await this.sendPendingNotifications(client.userId, client);
    } catch (error) {
      this.logger.error("Native WebSocket connection error:", error);
      client.close(1011, "Server error");
    }
  }

  private handleDisconnect(client: AuthenticatedWebSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(
        `User ${client.userId} (${client.userType}) disconnected from native WebSocket`,
      );
    }
  }

  private async handleMessage(client: AuthenticatedWebSocket, data: Buffer) {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      this.logger.log(`📨 Native WebSocket message received: ${message.type}`);

      switch (message.type) {
        case "ping":
          this.sendMessage(client, { type: "pong", timestamp: Date.now() });
          break;

        case "join_order_room":
          await this.handleJoinOrderRoom(client, message.data);
          break;

        case "leave_order_room":
          await this.handleLeaveOrderRoom(client, message.data);
          break;

        case "mark_notification_read":
          await this.handleMarkNotificationRead(client, message.data);
          break;

        case "send_message_to_partner":
          await this.handleSendMessageToPartner(client, message.data);
          break;

        default:
          this.logger.warn(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      this.logger.error("Error handling native WebSocket message:", error);
    }
  }

  private orderRooms = new Map<string, Set<AuthenticatedWebSocket>>();

  private async handleJoinOrderRoom(client: AuthenticatedWebSocket, data: any) {
    const { orderId } = data;
    if (!orderId) return;

    // Add client to order room
    if (!this.orderRooms.has(orderId)) {
      this.orderRooms.set(orderId, new Set());
    }
    this.orderRooms.get(orderId)?.add(client);

    // Store order tracking info
    this.logger.log(`User ${client.userId} joined order room: ${orderId}`);

    // Send confirmation
    this.sendMessage(client, {
      type: "joined_order_room",
      data: { orderId },
      timestamp: Date.now(),
    });
  }

  private async handleLeaveOrderRoom(
    client: AuthenticatedWebSocket,
    data: any,
  ) {
    const { orderId } = data;
    if (!orderId) return;

    // Remove client from order room
    const room = this.orderRooms.get(orderId);
    if (room) {
      room.delete(client);
      if (room.size === 0) {
        this.orderRooms.delete(orderId);
      }
    }

    this.logger.log(`User ${client.userId} left order room: ${orderId}`);

    // Send confirmation
    this.sendMessage(client, {
      type: "left_order_room",
      data: { orderId },
      timestamp: Date.now(),
    });
  }

  private async handleMarkNotificationRead(
    client: AuthenticatedWebSocket,
    data: any,
  ) {
    const { notificationId } = data;
    if (!notificationId || !client.userId) return;

    try {
      // TODO: Implement markAsRead method in NotificationsService
      // await this.notificationsService.markAsRead(notificationId, client.userId);
      this.logger.log(
        `Marking notification ${notificationId} as read for user ${client.userId}`,
      );

      this.sendMessage(client, {
        type: "notification_marked_read",
        data: { notificationId },
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error("Error marking notification as read:", error);
    }
  }

  private async handleSendMessageToPartner(
    client: AuthenticatedWebSocket,
    data: any,
  ) {
    const { partnerId, message, orderId } = data;
    if (!partnerId || !message || !client.userId) return;

    try {
      // Find partner connection
      const partnerClient = Array.from(this.connectedUsers.values()).find(
        (c) => c.userId === partnerId && c.userType === "partner",
      );

      if (partnerClient) {
        this.sendMessage(partnerClient, {
          type: "chat_message",
          data: {
            from: client.userId,
            message,
            orderId,
            timestamp: Date.now(),
          },
          timestamp: Date.now(),
        });
      }

      // Send confirmation to sender
      this.sendMessage(client, {
        type: "message_sent",
        data: { partnerId, delivered: !!partnerClient },
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error("Error sending message to partner:", error);
    }
  }

  private sendMessage(
    client: AuthenticatedWebSocket,
    message: WebSocketMessage,
  ) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  private async validateToken(
    token: string,
  ): Promise<{ userId: string; userType: string } | null> {
    try {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace(/^Bearer\s+/, "");

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(cleanToken);

      if (!payload.sub || !payload.role) {
        return null;
      }

      return {
        userId: payload.sub,
        userType: payload.role === "customer" ? "student" : payload.role,
      };
    } catch (error) {
      this.logger.error("Token validation error:", error);
      return null;
    }
  }

  private async sendPendingNotifications(
    userId: string,
    client: AuthenticatedWebSocket,
  ) {
    try {
      // TODO: Implement getUnreadNotifications method in NotificationsService
      // const notifications = await this.notificationsService.getUnreadNotifications(userId);
      this.logger.log(`Checking for pending notifications for user ${userId}`);

      // For now, send a welcome notification
      this.sendMessage(client, {
        type: "notification",
        data: {
          id: `welcome_${Date.now()}`,
          type: "toast",
          variant: "success",
          category: "system",
          title: "Welcome to TiffinWale!",
          message: "You're now connected to real-time notifications",
          data: {},
          timestamp: new Date(),
        },
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error("Error sending pending notifications:", error);
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.connectedUsers.forEach((client, userId) => {
        if (!client.isAlive) {
          this.logger.log(`Terminating dead connection for user ${userId}`);
          client.terminate();
          this.connectedUsers.delete(userId);
          return;
        }

        client.isAlive = false;
        client.ping();
      });
    }, 30000); // Check every 30 seconds
  }

  /**
   * Send notification to specific user
   */
  async sendNotificationToUser(userId: string, notification: any) {
    const client = this.connectedUsers.get(userId);
    if (client) {
      this.sendMessage(client, {
        type: "notification",
        data: notification,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Send order update to specific user
   */
  async sendOrderUpdateToUser(userId: string, orderUpdate: any) {
    const client = this.connectedUsers.get(userId);
    if (client) {
      this.sendMessage(client, {
        type: "order_update",
        data: orderUpdate,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Broadcast order update to all clients in an order room
   */
  async broadcastOrderUpdate(orderId: string, orderUpdate: any) {
    const room = this.orderRooms.get(orderId);
    if (!room || room.size === 0) {
      this.logger.log(`No clients in order room: ${orderId}`);
      return;
    }

    const message: WebSocketMessage = {
      type: "order_update",
      data: {
        orderId,
        ...orderUpdate,
      },
      timestamp: Date.now(),
    };

    let broadcastCount = 0;
    room.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        this.sendMessage(client, message);
        broadcastCount++;
      }
    });

    this.logger.log(
      `📡 Broadcast order update for ${orderId} to ${broadcastCount} client(s)`,
    );
  }

  /**
   * Broadcast to all users of a specific type
   */
  async broadcastToUserType(
    userType: "student" | "partner" | "admin",
    message: WebSocketMessage,
  ) {
    this.connectedUsers.forEach((client) => {
      if (client.userType === userType) {
        this.sendMessage(client, message);
      }
    });
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get connected users by type
   */
  getConnectedUsersByType(userType: "student" | "partner" | "admin"): string[] {
    return Array.from(this.connectedUsers.values())
      .filter((client) => client.userType === userType)
      .map((client) => client.userId)
      .filter(Boolean);
  }

  onModuleDestroy() {
    this.logger.log("🛑 Shutting down Native WebSocket Gateway");

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.server) {
      this.server.close(() => {
        this.logger.log("✅ Native WebSocket Server closed");
      });
    }

    // Close all client connections
    this.connectedUsers.forEach((client) => {
      client.close(1001, "Server shutting down");
    });

    this.connectedUsers.clear();
  }
}
