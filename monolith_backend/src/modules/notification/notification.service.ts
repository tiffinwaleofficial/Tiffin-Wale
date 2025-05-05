import { Injectable } from "@nestjs/common";
import { OrderStatus } from "../../common/interfaces/order.interface";

@Injectable()
export class NotificationService {
  // For demo purposes only - in a real application, this would come from actual order data
  getRandomOrderStatus(): string {
    const statuses = Object.values(OrderStatus);
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  }
}
