import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "notifications",
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("NotificationGateway");

  afterInit(server: Server) {
    this.logger.log("Notification Gateway Initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    return { event: "joinRoom", data: `Joined room: ${room}` };
  }

  @SubscribeMessage("leaveRoom")
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    return { event: "leaveRoom", data: `Left room: ${room}` };
  }

  // Method to send notifications to clients
  sendNotification(room: string, notification: any) {
    this.server.to(room).emit("notification", notification);
  }

  // Method to send order status updates to clients
  sendOrderStatusUpdate(orderId: string, status: string) {
    this.server
      .to(`order-${orderId}`)
      .emit("orderStatusUpdate", { orderId, status });
  }
}
