export interface Order {
  id: string;
  customerId: string;
  partnerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  meal?: {
    id: string;
    name: string;
    type: MealType;
    scheduledTime: string;
  };
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  menuItem?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED';

export type MealType = 
  | 'BREAKFAST' 
  | 'LUNCH' 
  | 'DINNER' 
  | 'SNACK';

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  message?: string;
  estimatedTime?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrderFilter {
  status?: OrderStatus;
  mealType?: MealType;
  paymentStatus?: PaymentStatus;
  date?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}

export interface CreateOrderData {
  customerId: string;
  items: Omit<OrderItem, 'id'>[];
  deliveryAddress: Address;
  paymentMethod: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  mealType?: MealType;
  scheduledTime?: string;
} 