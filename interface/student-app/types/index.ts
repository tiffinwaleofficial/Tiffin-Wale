export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscriptionActive: boolean;
  subscriptionEndDate?: string;
  subscriptionPlan?: SubscriptionPlan;
  profileImage?: string;
  dob?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  mealsPerDay: number;
  daysPerWeek: number;
  features: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisineType: string[];
  rating: number;
  reviewCount: number;
  image: string;
  featuredDish?: string;
  distance?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: string[];
  isVegetarian: boolean;
  rating: number;
  reviewCount: number;
  availableToday: boolean;
  restaurantId: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  menu: MenuItem[];
  status: 'scheduled' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  restaurantId: string;
  restaurantName: string;
}

export interface OrderAdditional {
  id: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
}

export interface Review {
  id: string;
  mealId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
  userImage?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
  actionLink?: string;
}