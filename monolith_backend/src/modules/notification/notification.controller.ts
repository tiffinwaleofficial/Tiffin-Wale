import { Controller, Get, Param, Sse, Patch, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Observable, interval, map } from "rxjs";
import { NotificationService } from "./notification.service";
import { GetCurrentUser } from "../../common/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

interface OrderStatusEvent {
  data: {
    orderId: string;
    status: string;
    timestamp: Date;
  };
}

@ApiTags("notifications")
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse("orders/:id/status")
  @ApiOperation({ summary: "Get order status updates through SSE" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "Stream of order status updates" })
  getOrderStatusUpdates(
    @Param("id") orderId: string,
  ): Observable<OrderStatusEvent> {
    // In a real application, this would be connected to a message queue or database change stream
    return interval(5000).pipe(
      map(() => ({
        data: {
          orderId,
          status: this.notificationService.getRandomOrderStatus(),
          timestamp: new Date(),
        },
      })),
    );
  }

  @Get("partner/me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get notifications for current partner" })
  getMyNotifications(@GetCurrentUser("_id") userId: string) {
    return this.notificationService.getForUser(userId);
  }

  @Patch(":id/read")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark a notification as read" })
  markRead(
    @GetCurrentUser("_id") userId: string,
    @Param("id") id: string,
  ) {
    return this.notificationService.markAsRead(userId, id);
  }

  @Patch("partner/me/read-all")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark all notifications as read for current partner" })
  markAllRead(@GetCurrentUser("_id") userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }
}
