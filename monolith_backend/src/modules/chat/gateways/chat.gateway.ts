import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { ChatService } from "../chat.service";

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "chat",
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("ChatGateway");

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    this.logger.log("Chat Gateway Initialized");
  }

  async handleConnection(client: Socket) {
    try {
      // Extract user ID from JWT token (you'll need to implement JWT verification)
      const userId = await this.extractUserIdFromToken(client);
      if (userId) {
        client.data.userId = userId;
        this.logger.log(`Client ${client.id} connected for user ${userId}`);
      } else {
        this.logger.warn(`Client ${client.id} connected without valid token`);
        client.disconnect();
      }
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(`Client ${client.id} disconnected for user ${userId}`);
  }

  @SubscribeMessage("joinConversation")
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId } = data;

      // Verify user has access to conversation
      await this.chatService.getConversationById(conversationId, userId);

      // Join the conversation room
      client.join(`conversation_${conversationId}`);

      this.logger.log(`User ${userId} joined conversation ${conversationId}`);

      return { event: "joinedConversation", data: { conversationId } };
    } catch (error) {
      this.logger.error("Error joining conversation:", error);
      return {
        event: "error",
        data: { message: "Failed to join conversation" },
      };
    }
  }

  @SubscribeMessage("leaveConversation")
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const { conversationId } = data;
      client.leave(`conversation_${conversationId}`);

      this.logger.log(
        `Client ${client.id} left conversation ${conversationId}`,
      );

      return { event: "leftConversation", data: { conversationId } };
    } catch (error) {
      this.logger.error("Error leaving conversation:", error);
      return {
        event: "error",
        data: { message: "Failed to leave conversation" },
      };
    }
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId: string;
      content: string;
      messageType: string;
      mediaUrl?: string;
      mediaThumbnail?: string;
      mediaSize?: number;
      mediaDuration?: number;
      replyTo?: string;
    },
  ) {
    try {
      const userId = client.data.userId;
      const {
        conversationId,
        content,
        messageType,
        mediaUrl,
        mediaThumbnail,
        mediaSize,
        mediaDuration,
        replyTo,
      } = data;

      // Send message to database
      const message = await this.chatService.sendMessage(userId, {
        conversationId,
        content,
        messageType: messageType as any,
        mediaUrl,
        mediaThumbnail,
        mediaSize,
        mediaDuration,
        replyTo,
      });

      // Broadcast message to all clients in the conversation
      this.server.to(`conversation_${conversationId}`).emit("newMessage", {
        type: "new_message",
        message,
      });

      this.logger.log(
        `Message sent in conversation ${conversationId} by user ${userId}`,
      );

      return { event: "messageSent", data: { message } };
    } catch (error) {
      this.logger.error("Error sending message:", error);
      return { event: "error", data: { message: "Failed to send message" } };
    }
  }

  @SubscribeMessage("typing")
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId, isTyping } = data;

      // Update typing indicator in database
      await this.chatService.setTypingIndicator(
        conversationId,
        userId,
        isTyping,
      );

      // Broadcast typing indicator to other clients in the conversation
      client.to(`conversation_${conversationId}`).emit("typingIndicator", {
        type: "typing_indicator",
        conversationId,
        userId,
        isTyping,
        timestamp: new Date(),
      });

      this.logger.log(
        `User ${userId} ${isTyping ? "started" : "stopped"} typing in conversation ${conversationId}`,
      );

      return { event: "typingSet", data: { isTyping } };
    } catch (error) {
      this.logger.error("Error setting typing indicator:", error);
      return {
        event: "error",
        data: { message: "Failed to set typing indicator" },
      };
    }
  }

  @SubscribeMessage("markAsRead")
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; messageIds: string[] },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId, messageIds } = data;

      // Mark messages as read in database
      await this.chatService.markMessagesAsRead(
        conversationId,
        userId,
        messageIds,
      );

      // Broadcast read receipt to other clients in the conversation
      client.to(`conversation_${conversationId}`).emit("messageRead", {
        type: "message_read",
        conversationId,
        userId,
        messageIds,
        timestamp: new Date(),
      });

      this.logger.log(
        `User ${userId} marked messages as read in conversation ${conversationId}`,
      );

      return { event: "messagesMarkedAsRead", data: { messageIds } };
    } catch (error) {
      this.logger.error("Error marking messages as read:", error);
      return {
        event: "error",
        data: { message: "Failed to mark messages as read" },
      };
    }
  }

  @SubscribeMessage("deleteMessage")
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      const userId = client.data.userId;
      const { messageId } = data;

      // Delete message from database
      await this.chatService.deleteMessage(messageId, userId);

      // Broadcast message deletion to all clients
      this.server.emit("messageDeleted", {
        type: "message_deleted",
        messageId,
        userId,
        timestamp: new Date(),
      });

      this.logger.log(`User ${userId} deleted message ${messageId}`);

      return { event: "messageDeleted", data: { messageId } };
    } catch (error) {
      this.logger.error("Error deleting message:", error);
      return { event: "error", data: { message: "Failed to delete message" } };
    }
  }

  // Utility method to extract user ID from JWT token
  private async extractUserIdFromToken(client: Socket): Promise<string | null> {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return null;
      }

      // You'll need to implement JWT verification here
      // For now, returning a mock user ID
      // In a real implementation, you would verify the JWT token and extract the user ID

      // Example implementation:
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // return decoded.userId;

      return "mock_user_id"; // Replace with actual JWT verification
    } catch (error) {
      this.logger.error("Error extracting user ID from token:", error);
      return null;
    }
  }

  // Method to send real-time updates to specific users
  async sendToUser(userId: string, event: string, data: any) {
    // Find all sockets for the user
    const userSockets = Array.from(this.server.sockets.sockets.values()).filter(
      (socket) => socket.data.userId === userId,
    );

    userSockets.forEach((socket) => {
      socket.emit(event, data);
    });
  }

  // Method to send updates to conversation participants
  async sendToConversation(conversationId: string, event: string, data: any) {
    this.server.to(`conversation_${conversationId}`).emit(event, data);
  }
}
