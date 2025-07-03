export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  partnerId: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: NutritionalInfo;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: SpiceLevel;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  category?: MenuCategory;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sugar: number; // in grams
  sodium: number; // in mg
}

export type SpiceLevel = 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';

export interface PartnerStats {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  activeMenuItems: number;
  todayOrders: number;
  todayRevenue: number;
  weeklyStats: {
    orders: number;
    revenue: number;
  };
  monthlyStats: {
    orders: number;
    revenue: number;
  };
  recentOrderTrend: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

export interface Earnings {
  period: 'today' | 'week' | 'month' | 'custom';
  totalEarnings: number;
  totalOrders: number;
  averageOrderValue: number;
  commission: number;
  netEarnings: number;
  breakdown: Array<{
    date: string;
    earnings: number;
    orders: number;
  }>;
  comparison: {
    previousPeriod: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface Review {
  id: string;
  customerId: string;
  orderId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  order: {
    items: Array<{
      name: string;
      quantity: number;
    }>;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'NEW_ORDER' 
  | 'ORDER_CANCELLED' 
  | 'PAYMENT_RECEIVED' 
  | 'REVIEW_RECEIVED' 
  | 'PROFILE_UPDATE' 
  | 'SYSTEM_ANNOUNCEMENT';

export interface PartnerSettings {
  isAcceptingOrders: boolean;
  autoAcceptOrders: boolean;
  preparationTimeBuffer: number; // extra minutes to add to preparation time
  maxOrdersPerHour: number;
  deliveryRadius: number; // in kilometers
  minimumOrderValue: number;
  notifications: {
    newOrders: boolean;
    orderUpdates: boolean;
    payments: boolean;
    reviews: boolean;
    marketing: boolean;
  };
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    };
  };
}

export interface PayoutDetails {
  id: string;
  amount: number;
  period: {
    startDate: string;
    endDate: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  bankAccount: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  createdAt: string;
  processedAt?: string;
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: 'CHECKING' | 'SAVINGS';
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  attachments?: string[];
  responses: Array<{
    id: string;
    message: string;
    isFromSupport: boolean;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
} 