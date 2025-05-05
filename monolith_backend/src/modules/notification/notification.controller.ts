import { Controller, Get, Param, Sse } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Observable, interval, map } from "rxjs";
import { NotificationService } from "./notification.service";

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
}
