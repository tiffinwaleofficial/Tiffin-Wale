/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * Password (min 8 characters, must include uppercase, lowercase, number, and special character)
   * @example "Password123!"
   */
  password: string;
  /**
   * User role
   * @default "customer"
   */
  role: "customer" | "business" | "admin" | "super_admin";
  /**
   * First name
   * @example "John"
   */
  firstName?: string;
  /**
   * Last name
   * @example "Doe"
   */
  lastName?: string;
  /**
   * Phone number
   * @example "1234567890"
   */
  phoneNumber?: string;
}

export interface AddressDto {
  /**
   * Street address
   * @example "123 Main Street"
   */
  street: string;
  /**
   * City
   * @example "New York"
   */
  city: string;
  /**
   * State
   * @example "NY"
   */
  state: string;
  /**
   * Postal code
   * @example "10001"
   */
  postalCode: string;
  /**
   * Country
   * @example "USA"
   */
  country: string;
}

export interface BusinessHoursDto {
  /**
   * Opening time
   * @example "09:00"
   */
  open: string;
  /**
   * Closing time
   * @example "22:00"
   */
  close: string;
  /**
   * Operating days
   * @example ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
   */
  days: string[];
}

export interface SocialMediaDto {
  /**
   * Instagram URL
   * @example "https://instagram.com/restaurant"
   */
  instagram?: string;
  /**
   * Facebook URL
   * @example "https://facebook.com/restaurant"
   */
  facebook?: string;
  /**
   * Twitter URL
   * @example "https://twitter.com/restaurant"
   */
  twitter?: string;
}

export interface DocumentsDto {
  /**
   * License documents URLs
   * @example ["https://cloudinary.com/license1.jpg","https://cloudinary.com/license2.pdf"]
   */
  licenseDocuments?: string[];
  /**
   * Certification documents URLs
   * @example ["https://cloudinary.com/cert1.jpg","https://cloudinary.com/cert2.pdf"]
   */
  certificationDocuments?: string[];
  /**
   * Identity documents URLs
   * @example ["https://cloudinary.com/id1.jpg","https://cloudinary.com/id2.pdf"]
   */
  identityDocuments?: string[];
  /**
   * Other documents URLs
   * @example ["https://cloudinary.com/other1.jpg","https://cloudinary.com/other2.pdf"]
   */
  otherDocuments?: string[];
}

export interface RegisterPartnerDto {
  /**
   * Email address
   * @example "partner@example.com"
   */
  email: string;
  /**
   * Password (min 8 characters, must include uppercase, lowercase, number, and special character)
   * @example "Password123!"
   */
  password: string;
  /**
   * User role
   * @default "business"
   */
  role: "customer" | "business" | "admin" | "super_admin";
  /**
   * First name
   * @example "John"
   */
  firstName: string;
  /**
   * Last name
   * @example "Doe"
   */
  lastName: string;
  /**
   * Phone number
   * @example "1234567890"
   */
  phoneNumber: string;
  /**
   * Business name
   * @example "Tasty Bites Restaurant"
   */
  businessName: string;
  /**
   * Business description
   * @example "Delicious home-cooked meals with authentic flavors"
   */
  description: string;
  /**
   * Cuisine types offered
   * @example ["Indian","Chinese","Continental"]
   */
  cuisineTypes: string[];
  /** Business address */
  address: AddressDto;
  /** Business operating hours */
  businessHours: BusinessHoursDto;
  /**
   * Contact email
   * @example "contact@restaurant.com"
   */
  contactEmail?: string;
  /**
   * Contact phone
   * @example "+1234567890"
   */
  contactPhone?: string;
  /**
   * WhatsApp number
   * @example "+1234567890"
   */
  whatsappNumber?: string;
  /**
   * GST number
   * @example "GST123456789"
   */
  gstNumber?: string;
  /**
   * License number
   * @example "LIC123456789"
   */
  licenseNumber?: string;
  /**
   * Year established
   * @example 2010
   */
  establishedYear?: number;
  /**
   * Delivery radius in km
   * @default 5
   * @example 5
   */
  deliveryRadius?: number;
  /**
   * Minimum order amount
   * @default 100
   * @example 100
   */
  minimumOrderAmount?: number;
  /**
   * Delivery fee
   * @default 0
   * @example 0
   */
  deliveryFee?: number;
  /**
   * Estimated delivery time in minutes
   * @default 30
   * @example 30
   */
  estimatedDeliveryTime?: number;
  /**
   * Commission rate percentage
   * @default 20
   * @example 20
   */
  commissionRate?: number;
  /**
   * Logo URL
   * @example "https://cloudinary.com/logo.jpg"
   */
  logoUrl?: string;
  /**
   * Banner URL
   * @example "https://cloudinary.com/banner.jpg"
   */
  bannerUrl?: string;
  /** Social media links */
  socialMedia?: SocialMediaDto;
  /**
   * Is vegetarian only
   * @default false
   * @example false
   */
  isVegetarian?: boolean;
  /**
   * Has delivery service
   * @default true
   * @example true
   */
  hasDelivery?: boolean;
  /**
   * Has pickup service
   * @default true
   * @example true
   */
  hasPickup?: boolean;
  /**
   * Accepts cash payments
   * @default true
   * @example true
   */
  acceptsCash?: boolean;
  /**
   * Accepts card payments
   * @default true
   * @example true
   */
  acceptsCard?: boolean;
  /**
   * Accepts UPI payments
   * @default true
   * @example true
   */
  acceptsUPI?: boolean;
  /** Business documents */
  documents?: DocumentsDto;
  /**
   * Agree to marketing emails
   * @default false
   * @example false
   */
  agreeToMarketing?: boolean;
}

export interface LoginDto {
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * User password
   * @example "Password123!"
   */
  password: string;
}

export interface ChangePasswordDto {
  /**
   * Current password
   * @example "OldPassword123!"
   */
  oldPassword: string;
  /**
   * New password (min 8 characters, must include uppercase, lowercase, number, and special character)
   * @example "NewPassword123!"
   */
  newPassword: string;
}

export interface RefreshTokenDto {
  /** JWT refresh token issued to the user */
  refreshToken: string;
}

export interface CreateUserDto {
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * User password
   * @example "Password123"
   */
  password: string;
  /**
   * User role
   * @default "customer"
   */
  role: "customer" | "business" | "admin" | "super_admin";
  /**
   * First name
   * @example "John"
   */
  firstName?: string;
  /**
   * Last name
   * @example "Doe"
   */
  lastName?: string;
  /**
   * Phone number
   * @example "1234567890"
   */
  phoneNumber?: string;
  /**
   * Profile image URL
   * @example "https://example.com/profile.jpg"
   */
  profileImage?: string;
}

export type UpdateUserDto = object;

export interface CreateSubscriptionDto {
  /**
   * User ID who is subscribing
   * @example "60d21b4667d0d8992e610c85"
   */
  customer: string;
  /**
   * Subscription plan ID
   * @example "60d21b4667d0d8992e610c86"
   */
  plan: string;
  /**
   * Status of subscription
   * @default "pending"
   * @example "pending"
   */
  status: "active" | "paused" | "cancelled" | "expired" | "pending";
  /**
   * Start date of subscription
   * @format date-time
   * @example "2023-06-15T00:00:00.000Z"
   */
  startDate: string;
  /**
   * End date of subscription
   * @format date-time
   * @example "2023-07-15T00:00:00.000Z"
   */
  endDate: string;
  /**
   * Whether to auto-renew the subscription
   * @default false
   * @example true
   */
  autoRenew: boolean;
  /**
   * Payment frequency
   * @default "monthly"
   * @example "monthly"
   */
  paymentFrequency: "onetime" | "weekly" | "monthly" | "quarterly" | "yearly";
  /**
   * Total amount of subscription
   * @example 199.99
   */
  totalAmount: number;
  /**
   * Discount amount applied to subscription
   * @default 0
   * @example 20
   */
  discountAmount: number;
  /**
   * Payment ID from payment processor
   * @example "pay_1234567890"
   */
  paymentId?: string;
  /**
   * Whether the subscription is paid
   * @default false
   * @example true
   */
  isPaid: boolean;
  /**
   * Custom meal preferences or requirements
   * @example ["No onions","Extra spicy"]
   */
  customizations?: string[];
}

export interface UpdateSubscriptionDto {
  /**
   * Reason for cancellation if subscription is cancelled
   * @example "Moving to a different city"
   */
  cancellationReason?: string;
}

export interface CreateSubscriptionPlanDto {
  /**
   * Name of the subscription plan
   * @example "Premium Daily Plan"
   */
  name: string;
  /**
   * Description of the subscription plan
   * @example "Get 3 meals per day, 7 days a week with premium quality food"
   */
  description: string;
  /**
   * Price of the subscription plan
   * @example 2999
   */
  price: number;
  /**
   * Number of meals per day
   * @example 3
   */
  mealsPerDay: number;
  /**
   * Number of days per week
   * @example 7
   */
  daysPerWeek: number;
  /**
   * Features included in the plan
   * @example ["Free delivery","Premium quality","24/7 support"]
   */
  features?: string[];
}

export type UpdateSubscriptionPlanDto = object;

export interface UpdateMealStatusDto {
  /**
   * New status for the meal
   * @example "preparing"
   */
  status:
    | "scheduled"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled"
    | "skipped";
}

export interface SkipMealDto {
  /**
   * Reason for skipping the meal
   * @example "I will be out of town"
   */
  reason?: string;
}

export interface RateMealDto {
  /**
   * Rating for the meal (1-5)
   * @min 1
   * @max 5
   * @example 4
   */
  rating: number;
  /**
   * Review comment for the meal
   * @example "The food was delicious and arrived on time."
   */
  review?: string;
}

export interface CreateMealDto {
  /**
   * Type of meal
   * @example "lunch"
   */
  type: "breakfast" | "lunch" | "dinner" | "snack";
  /**
   * Date for the meal
   * @example "2024-01-15T12:00:00Z"
   */
  date: string;
  /**
   * Array of menu item IDs
   * @example ["60d21b4667d0d8992e610c87"]
   */
  menu: string[];
  /**
   * Restaurant ID
   * @example "60d21b4667d0d8992e610c87"
   */
  restaurantId: string;
  /**
   * Restaurant name
   * @example "Tasty Bites"
   */
  restaurantName: string;
  /**
   * User ID
   * @example "60d21b4667d0d8992e610c87"
   */
  userId: string;
}

export interface CreatePartnerDto {
  /**
   * Business name
   * @example "Tasty Bites Restaurant"
   */
  businessName: string;
  /**
   * Business description
   * @example "Delicious home-cooked meals with authentic flavors"
   */
  description: string;
  /**
   * Cuisine types offered
   * @example ["Indian","Chinese","Continental"]
   */
  cuisineTypes: string[];
  /** Business address */
  address: AddressDto;
  /** Business operating hours */
  businessHours: BusinessHoursDto;
  /**
   * Contact email
   * @example "contact@restaurant.com"
   */
  contactEmail?: string;
  /**
   * Contact phone
   * @example "+1234567890"
   */
  contactPhone?: string;
  /**
   * WhatsApp number
   * @example "+1234567890"
   */
  whatsappNumber?: string;
  /**
   * GST number
   * @example "GST123456789"
   */
  gstNumber?: string;
  /**
   * License number
   * @example "LIC123456789"
   */
  licenseNumber?: string;
  /**
   * Year established
   * @example 2010
   */
  establishedYear?: number;
  /**
   * Delivery radius in km
   * @default 5
   * @example 5
   */
  deliveryRadius?: number;
  /**
   * Minimum order amount
   * @default 100
   * @example 100
   */
  minimumOrderAmount?: number;
  /**
   * Delivery fee
   * @default 0
   * @example 0
   */
  deliveryFee?: number;
  /**
   * Estimated delivery time in minutes
   * @default 30
   * @example 30
   */
  estimatedDeliveryTime?: number;
  /**
   * Commission rate percentage
   * @default 20
   * @example 20
   */
  commissionRate?: number;
  /**
   * Logo URL
   * @example "https://cloudinary.com/logo.jpg"
   */
  logoUrl?: string;
  /**
   * Banner URL
   * @example "https://cloudinary.com/banner.jpg"
   */
  bannerUrl?: string;
  /** Social media links */
  socialMedia?: SocialMediaDto;
  /**
   * Is vegetarian only
   * @default false
   * @example false
   */
  isVegetarian?: boolean;
  /**
   * Has delivery service
   * @default true
   * @example true
   */
  hasDelivery?: boolean;
  /**
   * Has pickup service
   * @default true
   * @example true
   */
  hasPickup?: boolean;
  /**
   * Accepts cash payments
   * @default true
   * @example true
   */
  acceptsCash?: boolean;
  /**
   * Accepts card payments
   * @default true
   * @example true
   */
  acceptsCard?: boolean;
  /**
   * Accepts UPI payments
   * @default true
   * @example true
   */
  acceptsUPI?: boolean;
  /** Business documents */
  documents?: DocumentsDto;
  /**
   * Whether the partner is accepting orders
   * @default true
   * @example true
   */
  isAcceptingOrders: boolean;
  /**
   * Whether the partner is featured
   * @default false
   * @example false
   */
  isFeatured: boolean;
  /**
   * Average rating
   * @example 4.5
   */
  averageRating?: number;
  /**
   * Total review count
   * @example 150
   */
  totalReviews?: number;
}

export type UpdatePartnerDto = object;

export interface CreateCategoryDto {
  /**
   * Name of the category
   * @example "Main Dishes"
   */
  name: string;
  /**
   * Description of the category
   * @example "Our signature main course offerings"
   */
  description?: string;
  /**
   * Business partner ID who owns this category
   * @example "60d21b4667d0d8992e610c85"
   */
  businessPartner: string;
  /**
   * URL to the category image
   * @example "https://example.com/categories/main-dishes.jpg"
   */
  imageUrl?: string;
  /**
   * Order/position of the category in the menu
   * @example 2
   */
  order?: number;
  /**
   * Tags for the category
   * @example ["popular","recommended"]
   */
  tags?: any[][];
}

export interface UpdateCategoryDto {
  /**
   * Name of the category
   * @example "Main Dishes"
   */
  name?: string;
  /**
   * Description of the category
   * @example "Our signature main course offerings"
   */
  description?: string;
  /**
   * Business partner ID who owns this category
   * @example "60d21b4667d0d8992e610c85"
   */
  businessPartner?: string;
  /**
   * URL to the category image
   * @example "https://example.com/categories/main-dishes.jpg"
   */
  imageUrl?: string;
  /**
   * Order/position of the category in the menu
   * @example 2
   */
  order?: number;
  /**
   * Tags for the category
   * @example ["popular","recommended"]
   */
  tags?: any[][];
}

export interface NutritionalInfoDto {
  /**
   * Calories per serving
   * @example 450
   */
  calories: number;
  /**
   * Protein content in grams
   * @example 20
   */
  protein: number;
  /**
   * Carbohydrate content in grams
   * @example 50
   */
  carbs: number;
  /**
   * Fat content in grams
   * @example 15
   */
  fat: number;
}

export interface CreateMenuItemDto {
  /**
   * Name of the menu item
   * @example "Butter Chicken"
   */
  name: string;
  /**
   * Description of the menu item
   * @example "Creamy and rich chicken curry"
   */
  description: string;
  /**
   * Price of the menu item
   * @example 12.99
   */
  price: number;
  /**
   * URL to the menu item image
   * @example "https://example.com/image.jpg"
   */
  imageUrl: string;
  /**
   * ID of the business partner
   * @example "6507e9ce0cb7ea2d3c9d10a9"
   */
  businessPartner: string;
  /**
   * ID of the category
   * @example "6507e9ce0cb7ea2d3c9d10b2"
   */
  category: string;
  /**
   * Whether the menu item is available
   * @default true
   * @example true
   */
  isAvailable: boolean;
  /**
   * Tags for the menu item
   * @example ["spicy","popular","recommended"]
   */
  tags: any[][];
  /**
   * Allergens in the menu item
   * @example ["dairy","nuts","gluten"]
   */
  allergens: any[][];
  /** Nutritional information of the menu item */
  nutritionalInfo: NutritionalInfoDto;
}

export interface UpdateNutritionalInfoDto {
  /**
   * Calories per serving
   * @example 450
   */
  calories?: number;
  /**
   * Protein content in grams
   * @example 20
   */
  protein?: number;
  /**
   * Carbohydrate content in grams
   * @example 50
   */
  carbs?: number;
  /**
   * Fat content in grams
   * @example 15
   */
  fat?: number;
}

export interface UpdateMenuItemDto {
  /**
   * Name of the menu item
   * @example "Butter Naan"
   */
  name?: string;
  /**
   * Description of the menu item
   * @example "Creamy and rich naan"
   */
  description?: string;
  /**
   * Price of the menu item
   * @example 12.99
   */
  price?: number;
  /**
   * URL to the menu item image
   * @example "https://example.com/image.jpg"
   */
  imageUrl?: string;
  /**
   * ID of the business partner
   * @example "6507e9ce0cb7ea2d3c9d10a9"
   */
  businessPartner?: string;
  /**
   * ID of the category
   * @example "6507e9ce0cb7ea2d3c9d10b2"
   */
  category?: string;
  /**
   * Whether the menu item is available
   * @default true
   * @example true
   */
  isAvailable?: boolean;
  /**
   * Tags for the menu item
   * @example ["spicy","popular","recommended"]
   */
  tags?: any[][];
  /**
   * Allergens in the menu item
   * @example ["dairy","nuts","gluten"]
   */
  allergens?: any[][];
  /** Nutritional information of the menu item */
  nutritionalInfo?: UpdateNutritionalInfoDto;
}

export interface CreateFeedbackDto {
  /**
   * Type of feedback
   * @example "suggestion"
   */
  type: "general" | "suggestion" | "bug" | "complaint";
  /**
   * Brief subject of the feedback
   * @example "Add Meal Plans Feature"
   */
  subject: string;
  /**
   * Detailed feedback message
   * @example "It would be great if we could subscribe to weekly meal plans at a discounted rate."
   */
  message: string;
  /**
   * Category of the feedback
   * @example "app"
   */
  category: "app" | "food" | "delivery" | "partner" | "other";
  /**
   * Optional rating (1-5)
   * @min 1
   * @max 5
   * @example 4
   */
  rating?: number;
  /**
   * Device information for technical issues
   * @example {"platform":"web","browser":"Chrome 91.0.4472.124","device":"Desktop","os":"Windows 10"}
   */
  deviceInfo?: object;
}

export interface FeedbackResponseDto {
  /**
   * Unique identifier
   * @example "60d21b4667d0d8992e610c90"
   */
  id: string;
  /**
   * Reference to User schema if authenticated
   * @example "60d21b4667d0d8992e610c80"
   */
  user?: string;
  /**
   * Type of feedback
   * @example "suggestion"
   */
  type: "general" | "suggestion" | "bug" | "complaint";
  /**
   * Brief subject of the feedback
   * @example "Add Meal Plans Feature"
   */
  subject: string;
  /**
   * Detailed feedback message
   * @example "It would be great if we could subscribe to weekly meal plans at a discounted rate."
   */
  message: string;
  /**
   * Category of the feedback
   * @example "app"
   */
  category: "app" | "food" | "delivery" | "partner" | "other";
  /**
   * Priority level
   * @example "medium"
   */
  priority: "low" | "medium" | "high" | "critical";
  /**
   * Status of the feedback
   * @example "new"
   */
  status: "new" | "in-review" | "addressed" | "closed";
  /**
   * Optional rating (1-5)
   * @example 4
   */
  rating?: number;
  /**
   * Device information for technical issues
   * @example {"platform":"web","browser":"Chrome 91.0.4472.124","device":"Desktop","os":"Windows 10"}
   */
  deviceInfo?: object;
  /**
   * Whether the feedback has been resolved
   * @example false
   */
  isResolved: boolean;
  /**
   * Timestamp of submission
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  createdAt: string;
  /**
   * Timestamp of last update
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  updatedAt: string;
}

export interface OrderItemDto {
  /**
   * Menu Item ID
   * @example "6075c1a5a9f14a2c9c5df91a"
   */
  mealId: string;
  /**
   * Quantity of the menu item
   * @example 2
   */
  quantity: number;
  /**
   * Special instructions for this item
   * @example "No onions please"
   */
  specialInstructions?: string;
  /**
   * Price of the item
   * @example 12.99
   */
  price: number;
}

export interface CreateOrderDto {
  /**
   * Customer ID
   * @example "6075c1a5a9f14a2c9c5df91a"
   */
  customer: string;
  /**
   * Business partner ID
   * @example "6075c1a5a9f14a2c9c5df91b"
   */
  businessPartner: string;
  /**
   * Array of order items
   * @example [{"mealId":"6075c1a5a9f14a2c9c5df91a","quantity":2,"specialInstructions":"Extra spicy","price":12.99}]
   */
  items: OrderItemDto[];
  /**
   * Total order amount
   * @example 25.98
   */
  totalAmount: number;
  /**
   * Delivery address
   * @example "123 Main St, New York, NY 10001"
   */
  deliveryAddress: string;
  /**
   * Delivery instructions
   * @example "Leave at the door"
   */
  deliveryInstructions?: string;
  /**
   * Scheduled delivery time
   * @example "2023-04-20T18:00:00Z"
   */
  scheduledDeliveryTime?: string;
}

export interface UpdateOrderDto {
  /**
   * Customer ID
   * @example "6075c1a5a9f14a2c9c5df91a"
   */
  customer?: string;
  /**
   * Business partner ID
   * @example "6075c1a5a9f14a2c9c5df91b"
   */
  businessPartner?: string;
  /**
   * Array of order items
   * @example [{"mealId":"6075c1a5a9f14a2c9c5df91a","quantity":2,"specialInstructions":"Extra spicy","price":12.99}]
   */
  items?: OrderItemDto[];
  /**
   * Total order amount
   * @example 25.98
   */
  totalAmount?: number;
  /**
   * Order status
   * @example "confirmed"
   */
  status?:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  /**
   * Delivery address
   * @example "123 Main St, New York, NY 10001"
   */
  deliveryAddress?: string;
  /**
   * Delivery instructions
   * @example "Leave at the door"
   */
  deliveryInstructions?: string;
  /**
   * Is the order paid
   * @example true
   */
  isPaid?: boolean;
  /**
   * Scheduled delivery time
   * @example "2023-04-20T18:00:00Z"
   */
  scheduledDeliveryTime?: string;
  /**
   * Actual delivery time
   * @example "2023-04-20T18:15:00Z"
   */
  actualDeliveryTime?: string;
}

export interface UpdateOrderStatusDto {
  /**
   * New order status
   * @example "confirmed"
   */
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
}

export interface MarkOrderPaidDto {
  /**
   * Payment transaction ID
   * @example "txn_123456789"
   */
  transactionId: string;
  /**
   * Payment amount
   * @example 25.98
   */
  amount: number;
  /**
   * Payment method used
   * @example "credit_card"
   */
  paymentMethod: string;
  /**
   * Payment date and time
   * @example "2023-04-20T18:00:00Z"
   */
  paidAt?: string;
}

export interface AddOrderReviewDto {
  /**
   * Rating (1-5)
   * @min 1
   * @max 5
   * @example 4.5
   */
  rating: number;
  /**
   * Review text
   * @example "Food was delicious and delivered on time. Will order again!"
   */
  review: string;
}

export interface CreatePaymentMethodDto {
  /** ID of the customer who owns this payment method */
  customerId: string;
  /** Type of payment method */
  type: "card" | "upi" | "netbanking" | "wallet";
  /** Token ID from payment gateway */
  tokenId: string;
  /** Whether this payment method is set as default */
  isDefault?: boolean;
  /** Last 4 digits of card number (for cards) */
  last4?: string;
  /** Network/brand of the card (Visa, Mastercard, etc.) */
  brand?: string;
  /** Expiry month (for cards) */
  expiryMonth?: number;
  /** Expiry year (for cards) */
  expiryYear?: number;
  /** Name on the card (for cards) */
  cardholderName?: string;
  /** UPI ID (for UPI payments) */
  upiId?: string;
  /** Bank account number (for netbanking) */
  accountNumber?: string;
  /** IFSC code (for netbanking) */
  ifsc?: string;
  /** Bank name (for netbanking) */
  bankName?: string;
  /** Wallet name (for wallet payments) */
  walletName?: string;
}

export interface UpdatePaymentMethodDto {
  /** Whether this payment method is set as default */
  isDefault?: boolean;
  /** Whether the payment method is still valid */
  isValid?: boolean;
}

export interface UpdateCustomerProfileDto {
  /**
   * First name
   * @example "John"
   */
  firstName?: string;
  /**
   * Last name
   * @example "Doe"
   */
  lastName?: string;
  /**
   * Phone number
   * @example "+1234567890"
   */
  phoneNumber?: string;
  /**
   * City
   * @example "New York"
   */
  city?: string;
  /**
   * College/University
   * @example "MIT"
   */
  college?: string;
  /**
   * Branch/Department
   * @example "Computer Science"
   */
  branch?: string;
  /**
   * Date of birth
   * @example "1995-05-15"
   */
  dob?: string;
}

export interface CreateDeliveryAddressDto {
  /**
   * Address line 1
   * @example "123 Main Street, Apt 4B"
   */
  addressLine1: string;
  /**
   * Address line 2
   * @example "Near Central Park"
   */
  addressLine2?: string;
  /**
   * City
   * @example "New York"
   */
  city: string;
  /**
   * State
   * @example "NY"
   */
  state: string;
  /**
   * Postal code
   * @example "10001"
   */
  postalCode: string;
  /**
   * Address label
   * @example "Home"
   */
  label: string;
  /**
   * Landmark or additional instructions
   * @example "Near Central Park"
   */
  landmark?: string;
  /**
   * Contact phone number for delivery
   * @example "+1234567890"
   */
  contactNumber?: string;
  /**
   * Whether this is the default address
   * @example false
   */
  isDefault?: boolean;
  /**
   * Additional delivery instructions
   * @example "Ring doorbell twice"
   */
  instructions?: string;
}

export type UpdateDeliveryAddressDto = object;

export interface HealthCheckDto {
  /**
   * Status of the server
   * @example "ok"
   */
  status: string;
  /**
   * Timestamp of the health check
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  timestamp: string;
  /**
   * Server uptime in seconds
   * @example 1234567
   */
  uptime: number;
  /**
   * Environment the server is running in
   * @example "production"
   */
  environment: string;
  /**
   * Health check message
   * @example "Server is healthy"
   */
  message: string;
}

export interface VersionDto {
  /**
   * Semantic version of the application
   * @example "1.2.3"
   */
  version: string;
  /**
   * Build number of the application
   * @example "20230603-1"
   */
  buildNumber: string;
  /**
   * Release date of this version
   * @format date-time
   * @example "2023-06-01T00:00:00.000Z"
   */
  releaseDate: string;
  /**
   * Environment the application is running in
   * @example "production"
   */
  environment: string;
  /**
   * API version
   * @example "v1"
   */
  apiVersion: string;
  /**
   * Git commit hash
   * @example "a1b2c3d"
   */
  commitHash: string;
  /**
   * Feature flags
   * @example {"payments":true,"referrals":true,"subscriptions":false}
   */
  features: object;
}

export interface CreateContactDto {
  /**
   * Full name of the contact
   * @example "John Doe"
   */
  name: string;
  /**
   * Email address
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * Phone number (optional)
   * @example "+919876543210"
   */
  phoneNumber?: string;
  /**
   * Subject of the inquiry (optional)
   * @example "Partnership Inquiry"
   */
  subject?: string;
  /**
   * Contact message/inquiry
   * @example "I'm interested in becoming a delivery partner for TiffinMate."
   */
  message: string;
  /**
   * Where the contact came from
   * @example "website"
   */
  source?: string;
}

export interface ContactResponseDto {
  /**
   * Unique identifier
   * @example "60d21b4667d0d8992e610c87"
   */
  id: string;
  /**
   * Full name of the contact
   * @example "John Doe"
   */
  name: string;
  /**
   * Email address
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * Phone number (optional)
   * @example "+919876543210"
   */
  phoneNumber: string;
  /**
   * Subject of the inquiry (optional)
   * @example "Partnership Inquiry"
   */
  subject: string;
  /**
   * Contact message/inquiry
   * @example "I'm interested in becoming a delivery partner for TiffinMate."
   */
  message: string;
  /**
   * Where the contact came from
   * @example "website"
   */
  source: string;
  /**
   * Status of the contact
   * @example "new"
   */
  status: string;
  /**
   * Whether the inquiry has been resolved
   * @example false
   */
  isResolved: boolean;
  /**
   * Timestamp of contact submission
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  createdAt: string;
  /**
   * Timestamp of last update
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  updatedAt: string;
}

export interface CreateSubscriberDto {
  /**
   * Email address
   * @example "subscriber@example.com"
   */
  email: string;
  /**
   * Full name (optional)
   * @example "Jane Smith"
   */
  name?: string;
  /**
   * Content preferences (optional)
   * @example ["promotions","new-partners"]
   */
  preferences?: string[];
  /**
   * Source of the subscription
   * @example "landing-page"
   */
  source?: string;
}

export interface SubscriberResponseDto {
  /**
   * Unique identifier
   * @example "60d21b4667d0d8992e610c88"
   */
  id: string;
  /**
   * Email address
   * @example "subscriber@example.com"
   */
  email: string;
  /**
   * Full name (optional)
   * @example "Jane Smith"
   */
  name: string;
  /**
   * Content preferences
   * @example ["promotions","new-partners"]
   */
  preferences: string[];
  /**
   * Whether the subscription is active
   * @example true
   */
  isActive: boolean;
  /**
   * Source of the subscription
   * @example "landing-page"
   */
  source: string;
  /**
   * Unsubscribe token
   * @example "9062e06b0aab3a0523a47d9b41dda64f910e2cb3cer4a200d97f858328a7b256"
   */
  unsubscribeToken: string;
  /**
   * Timestamp of subscription
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  createdAt: string;
  /**
   * Timestamp of last update
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  updatedAt: string;
}

export interface GetSubscribersResponseDto {
  /** List of subscribers */
  subscribers: SubscriberResponseDto[];
  /**
   * Total number of subscribers matching the filter
   * @example 120
   */
  total: number;
  /**
   * Current page number
   * @example 1
   */
  page: number;
  /**
   * Number of items per page
   * @example 10
   */
  limit: number;
}

export interface CreateReferralDto {
  /**
   * Email of the referrer (if not registered)
   * @example "existing@example.com"
   */
  referrerEmail: string;
  /**
   * Email of the person being referred
   * @example "friend@example.com"
   */
  referredEmail: string;
  /**
   * UTM source parameter
   * @example "email"
   */
  utmSource?: string;
  /**
   * UTM medium parameter
   * @example "referral"
   */
  utmMedium?: string;
  /**
   * UTM campaign parameter
   * @example "summer2023"
   */
  utmCampaign?: string;
  /**
   * UTM content parameter
   * @example "header_button"
   */
  utmContent?: string;
  /**
   * UTM term parameter
   * @example "food_delivery"
   */
  utmTerm?: string;
}

export interface ReferralResponseDto {
  /**
   * Unique identifier
   * @example "60d21b4667d0d8992e610c89"
   */
  id: string;
  /**
   * Referrer email
   * @example "existing@example.com"
   */
  referrerEmail: string;
  /**
   * User ID of the referrer (if registered)
   * @example "60d21b4667d0d8992e610c80"
   */
  referrer?: string;
  /**
   * Referred email
   * @example "friend@example.com"
   */
  referredEmail: string;
  /**
   * User ID of the referred person (once registered)
   * @example null
   */
  referredUser?: string;
  /**
   * Unique referral code
   * @example "REF123456"
   */
  code: string;
  /**
   * Status of the referral
   * @example "pending"
   */
  status: "pending" | "converted" | "expired";
  /**
   * When the referral was converted
   * @format date-time
   * @example null
   */
  conversionDate?: string;
  /**
   * Rewards information
   * @example {"referrerReward":"₹100 off next order","referredReward":"₹100 off first order","referrerRewardClaimed":false,"referredRewardClaimed":false}
   */
  rewards: object;
  /**
   * UTM source parameter
   * @example "email"
   */
  utmSource?: string;
  /**
   * UTM medium parameter
   * @example "referral"
   */
  utmMedium?: string;
  /**
   * UTM campaign parameter
   * @example "summer2023"
   */
  utmCampaign?: string;
  /**
   * UTM content parameter
   * @example null
   */
  utmContent?: string;
  /**
   * UTM term parameter
   * @example null
   */
  utmTerm?: string;
  /**
   * Timestamp of referral creation
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  createdAt: string;
  /**
   * Expiration date of the referral
   * @format date-time
   * @example "2023-07-03T10:15:30.000Z"
   */
  expiresAt: string;
  /**
   * Timestamp of last update
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  updatedAt: string;
}

export interface CreateTestimonialDto {
  /**
   * Full name of the person providing testimonial
   * @example "Jane Smith"
   */
  name: string;
  /**
   * Email of the person providing testimonial
   * @example "jane.smith@example.com"
   */
  email: string;
  /**
   * Profession or title of the person
   * @example "Software Engineer"
   */
  profession?: string;
  /**
   * Rating given (1-5)
   * @min 1
   * @max 5
   * @example 5
   */
  rating: number;
  /**
   * Testimonial content
   * @example "The service was excellent! The food was fresh and delicious. Will definitely order again."
   */
  testimonial: string;
  /**
   * URL to user's profile/avatar image
   * @example "https://example.com/images/profile.jpg"
   */
  imageUrl?: string;
}

export interface TestimonialResponseDto {
  /**
   * Unique identifier
   * @example "60d21b4667d0d8992e610c85"
   */
  id: string;
  /**
   * Full name of the person providing testimonial
   * @example "Jane Smith"
   */
  name: string;
  /**
   * Email of the person providing testimonial
   * @example "jane.smith@example.com"
   */
  email: string;
  /**
   * Profession or title of the person
   * @example "Software Engineer"
   */
  profession?: string;
  /**
   * Rating given (1-5)
   * @example 5
   */
  rating: number;
  /**
   * Testimonial content
   * @example "The service was excellent! The food was fresh and delicious. Will definitely order again."
   */
  testimonial: string;
  /**
   * URL to user's profile/avatar image
   * @example "https://example.com/images/profile.jpg"
   */
  imageUrl?: string;
  /**
   * Whether the testimonial is approved and visible
   * @example false
   */
  isApproved: boolean;
  /**
   * Whether the testimonial is featured
   * @example false
   */
  isFeatured: boolean;
  /**
   * Timestamp of submission
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  createdAt: string;
  /**
   * Timestamp of last update
   * @format date-time
   * @example "2023-06-03T10:15:30.000Z"
   */
  updatedAt: string;
}

export interface GetTestimonialsResponseDto {
  items: TestimonialResponseDto[];
  /** Total number of testimonials */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  pages: number;
}

export interface CreateCorporateQuoteDto {
  /**
   * Company name
   * @example "Acme Corporation"
   */
  companyName: string;
  /**
   * Contact person full name
   * @example "John Doe"
   */
  contactPerson: string;
  /**
   * Contact email address
   * @example "john.doe@acme.com"
   */
  email: string;
  /**
   * Contact phone number
   * @example "+91 9876543210"
   */
  phone: string;
  /**
   * Number of employees
   * @example "21-50"
   */
  employeeCount: string;
  /**
   * Additional requirements
   * @example "We need vegetarian options for 30% of our employees"
   */
  requirements?: string;
}

export interface CreateTicketDto {
  subject: string;
  message: string;
  category: string;
}

export interface TicketDto {
  /**
   * The unique identifier for the ticket.
   * @example "1678886400000"
   */
  id: string;
  /**
   * The ID of the user who created the ticket.
   * @example "user-123"
   */
  userId: string;
  /**
   * The subject of the support ticket.
   * @example "Login Issue"
   */
  subject: string;
  /**
   * The detailed message of the support ticket.
   * @example "I am unable to log in to my account."
   */
  message: string;
  /**
   * The category of the support ticket.
   * @example "Technical Support"
   */
  category: string;
  /**
   * The date and time when the ticket was created.
   * @format date-time
   * @example "2023-03-15T12:00:00.000Z"
   */
  createdAt: string;
}

export interface SeederPhaseResultDto {
  /** Phase name */
  phase: string;
  /** Whether phase completed successfully */
  success: boolean;
  /** Collections that were seeded */
  collectionsSeeded: string[];
  /** Record counts per collection */
  recordCounts: object;
  /** Phase execution duration in milliseconds */
  duration: number;
  /** Errors encountered during phase */
  errors?: string[];
}

export interface ValidationResultDto {
  /** Whether data validation passed */
  isValid: boolean;
  /** Validation errors found */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

export interface SeederSummaryDto {
  /** Whether seeding completed successfully */
  success: boolean;
  /** Total seeding duration in milliseconds */
  totalDuration: number;
  /** Number of phases completed successfully */
  phasesCompleted: number;
  /** Total records created across all collections */
  totalRecords: number;
  /** Results from each phase */
  phaseResults: SeederPhaseResultDto[];
  /** All errors encountered */
  errors: string[];
  /** Data validation results */
  validation: ValidationResultDto;
}

export interface SeederStatusDto {
  /** Whether seeding is currently running */
  isRunning: boolean;
  /** Current phase being executed */
  currentPhase?: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Total number of phases to execute */
  totalPhases: number;
  /** List of completed phases */
  completedPhases: string[];
  /** List of errors encountered */
  errors: string[];
  /**
   * Seeding start time
   * @format date-time
   */
  startTime?: string;
  /** Estimated completion time */
  estimatedCompletion?: string;
}

export type CreateConversationDto = object;

export type Conversation = object;

export type SendMessageDto = object;

export type ChatMessage = object;

export type UpdateMessageStatusDto = object;

export type TypingIndicator = object;

export interface CreateReviewDto {
  /**
   * Rating from 1 to 5
   * @min 1
   * @max 5
   * @example 5
   */
  rating: number;
  /**
   * Review comment
   * @example "Great food and excellent service!"
   */
  comment?: string;
  /**
   * Review images
   * @example ["https://example.com/image1.jpg"]
   */
  images?: string[];
  /**
   * Restaurant ID for restaurant review
   * @example "68ed2bfb0b872d5d24f1c19c"
   */
  restaurantId?: string;
  /**
   * Menu item ID for menu item review
   * @example "68ed2fba92f2b5b4b9f5e252"
   */
  menuItemId?: string;
}

export namespace Api {
  /**
   * No description
   * @tags auth
   * @name AuthControllerRegister
   * @summary Register a new user
   * @request POST:/api/auth/register
   * @response `201` `void` User has been registered
   * @response `400` `void` Bad request
   * @response `409` `void` Email already exists
   */
  export namespace AuthControllerRegister {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerRegisterPartner
   * @summary Register a new partner (business user)
   * @request POST:/api/auth/register-partner
   * @response `201` `void` Partner has been registered
   * @response `400` `void` Bad request
   * @response `409` `void` Email already exists
   */
  export namespace AuthControllerRegisterPartner {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterPartnerDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerRegisterSuperAdmin
   * @summary Register a super admin user (development only)
   * @request POST:/api/auth/super-admin/register
   * @response `201` `void` Super admin has been registered
   * @response `400` `void` Bad request
   * @response `409` `void` Email already exists
   */
  export namespace AuthControllerRegisterSuperAdmin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerLogin
   * @summary User login
   * @request POST:/api/auth/login
   * @response `200` `void` User login successful
   * @response `401` `void` Unauthorized
   */
  export namespace AuthControllerLogin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerChangePassword
   * @summary Change user password
   * @request POST:/api/auth/change-password
   * @secure
   * @response `200` `void` Password changed successfully
   * @response `401` `void` Unauthorized
   */
  export namespace AuthControllerChangePassword {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangePasswordDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerRefresh
   * @summary Refresh JWT token
   * @request POST:/api/auth/refresh-token
   * @response `200` `void` Token refreshed successfully
   */
  export namespace AuthControllerRefresh {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RefreshTokenDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerLogout
   * @summary User logout
   * @request POST:/api/auth/logout
   * @secure
   * @response `200` `void` User logged out successfully
   * @response `401` `void` Unauthorized
   */
  export namespace AuthControllerLogout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerForgotPassword
   * @summary Request password reset
   * @request POST:/api/auth/forgot-password
   * @response `200` `void` Password reset email sent
   * @response `400` `void` Bad request
   * @response `404` `void` User not found
   */
  export namespace AuthControllerForgotPassword {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags auth
   * @name AuthControllerResetPassword
   * @summary Reset password with token
   * @request POST:/api/auth/reset-password
   * @response `200` `void` Password reset successfully
   * @response `400` `void` Bad request or invalid token
   */
  export namespace AuthControllerResetPassword {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags users
   * @name UserControllerCreate
   * @summary Create a new user
   * @request POST:/api/users
   * @secure
   * @response `201` `void` User has been created
   * @response `400` `void` Bad request
   * @response `409` `void` Email already exists
   */
  export namespace UserControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateUserDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags users
   * @name UserControllerFindAll
   * @summary Get all users
   * @request GET:/api/users
   * @secure
   * @response `200` `void` Return all users
   */
  export namespace UserControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags users
   * @name UserControllerFindOne
   * @summary Get a user by ID
   * @request GET:/api/users/{id}
   * @secure
   * @response `200` `void` Return the user
   * @response `404` `void` User not found
   */
  export namespace UserControllerFindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags users
   * @name UserControllerUpdate
   * @summary Update a user
   * @request PATCH:/api/users/{id}
   * @secure
   * @response `200` `void` User has been updated
   * @response `404` `void` User not found
   */
  export namespace UserControllerUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateUserDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags users
   * @name UserControllerRemove
   * @summary Delete a user
   * @request DELETE:/api/users/{id}
   * @secure
   * @response `200` `void` User has been deleted
   * @response `404` `void` User not found
   */
  export namespace UserControllerRemove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags users
   * @name UserControllerGetProfile
   * @summary Get current user's profile
   * @request GET:/api/users/profile
   * @secure
   * @response `200` `void` Return current user
   */
  export namespace UserControllerGetProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags users
   * @name UserControllerUpdateProfile
   * @summary Update current user's profile
   * @request PATCH:/api/users/profile
   * @secure
   * @response `200` `void` User has been updated
   */
  export namespace UserControllerUpdateProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateUserDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerCreate
   * @summary Create a new subscription
   * @request POST:/api/subscriptions
   * @secure
   * @response `201` `void` The subscription has been created successfully.
   * @response `400` `void` Bad Request.
   * @response `401` `void` Unauthorized.
   */
  export namespace SubscriptionControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateSubscriptionDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerFindAll
   * @summary Get all subscriptions
   * @request GET:/api/subscriptions
   * @secure
   * @response `200` `void` Return all subscriptions.
   * @response `401` `void` Unauthorized.
   */
  export namespace SubscriptionControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerGetCurrentSubscription
   * @summary Get current active subscription for authenticated user
   * @request GET:/api/subscriptions/me/current
   * @secure
   * @response `200` `void` Return current active subscription.
   * @response `401` `void` Unauthorized.
   * @response `404` `void` No active subscription found.
   */
  export namespace SubscriptionControllerGetCurrentSubscription {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerGetAllUserSubscriptions
   * @summary Get all subscriptions for authenticated user
   * @request GET:/api/subscriptions/me/all
   * @secure
   * @response `200` `void` Return all user subscriptions.
   * @response `401` `void` Unauthorized.
   */
  export namespace SubscriptionControllerGetAllUserSubscriptions {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerFindByCustomer
   * @summary Get all subscriptions for a customer
   * @request GET:/api/subscriptions/customer/{customerId}
   * @secure
   * @response `200` `void` Return all customer subscriptions.
   * @response `401` `void` Unauthorized.
   */
  export namespace SubscriptionControllerFindByCustomer {
    export type RequestParams = {
      /** Customer ID */
      customerId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerFindOne
   * @summary Get a specific subscription by ID
   * @request GET:/api/subscriptions/{id}
   * @secure
   * @response `200` `void` Return the subscription.
   * @response `401` `void` Unauthorized.
   * @response `404` `void` Subscription not found.
   */
  export namespace SubscriptionControllerFindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerUpdate
   * @summary Update a subscription
   * @request PATCH:/api/subscriptions/{id}
   * @secure
   * @response `200` `void` The subscription has been updated successfully.
   * @response `400` `void` Bad Request.
   * @response `401` `void` Unauthorized.
   * @response `404` `void` Subscription not found.
   */
  export namespace SubscriptionControllerUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateSubscriptionDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerRemove
   * @summary Delete a subscription
   * @request DELETE:/api/subscriptions/{id}
   * @secure
   * @response `200` `void` The subscription has been deleted successfully.
   * @response `401` `void` Unauthorized.
   * @response `404` `void` Subscription not found.
   */
  export namespace SubscriptionControllerRemove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerCancelSubscription
   * @summary Cancel a subscription
   * @request PATCH:/api/subscriptions/{id}/cancel
   * @secure
   * @response `200` `void` The subscription has been cancelled successfully.
   * @response `400` `void` Bad Request.
   * @response `401` `void` Unauthorized.
   * @response `404` `void` Subscription not found.
   */
  export namespace SubscriptionControllerCancelSubscription {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {
      /** Reason for cancellation */
      reason: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerPauseSubscription
   * @summary Pause a subscription
   * @request PATCH:/api/subscriptions/{id}/pause
   * @secure
   * @response `200` `void` The subscription has been paused successfully.
   * @response `400` `void` Bad Request.
   * @response `401` `void` Unauthorized.
   * @response `404` `void` Subscription not found.
   */
  export namespace SubscriptionControllerPauseSubscription {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Subscriptions
   * @name SubscriptionControllerResumeSubscription
   * @summary Resume a paused subscription
   * @request PATCH:/api/subscriptions/{id}/resume
   * @secure
   * @response `200` `void` The subscription has been resumed successfully.
   * @response `400` `void` Bad Request.
   * @response `401` `void` Unauthorized.
   * @response `404` `void` Subscription not found.
   */
  export namespace SubscriptionControllerResumeSubscription {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags subscription-plans
   * @name SubscriptionPlanControllerCreate
   * @summary Create a new subscription plan
   * @request POST:/api/subscription-plans
   * @secure
   * @response `201` `void` Subscription plan created successfully
   * @response `400` `void` Bad request
   */
  export namespace SubscriptionPlanControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateSubscriptionPlanDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags subscription-plans
   * @name SubscriptionPlanControllerFindAll
   * @summary Get all subscription plans
   * @request GET:/api/subscription-plans
   * @response `200` `void` Return all subscription plans
   */
  export namespace SubscriptionPlanControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags subscription-plans
   * @name SubscriptionPlanControllerFindActive
   * @summary Get all active subscription plans
   * @request GET:/api/subscription-plans/active
   * @response `200` `void` Return active subscription plans
   */
  export namespace SubscriptionPlanControllerFindActive {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags subscription-plans
   * @name SubscriptionPlanControllerFindOne
   * @summary Get a specific subscription plan by ID
   * @request GET:/api/subscription-plans/{id}
   * @response `200` `void` Return the subscription plan
   * @response `404` `void` Subscription plan not found
   */
  export namespace SubscriptionPlanControllerFindOne {
    export type RequestParams = {
      /** Subscription plan ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags subscription-plans
   * @name SubscriptionPlanControllerUpdate
   * @summary Update a subscription plan
   * @request PATCH:/api/subscription-plans/{id}
   * @secure
   * @response `200` `void` Subscription plan updated successfully
   * @response `404` `void` Subscription plan not found
   */
  export namespace SubscriptionPlanControllerUpdate {
    export type RequestParams = {
      /** Subscription plan ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateSubscriptionPlanDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags subscription-plans
   * @name SubscriptionPlanControllerRemove
   * @summary Delete a subscription plan
   * @request DELETE:/api/subscription-plans/{id}
   * @secure
   * @response `200` `void` Subscription plan deleted successfully
   * @response `404` `void` Subscription plan not found
   */
  export namespace SubscriptionPlanControllerRemove {
    export type RequestParams = {
      /** Subscription plan ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @name CustomerProfileControllerFindByUserId
   * @request GET:/api/customer-profile/{userId}
   * @response `200` `void`
   */
  export namespace CustomerProfileControllerFindByUserId {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @name CustomerProfileControllerUpdate
   * @request PUT:/api/customer-profile/{userId}
   * @response `200` `void`
   */
  export namespace CustomerProfileControllerUpdate {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @name CustomerProfileControllerDelete
   * @request DELETE:/api/customer-profile/{userId}
   * @response `200` `void`
   */
  export namespace CustomerProfileControllerDelete {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @name CustomerProfileControllerCreate
   * @request POST:/api/customer-profile
   * @response `201` `void`
   */
  export namespace CustomerProfileControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerGetTodayMeals
   * @summary Get today's meals for the authenticated user
   * @request GET:/api/meals/today
   * @secure
   * @response `200` `void` Return today's meals
   * @response `401` `void` Unauthorized
   */
  export namespace MealControllerGetTodayMeals {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerGetMealHistory
   * @summary Get meal history for the authenticated user
   * @request GET:/api/meals/me/history
   * @secure
   * @response `200` `void` Return meal history
   * @response `401` `void` Unauthorized
   */
  export namespace MealControllerGetMealHistory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerGetUpcomingMeals
   * @summary Get upcoming meals for the authenticated user
   * @request GET:/api/meals/upcoming
   * @secure
   * @response `200` `void` Return upcoming meals
   * @response `401` `void` Unauthorized
   */
  export namespace MealControllerGetUpcomingMeals {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerGetMealById
   * @summary Get a specific meal by ID
   * @request GET:/api/meals/{id}
   * @secure
   * @response `200` `void` Return the meal
   * @response `404` `void` Meal not found
   */
  export namespace MealControllerGetMealById {
    export type RequestParams = {
      /** Meal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerUpdateMealStatus
   * @summary Update meal status
   * @request PATCH:/api/meals/{id}/status
   * @secure
   * @response `200` `void` Meal status updated successfully
   * @response `404` `void` Meal not found
   */
  export namespace MealControllerUpdateMealStatus {
    export type RequestParams = {
      /** Meal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateMealStatusDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerSkipMeal
   * @summary Skip a meal
   * @request PATCH:/api/meals/{id}/skip
   * @secure
   * @response `200` `void` Meal skipped successfully
   * @response `404` `void` Meal not found
   */
  export namespace MealControllerSkipMeal {
    export type RequestParams = {
      /** Meal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = SkipMealDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerRateMeal
   * @summary Rate a meal
   * @request POST:/api/meals/{id}/rate
   * @secure
   * @response `201` `void` Meal rated successfully
   * @response `404` `void` Meal not found
   */
  export namespace MealControllerRateMeal {
    export type RequestParams = {
      /** Meal ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = RateMealDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags meals
   * @name MealControllerCreateMeal
   * @summary Create a new meal
   * @request POST:/api/meals
   * @secure
   * @response `201` `void` Meal created successfully
   * @response `400` `void` Bad request
   */
  export namespace MealControllerCreateMeal {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMealDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerCreate
   * @summary Create a new partner
   * @request POST:/api/partners
   * @secure
   * @response `201` `void` Partner created successfully
   * @response `400` `void` Bad request
   */
  export namespace PartnerControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePartnerDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerFindAll
   * @summary Get all partners/restaurants
   * @request GET:/api/partners
   * @response `200` `void` Return all partners
   */
  export namespace PartnerControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Filter by cuisine type */
      cuisineType?: string;
      /** Filter by minimum rating */
      rating?: number;
      /** Filter by city */
      city?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerFindOne
   * @summary Get a specific partner by ID
   * @request GET:/api/partners/{id}
   * @response `200` `void` Return the partner
   * @response `404` `void` Partner not found
   */
  export namespace PartnerControllerFindOne {
    export type RequestParams = {
      /** Partner ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerUpdate
   * @summary Update a partner
   * @request PATCH:/api/partners/{id}
   * @secure
   * @response `200` `void` Partner updated successfully
   * @response `404` `void` Partner not found
   */
  export namespace PartnerControllerUpdate {
    export type RequestParams = {
      /** Partner ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdatePartnerDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerRemove
   * @summary Delete a partner
   * @request DELETE:/api/partners/{id}
   * @secure
   * @response `200` `void` Partner deleted successfully
   * @response `404` `void` Partner not found
   */
  export namespace PartnerControllerRemove {
    export type RequestParams = {
      /** Partner ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerGetMenu
   * @summary Get menu for a specific partner
   * @request GET:/api/partners/{id}/menu
   * @response `200` `void` Return partner menu
   * @response `404` `void` Partner not found
   */
  export namespace PartnerControllerGetMenu {
    export type RequestParams = {
      /** Partner ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerGetReviews
   * @summary Get reviews for a specific partner
   * @request GET:/api/partners/{id}/reviews
   * @response `200` `void` Return partner reviews
   * @response `404` `void` Partner not found
   */
  export namespace PartnerControllerGetReviews {
    export type RequestParams = {
      /** Partner ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags partners
   * @name PartnerControllerGetStats
   * @summary Get statistics for a specific partner
   * @request GET:/api/partners/{id}/stats
   * @response `200` `void` Return partner statistics
   * @response `404` `void` Partner not found
   */
  export namespace PartnerControllerGetStats {
    export type RequestParams = {
      /** Partner ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerFindAllCategories
   * @summary Get all categories
   * @request GET:/api/menu/categories
   * @secure
   * @response `200` `void` Return all categories
   */
  export namespace MenuControllerFindAllCategories {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerCreateCategory
   * @summary Create a new category
   * @request POST:/api/menu/categories
   * @secure
   * @response `201` `void` Category created successfully
   * @response `400` `void` Invalid input
   */
  export namespace MenuControllerCreateCategory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateCategoryDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerFindCategoryById
   * @summary Get category by ID
   * @request GET:/api/menu/categories/{id}
   * @secure
   * @response `200` `void` Return the category
   * @response `404` `void` Category not found
   */
  export namespace MenuControllerFindCategoryById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerUpdateCategory
   * @summary Update a category
   * @request PATCH:/api/menu/categories/{id}
   * @secure
   * @response `200` `void` Category updated successfully
   * @response `400` `void` Invalid input
   * @response `404` `void` Category not found
   */
  export namespace MenuControllerUpdateCategory {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateCategoryDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerDeleteCategory
   * @summary Delete a category
   * @request DELETE:/api/menu/categories/{id}
   * @secure
   * @response `200` `void` Category deleted successfully
   * @response `404` `void` Category not found
   */
  export namespace MenuControllerDeleteCategory {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerFindMenuItemsByPartner
   * @summary Get menu items by partner
   * @request GET:/api/menu/partner/{partnerId}
   * @secure
   * @response `200` `void` Return partner menu items
   */
  export namespace MenuControllerFindMenuItemsByPartner {
    export type RequestParams = {
      partnerId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerFindAllMenuItems
   * @summary Get all menu items
   * @request GET:/api/menu
   * @secure
   * @response `200` `void` Return all menu items
   */
  export namespace MenuControllerFindAllMenuItems {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerCreateMenuItem
   * @summary Create a new menu item
   * @request POST:/api/menu
   * @secure
   * @response `201` `void` Menu item created successfully
   * @response `400` `void` Invalid input
   */
  export namespace MenuControllerCreateMenuItem {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMenuItemDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerGetMenuItemDetails
   * @summary Get menu item details with reviews
   * @request GET:/api/menu/item/{itemId}
   * @response `200` `void` Return menu item details
   * @response `404` `void` Menu item not found
   */
  export namespace MenuControllerGetMenuItemDetails {
    export type RequestParams = {
      itemId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerGetRestaurantMenus
   * @summary Get all menus for a restaurant
   * @request GET:/api/menu/restaurant/{restaurantId}/menus
   * @response `200` `void` Return restaurant menus
   */
  export namespace MenuControllerGetRestaurantMenus {
    export type RequestParams = {
      restaurantId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerFindMenuItemById
   * @summary Get menu item by ID
   * @request GET:/api/menu/{id}
   * @secure
   * @response `200` `void` Return the menu item
   * @response `404` `void` Menu item not found
   */
  export namespace MenuControllerFindMenuItemById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerUpdateMenuItem
   * @summary Update a menu item
   * @request PATCH:/api/menu/{id}
   * @secure
   * @response `200` `void` Menu item updated successfully
   * @response `400` `void` Invalid input
   * @response `404` `void` Menu item not found
   */
  export namespace MenuControllerUpdateMenuItem {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateMenuItemDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags menu
   * @name MenuControllerDeleteMenuItem
   * @summary Delete a menu item
   * @request DELETE:/api/menu/{id}
   * @secure
   * @response `200` `void` Menu item deleted successfully
   * @response `404` `void` Menu item not found
   */
  export namespace MenuControllerDeleteMenuItem {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags feedback
   * @name FeedbackControllerSubmitFeedback
   * @summary Submit feedback or report
   * @request POST:/api/feedback
   * @response `201` `FeedbackResponseDto` Feedback submitted successfully
   * @response `400` `void` Invalid data format or missing required fields
   * @response `429` `void` Too many requests (rate limiting)
   */
  export namespace FeedbackControllerSubmitFeedback {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateFeedbackDto;
    export type RequestHeaders = {};
    export type ResponseBody = FeedbackResponseDto;
  }

  /**
   * No description
   * @tags feedback
   * @name FeedbackControllerGetFeedback
   * @summary View customer feedback (admin)
   * @request GET:/api/admin/feedback
   * @secure
   * @response `200` `void` List of feedback returned successfully
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   */
  export namespace FeedbackControllerGetFeedback {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerCreate
   * @summary Create a new order
   * @request POST:/api/orders
   * @secure
   * @response `201` `void` Order has been created
   * @response `400` `void` Bad request
   */
  export namespace OrderControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateOrderDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerFindAll
   * @summary Get all orders
   * @request GET:/api/orders
   * @secure
   * @response `200` `void` Return all orders
   */
  export namespace OrderControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerGetMyOrders
   * @summary Get orders for current authenticated customer
   * @request GET:/api/orders/me
   * @secure
   * @response `200` `void` Return customer orders
   */
  export namespace OrderControllerGetMyOrders {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerFindByStatus
   * @summary Get orders by status
   * @request GET:/api/orders/status/{status}
   * @secure
   * @response `200` `void` Return orders by status
   */
  export namespace OrderControllerFindByStatus {
    export type RequestParams = {
      status: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerFindByCustomer
   * @summary Get orders by customer
   * @request GET:/api/orders/customer/{customerId}
   * @secure
   * @response `200` `void` Return customer orders
   */
  export namespace OrderControllerFindByCustomer {
    export type RequestParams = {
      customerId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerFindByPartner
   * @summary Get orders by business partner
   * @request GET:/api/orders/partner/{partnerId}
   * @secure
   * @response `200` `void` Return partner orders
   */
  export namespace OrderControllerFindByPartner {
    export type RequestParams = {
      partnerId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerFindOne
   * @summary Get order by ID
   * @request GET:/api/orders/{id}
   * @secure
   * @response `200` `void` Return the order
   * @response `404` `void` Order not found
   */
  export namespace OrderControllerFindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerUpdate
   * @summary Update an order
   * @request PATCH:/api/orders/{id}
   * @secure
   * @response `200` `void` Order has been updated
   * @response `400` `void` Bad request
   * @response `404` `void` Order not found
   */
  export namespace OrderControllerUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateOrderDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerRemove
   * @summary Delete an order
   * @request DELETE:/api/orders/{id}
   * @secure
   * @response `204` `void` Order has been deleted
   * @response `400` `void` Bad request
   * @response `404` `void` Order not found
   */
  export namespace OrderControllerRemove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerUpdateStatus
   * @summary Update order status
   * @request PATCH:/api/orders/{id}/status
   * @secure
   * @response `200` `void` Order status has been updated
   * @response `400` `void` Bad request
   * @response `404` `void` Order not found
   */
  export namespace OrderControllerUpdateStatus {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateOrderStatusDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerMarkAsPaid
   * @summary Mark order as paid
   * @request PATCH:/api/orders/{id}/paid
   * @secure
   * @response `200` `void` Order has been marked as paid
   * @response `400` `void` Bad request
   * @response `404` `void` Order not found
   * @response `409` `void` Order is already paid
   */
  export namespace OrderControllerMarkAsPaid {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = MarkOrderPaidDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags orders
   * @name OrderControllerAddReview
   * @summary Add review to an order
   * @request PATCH:/api/orders/{id}/review
   * @secure
   * @response `200` `void` Review has been added
   * @response `400` `void` Bad request
   * @response `404` `void` Order not found
   * @response `409` `void` Order already has a review
   */
  export namespace OrderControllerAddReview {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AddOrderReviewDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetDashboardStats
   * @request GET:/api/admin/dashboard/stats
   * @response `200` `void`
   */
  export namespace AdminControllerGetDashboardStats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetRecentActivities
   * @request GET:/api/admin/dashboard/activities
   * @response `200` `void`
   */
  export namespace AdminControllerGetRecentActivities {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetAllOrders
   * @summary Get all orders with filters (admin only)
   * @request GET:/api/admin/orders
   * @response `200` `void` Orders returned
   */
  export namespace AdminControllerGetAllOrders {
    export type RequestParams = {};
    export type RequestQuery = {
      status?: string;
      search?: string;
      limit?: number;
      page?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetAllPartners
   * @summary Get all partners with filters (admin only)
   * @request GET:/api/admin/partners
   * @response `200` `void` Partners returned
   */
  export namespace AdminControllerGetAllPartners {
    export type RequestParams = {};
    export type RequestQuery = {
      status?: string;
      search?: string;
      limit?: number;
      page?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetAllCustomers
   * @summary Get all customers with filters (admin only)
   * @request GET:/api/admin/customers
   * @response `200` `void` Customers returned
   */
  export namespace AdminControllerGetAllCustomers {
    export type RequestParams = {};
    export type RequestQuery = {
      status?: string;
      search?: string;
      limit?: number;
      page?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetAllSubscriptions
   * @summary Get all subscriptions with filters (admin only)
   * @request GET:/api/admin/subscriptions
   * @response `200` `void` Subscriptions returned
   */
  export namespace AdminControllerGetAllSubscriptions {
    export type RequestParams = {};
    export type RequestQuery = {
      status?: string;
      limit?: number;
      page?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetRevenueData
   * @summary Get revenue data with filters (admin only)
   * @request GET:/api/admin/revenue
   * @response `200` `void` Revenue data returned
   */
  export namespace AdminControllerGetRevenueData {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetAllSupportTickets
   * @summary Get all support tickets (admin only)
   * @request GET:/api/admin/support/tickets
   * @response `200` `void` Support tickets returned
   */
  export namespace AdminControllerGetAllSupportTickets {
    export type RequestParams = {};
    export type RequestQuery = {
      status?: string;
      priority?: string;
      limit?: number;
      page?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerUpdateSupportTicket
   * @summary Update support ticket status
   * @request PUT:/api/admin/support/tickets/{id}
   * @response `200` `void` Support ticket updated
   */
  export namespace AdminControllerUpdateSupportTicket {
    export type RequestParams = {
      /** Ticket ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags Admin
   * @name AdminControllerGetRevenueHistory
   * @summary Get revenue history for analytics
   * @request GET:/api/admin/analytics/revenue-history
   * @response `200` `void` Revenue history returned
   */
  export namespace AdminControllerGetRevenueHistory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags payment
   * @name PaymentControllerCreatePaymentMethod
   * @summary Create a new payment method
   * @request POST:/api/payment/methods
   * @secure
   * @response `201` `void` The payment method has been successfully created.
   * @response `400` `void` Invalid input.
   */
  export namespace PaymentControllerCreatePaymentMethod {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePaymentMethodDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags payment
   * @name PaymentControllerGetCustomerPaymentMethods
   * @summary Get all payment methods for a customer
   * @request GET:/api/payment/methods/customer/{customerId}
   * @secure
   * @response `200` `void` Returns all payment methods for the specified customer.
   */
  export namespace PaymentControllerGetCustomerPaymentMethods {
    export type RequestParams = {
      customerId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags payment
   * @name PaymentControllerGetPaymentMethodById
   * @summary Get a payment method by ID
   * @request GET:/api/payment/methods/{id}
   * @secure
   * @response `200` `void` Returns the payment method.
   * @response `404` `void` Payment method not found.
   */
  export namespace PaymentControllerGetPaymentMethodById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags payment
   * @name PaymentControllerUpdatePaymentMethod
   * @summary Update a payment method
   * @request PATCH:/api/payment/methods/{id}
   * @secure
   * @response `200` `void` The payment method has been successfully updated.
   * @response `404` `void` Payment method not found.
   */
  export namespace PaymentControllerUpdatePaymentMethod {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdatePaymentMethodDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags payment
   * @name PaymentControllerDeletePaymentMethod
   * @summary Delete a payment method
   * @request DELETE:/api/payment/methods/{id}
   * @secure
   * @response `200` `void` The payment method has been successfully deleted.
   * @response `404` `void` Payment method not found.
   */
  export namespace PaymentControllerDeletePaymentMethod {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags payment
   * @name PaymentControllerSetDefaultPaymentMethod
   * @summary Set a payment method as default
   * @request PATCH:/api/payment/methods/{id}/set-default
   * @secure
   * @response `200` `void` The payment method has been set as default.
   * @response `404` `void` Payment method not found.
   */
  export namespace PaymentControllerSetDefaultPaymentMethod {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags payment-webhooks
   * @name WebhookControllerHandleRazorpayWebhook
   * @summary Handle Razorpay webhook events
   * @request POST:/api/webhook/razorpay
   * @response `200` `void` Webhook processed successfully
   * @response `400` `void` Invalid webhook event
   */
  export namespace WebhookControllerHandleRazorpayWebhook {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      "x-razorpay-signature": string;
    };
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerRegisterDevice
   * @summary Register device for push notifications
   * @request POST:/api/notifications/register-device
   * @secure
   * @response `201` `void` Device registered successfully
   */
  export namespace NotificationsControllerRegisterDevice {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerUnregisterDevice
   * @summary Unregister device from push notifications
   * @request DELETE:/api/notifications/unregister-device
   * @secure
   * @response `200` `void` Device unregistered successfully
   */
  export namespace NotificationsControllerUnregisterDevice {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerUpdateDevice
   * @summary Update device user association
   * @request PUT:/api/notifications/update-device
   * @secure
   * @response `200` `void` Device updated successfully
   */
  export namespace NotificationsControllerUpdateDevice {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerSendNotification
   * @summary Send notification
   * @request POST:/api/notifications/send
   * @secure
   * @response `201` `void` Notification sent successfully
   */
  export namespace NotificationsControllerSendNotification {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerSendOrderUpdate
   * @summary Send order status update notification
   * @request POST:/api/notifications/send-order-update
   * @secure
   * @response `201` `void` Order notification sent successfully
   */
  export namespace NotificationsControllerSendOrderUpdate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerSendNewOrderNotification
   * @summary Notify partner of new order
   * @request POST:/api/notifications/send-new-order
   * @secure
   * @response `201` `void` New order notification sent successfully
   */
  export namespace NotificationsControllerSendNewOrderNotification {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerSendMessageNotification
   * @summary Send chat message notification
   * @request POST:/api/notifications/send-message
   * @secure
   * @response `201` `void` Message notification sent successfully
   */
  export namespace NotificationsControllerSendMessageNotification {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerGetNotificationHistory
   * @summary Get notification history
   * @request GET:/api/notifications/history
   * @secure
   * @response `200` `void` Notification history retrieved successfully
   */
  export namespace NotificationsControllerGetNotificationHistory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerGetPendingNotifications
   * @summary Get pending notifications
   * @request GET:/api/notifications/pending
   * @secure
   * @response `200` `void` Pending notifications retrieved successfully
   */
  export namespace NotificationsControllerGetPendingNotifications {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerMarkAsRead
   * @summary Mark notification as read
   * @request PUT:/api/notifications/{id}/read
   * @secure
   * @response `200` `void` Notification marked as read
   */
  export namespace NotificationsControllerMarkAsRead {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerNotifyOrderReady
   * @summary Notify student that order is ready
   * @request POST:/api/notifications/partner/order-ready
   * @secure
   * @response `201` `void` Order ready notification sent
   */
  export namespace NotificationsControllerNotifyOrderReady {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerNotifyOrderDelay
   * @summary Notify student of order delay
   * @request POST:/api/notifications/partner/delay-notification
   * @secure
   * @response `201` `void` Delay notification sent
   */
  export namespace NotificationsControllerNotifyOrderDelay {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags notifications
   * @name NotificationsControllerSendPromotionalNotification
   * @summary Send promotional notification to all users
   * @request POST:/api/notifications/promotion/broadcast
   * @secure
   * @response `201` `void` Promotional notification sent
   */
  export namespace NotificationsControllerSendPromotionalNotification {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerGetProfile
   * @summary Get customer profile for authenticated user
   * @request GET:/api/customers/profile
   * @secure
   * @response `200` `void` Return customer profile
   * @response `401` `void` Unauthorized
   */
  export namespace CustomerControllerGetProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerUpdateProfile
   * @summary Update customer profile
   * @request PATCH:/api/customers/profile
   * @secure
   * @response `200` `void` Profile updated successfully
   * @response `400` `void` Bad request
   */
  export namespace CustomerControllerUpdateProfile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateCustomerProfileDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerGetAddresses
   * @summary Get customer delivery addresses
   * @request GET:/api/customers/addresses
   * @secure
   * @response `200` `void` Return delivery addresses
   */
  export namespace CustomerControllerGetAddresses {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerAddAddress
   * @summary Add new delivery address
   * @request POST:/api/customers/addresses
   * @secure
   * @response `201` `void` Address added successfully
   * @response `400` `void` Bad request
   */
  export namespace CustomerControllerAddAddress {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateDeliveryAddressDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerUpdateAddress
   * @summary Update delivery address
   * @request PATCH:/api/customers/addresses/{id}
   * @secure
   * @response `200` `void` Address updated successfully
   * @response `404` `void` Address not found
   */
  export namespace CustomerControllerUpdateAddress {
    export type RequestParams = {
      /** Address ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateDeliveryAddressDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerDeleteAddress
   * @summary Delete delivery address
   * @request DELETE:/api/customers/addresses/{id}
   * @secure
   * @response `200` `void` Address deleted successfully
   * @response `404` `void` Address not found
   */
  export namespace CustomerControllerDeleteAddress {
    export type RequestParams = {
      /** Address ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerGetOrders
   * @summary Get customer orders
   * @request GET:/api/customers/orders
   * @secure
   * @response `200` `void` Return customer orders
   */
  export namespace CustomerControllerGetOrders {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags customers
   * @name CustomerControllerGetSubscriptions
   * @summary Get customer subscriptions
   * @request GET:/api/customers/subscriptions
   * @secure
   * @response `200` `void` Return customer subscriptions
   */
  export namespace CustomerControllerGetSubscriptions {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags system
   * @name SystemControllerHealthCheck
   * @summary Server health check
   * @request GET:/api/ping
   * @response `200` `HealthCheckDto` Server health status
   * @response `503` `void` Server is experiencing issues
   */
  export namespace SystemControllerHealthCheck {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthCheckDto;
  }

  /**
   * No description
   * @tags system
   * @name SystemControllerGetVersion
   * @summary Application version information
   * @request GET:/api/version
   * @response `200` `VersionDto` Application version details
   */
  export namespace SystemControllerGetVersion {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VersionDto;
  }

  /**
   * No description
   * @tags landing
   * @name LandingControllerSubmitContact
   * @summary Submit contact form
   * @request POST:/api/contact
   * @response `201` `ContactResponseDto` Contact form submitted successfully
   * @response `400` `void` Invalid data format or missing required fields
   * @response `429` `void` Too many requests (rate limiting)
   */
  export namespace LandingControllerSubmitContact {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateContactDto;
    export type RequestHeaders = {};
    export type ResponseBody = ContactResponseDto;
  }

  /**
   * No description
   * @tags landing
   * @name LandingControllerSubmitContactAlias
   * @summary Submit contact form (alias)
   * @request POST:/api/landing/contact
   * @response `201` `ContactResponseDto` Contact form submitted successfully
   */
  export namespace LandingControllerSubmitContactAlias {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateContactDto;
    export type RequestHeaders = {};
    export type ResponseBody = ContactResponseDto;
  }

  /**
   * No description
   * @tags landing
   * @name LandingControllerSubscribe
   * @summary Subscribe to newsletter
   * @request POST:/api/subscribe
   * @response `201` `SubscriberResponseDto` Subscription created successfully
   * @response `400` `void` Invalid data format or missing required fields
   * @response `409` `void` Email already subscribed
   * @response `429` `void` Too many requests (rate limiting)
   */
  export namespace LandingControllerSubscribe {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateSubscriberDto;
    export type RequestHeaders = {};
    export type ResponseBody = SubscriberResponseDto;
  }

  /**
   * No description
   * @tags landing
   * @name LandingControllerGetContacts
   * @summary Get contact submissions (admin)
   * @request GET:/api/admin/contacts
   * @secure
   * @response `200` `void` Contacts list returned successfully
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   */
  export namespace LandingControllerGetContacts {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags landing
   * @name LandingControllerGetSubscribers
   * @summary Get newsletter subscribers (admin)
   * @request GET:/api/admin/subscribers
   * @secure
   * @response `200` `GetSubscribersResponseDto` Subscribers list returned successfully
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   */
  export namespace LandingControllerGetSubscribers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSubscribersResponseDto;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerCreateReferral
   * @summary Submit referral
   * @request POST:/api/referrals
   * @response `201` `ReferralResponseDto` Referral created successfully
   * @response `400` `void` Invalid data format or missing required fields
   * @response `409` `void` Self-referral or already referred
   * @response `429` `void` Too many requests (rate limiting)
   */
  export namespace MarketingControllerCreateReferral {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateReferralDto;
    export type RequestHeaders = {};
    export type ResponseBody = ReferralResponseDto;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerGetReferrals
   * @summary View tracked referrals (admin)
   * @request GET:/api/referrals
   * @secure
   * @response `200` `void` List of referrals returned successfully
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   */
  export namespace MarketingControllerGetReferrals {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerGetUserReferrals
   * @summary Get referrals for a specific user
   * @request GET:/api/referrals/user/{userId}
   * @secure
   * @response `200` `void` User referrals returned successfully
   * @response `401` `void` Unauthorized
   */
  export namespace MarketingControllerGetUserReferrals {
    export type RequestParams = {
      /** User ID */
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerCreateTestimonial
   * @summary Submit testimonial
   * @request POST:/api/testimonials
   * @response `201` `TestimonialResponseDto` Testimonial submitted successfully
   * @response `400` `void` Invalid data format or missing required fields
   * @response `429` `void` Too many requests (rate limiting)
   */
  export namespace MarketingControllerCreateTestimonial {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateTestimonialDto;
    export type RequestHeaders = {};
    export type ResponseBody = TestimonialResponseDto;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerGetPublicTestimonials
   * @summary Get approved testimonials (public)
   * @request GET:/api/testimonials/public
   * @response `200` `void` Public testimonials returned successfully
   */
  export namespace MarketingControllerGetPublicTestimonials {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerGetTestimonials
   * @summary Get all testimonials (admin)
   * @request GET:/api/admin/testimonials
   * @secure
   * @response `200` `GetTestimonialsResponseDto` Testimonials returned successfully
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   */
  export namespace MarketingControllerGetTestimonials {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @default 1
       */
      page?: number;
      /**
       * Items per page
       * @default 10
       */
      limit?: number;
      /** Filter by approval status */
      isApproved?: boolean;
      /** Filter by featured status */
      isFeatured?: boolean;
      /** Search term for filtering testimonials */
      search?: string;
      /** Start date for filtering testimonials */
      startDate?: string;
      /** End date for filtering testimonials */
      endDate?: string;
      /**
       * Field to sort testimonials by
       * @example "createdAt"
       */
      sortBy?: string;
      /**
       * Sort order (asc or desc)
       * @default "desc"
       */
      sortOrder?: "asc" | "desc";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTestimonialsResponseDto;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerUpdateTestimonialStatus
   * @summary Update testimonial status (admin)
   * @request PATCH:/api/admin/testimonials/{id}
   * @secure
   * @response `200` `TestimonialResponseDto` Testimonial updated successfully
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   * @response `404` `void` Testimonial not found
   */
  export namespace MarketingControllerUpdateTestimonialStatus {
    export type RequestParams = {
      /** Testimonial ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TestimonialResponseDto;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerGetActivePromotions
   * @summary Get active promotions
   * @request GET:/api/promotions/active
   * @response `200` `void` Active promotions returned successfully
   */
  export namespace MarketingControllerGetActivePromotions {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags marketing
   * @name MarketingControllerApplyPromotion
   * @summary Apply promotion code
   * @request POST:/api/apply-promotion
   * @secure
   * @response `200` `void` Promotion applied successfully
   * @response `400` `void` Invalid promotion code
   * @response `401` `void` Unauthorized
   */
  export namespace MarketingControllerApplyPromotion {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags corporate
   * @name CorporateControllerCreateQuoteRequest
   * @summary Submit a corporate quote request
   * @request POST:/api/corporate/quote
   * @response `201` `void` Corporate quote request submitted successfully
   * @response `400` `void` Bad Request - Invalid data provided
   */
  export namespace CorporateControllerCreateQuoteRequest {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateCorporateQuoteDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags corporate
   * @name CorporateControllerGetQuoteRequests
   * @summary Get corporate quote requests (admin)
   * @request GET:/api/corporate/quotes
   * @secure
   * @response `200` `void` Quote requests list returned successfully
   * @response `401` `void` Unauthorized
   * @response `403` `void` Forbidden
   */
  export namespace CorporateControllerGetQuoteRequests {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags analytics
   * @name AnalyticsControllerEarnings
   * @summary Get earnings analytics
   * @request GET:/api/analytics/earnings
   * @response `200` `void`
   */
  export namespace AnalyticsControllerEarnings {
    export type RequestParams = {};
    export type RequestQuery = {
      startDate?: string;
      endDate?: string;
      period?: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags analytics
   * @name AnalyticsControllerOrders
   * @summary Get order analytics
   * @request GET:/api/analytics/orders
   * @response `200` `void`
   */
  export namespace AnalyticsControllerOrders {
    export type RequestParams = {};
    export type RequestQuery = {
      period?: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags analytics
   * @name AnalyticsControllerRevenueHistory
   * @summary Get revenue history data
   * @request GET:/api/analytics/revenue-history
   * @response `200` `void`
   */
  export namespace AnalyticsControllerRevenueHistory {
    export type RequestParams = {};
    export type RequestQuery = {
      months?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags support
   * @name SupportControllerCreateTicket
   * @summary Create a new support ticket
   * @request POST:/api/support/ticket
   * @secure
   * @response `201` `TicketDto` Ticket created successfully.
   */
  export namespace SupportControllerCreateTicket {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateTicketDto;
    export type RequestHeaders = {};
    export type ResponseBody = TicketDto;
  }

  /**
   * No description
   * @tags support
   * @name SupportControllerGetMyTickets
   * @summary Get all support tickets for the current user
   * @request GET:/api/support/tickets
   * @secure
   * @response `200` `(TicketDto)[]` Returns all support tickets for the user.
   */
  export namespace SupportControllerGetMyTickets {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TicketDto[];
  }

  /**
   * No description
   * @tags upload
   * @name UploadControllerUploadImage
   * @summary Upload image
   * @request POST:/api/upload/image
   * @secure
   * @response `201` `void`
   */
  export namespace UploadControllerUploadImage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags upload
   * @name UploadControllerDelete
   * @summary Delete uploaded image
   * @request DELETE:/api/upload/image/{publicId}
   * @secure
   * @response `200` `void`
   */
  export namespace UploadControllerDelete {
    export type RequestParams = {
      publicId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerSeedDummyData
   * @summary Seed all dummy data (legacy endpoint)
   * @request POST:/api/seeder/seedDummyData
   * @response `200` `void` Seeding completed
   */
  export namespace SeederControllerSeedDummyData {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Execute all seeding phases with optional configuration. Supports different profiles and incremental seeding.
   * @tags seeder
   * @name SeederControllerSeedAll
   * @summary Seed all data with configuration
   * @request POST:/api/seeder/seed
   * @response `200` `SeederSummaryDto` Comprehensive seeding completed successfully
   * @response `400` `void` Invalid configuration provided
   * @response `500` `void` Seeding failed with errors
   */
  export namespace SeederControllerSeedAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /**
       * Predefined data volume profile
       * @example "standard"
       */
      profile?: "minimal" | "standard" | "extensive";
      /**
       * Add data without cleaning existing collections
       * @example false
       */
      incremental?: boolean;
      /**
       * Skip cleanup phase entirely
       * @example false
       */
      skipCleanup?: boolean;
    };
    export type RequestHeaders = {};
    export type ResponseBody = SeederSummaryDto;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerSeedPhase
   * @summary Seed specific phase
   * @request POST:/api/seeder/phase/{phaseName}
   * @response `200` `void` Phase seeding completed
   */
  export namespace SeederControllerSeedPhase {
    export type RequestParams = {
      /** Phase name */
      phaseName:
        | "core"
        | "partner"
        | "customer"
        | "transaction"
        | "communication"
        | "marketing"
        | "support";
    };
    export type RequestQuery = {};
    export type RequestBody = string;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerCleanPhase
   * @summary Clean specific phase data
   * @request DELETE:/api/seeder/phase/{phaseName}
   * @response `204` `void` Phase data cleaned
   */
  export namespace SeederControllerCleanPhase {
    export type RequestParams = {
      /** Phase name to clean */
      phaseName: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerSeedProfile
   * @summary Seed data using predefined profile
   * @request POST:/api/seeder/profile/{profileName}
   * @response `200` `void` Profile seeding completed
   */
  export namespace SeederControllerSeedProfile {
    export type RequestParams = {
      /** Profile name */
      profileName: "minimal" | "standard" | "extensive";
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Monitor real-time seeding progress, current phase, and completion estimates
   * @tags seeder
   * @name SeederControllerGetStatus
   * @summary Get current seeding status
   * @request GET:/api/seeder/status
   * @response `200` `SeederStatusDto` Current seeding status with progress information
   */
  export namespace SeederControllerGetStatus {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SeederStatusDto;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerGetConfig
   * @summary Get current seeder configuration
   * @request GET:/api/seeder/config
   * @response `200` `void` Current configuration
   */
  export namespace SeederControllerGetConfig {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerUpdateConfig
   * @summary Update seeder configuration
   * @request POST:/api/seeder/config
   * @response `200` `void` Configuration updated
   */
  export namespace SeederControllerUpdateConfig {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      profile?: string;
      imageStrategy?: object;
      geographic?: object;
      volumes?: object;
    };
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Comprehensive validation of data relationships, business logic, and integrity constraints
   * @tags seeder
   * @name SeederControllerValidateData
   * @summary Validate seeded data integrity
   * @request GET:/api/seeder/validate
   * @response `200` `ValidationResultDto` Data validation results with errors and warnings
   */
  export namespace SeederControllerValidateData {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ValidationResultDto;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerGetStats
   * @summary Get collection statistics
   * @request GET:/api/seeder/stats
   * @response `200` `void` Collection statistics
   */
  export namespace SeederControllerGetStats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerCleanAll
   * @summary Clean all seeded data
   * @request DELETE:/api/seeder/all
   * @response `204` `void` All data cleaned
   */
  export namespace SeederControllerCleanAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerGetAvailablePhases
   * @summary Get available seeding phases
   * @request GET:/api/seeder/phases
   * @response `200` `void` List of available phases
   */
  export namespace SeederControllerGetAvailablePhases {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags seeder
   * @name SeederControllerGetAvailableProfiles
   * @summary Get available seeding profiles
   * @request GET:/api/seeder/profiles
   * @response `200` `void` List of available profiles
   */
  export namespace SeederControllerGetAvailableProfiles {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerCreateConversation
   * @summary Create a new conversation
   * @request POST:/api/chat/conversations
   * @secure
   * @response `201` `Conversation` Conversation created successfully
   */
  export namespace ChatControllerCreateConversation {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateConversationDto;
    export type RequestHeaders = {};
    export type ResponseBody = Conversation;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerGetConversations
   * @summary Get all conversations for the current user
   * @request GET:/api/chat/conversations
   * @secure
   * @response `200` `(Conversation)[]` Returns all conversations for the user
   */
  export namespace ChatControllerGetConversations {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Conversation[];
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerGetConversationById
   * @summary Get conversation by ID
   * @request GET:/api/chat/conversations/{id}
   * @secure
   * @response `200` `Conversation` Returns the conversation
   */
  export namespace ChatControllerGetConversationById {
    export type RequestParams = {
      /** Conversation ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Conversation;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerSendMessage
   * @summary Send a new message
   * @request POST:/api/chat/messages
   * @secure
   * @response `201` `ChatMessage` Message sent successfully
   */
  export namespace ChatControllerSendMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendMessageDto;
    export type RequestHeaders = {};
    export type ResponseBody = ChatMessage;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerGetMessages
   * @summary Get messages for a conversation
   * @request GET:/api/chat/conversations/{id}/messages
   * @secure
   * @response `200` `(ChatMessage)[]` Returns messages for the conversation
   */
  export namespace ChatControllerGetMessages {
    export type RequestParams = {
      /** Conversation ID */
      id: string;
    };
    export type RequestQuery = {
      /** Page number */
      page?: number;
      /** Messages per page */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ChatMessage[];
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerMarkMessagesAsRead
   * @summary Mark messages as read
   * @request PUT:/api/chat/messages/read
   * @secure
   * @response `200` `void` Messages marked as read successfully
   */
  export namespace ChatControllerMarkMessagesAsRead {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateMessageStatusDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerDeleteMessage
   * @summary Delete a message
   * @request DELETE:/api/chat/messages/{id}
   * @secure
   * @response `200` `void` Message deleted successfully
   */
  export namespace ChatControllerDeleteMessage {
    export type RequestParams = {
      /** Message ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerEditMessage
   * @summary Edit a message
   * @request PUT:/api/chat/messages/{id}
   * @secure
   * @response `200` `ChatMessage` Message edited successfully
   */
  export namespace ChatControllerEditMessage {
    export type RequestParams = {
      /** Message ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {
      content?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = ChatMessage;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerSetTypingIndicator
   * @summary Set typing indicator
   * @request POST:/api/chat/typing
   * @secure
   * @response `200` `void` Typing indicator set successfully
   */
  export namespace ChatControllerSetTypingIndicator {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      conversationId?: string;
      isTyping?: boolean;
    };
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerGetTypingIndicators
   * @summary Get typing indicators for a conversation
   * @request GET:/api/chat/conversations/{id}/typing
   * @secure
   * @response `200` `(TypingIndicator)[]` Returns typing indicators
   */
  export namespace ChatControllerGetTypingIndicators {
    export type RequestParams = {
      /** Conversation ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TypingIndicator[];
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerGetOfflineMessages
   * @summary Get offline messages for sync
   * @request GET:/api/chat/offline/messages
   * @secure
   * @response `200` `(ChatMessage)[]` Returns offline messages
   */
  export namespace ChatControllerGetOfflineMessages {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Last sync timestamp */
      lastSyncTime: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ChatMessage[];
  }

  /**
   * No description
   * @tags chat
   * @name ChatControllerSyncOfflineMessages
   * @summary Sync offline messages
   * @request POST:/api/chat/offline/sync
   * @secure
   * @response `200` `(ChatMessage)[]` Messages synced successfully
   */
  export namespace ChatControllerSyncOfflineMessages {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChatMessage[];
    export type RequestHeaders = {};
    export type ResponseBody = ChatMessage[];
  }

  /**
 * No description
 * @tags chat
 * @name ChatControllerGetConversationStats
 * @summary Get conversation statistics
 * @request GET:/api/chat/conversations/{id}/stats
 * @secure
 * @response `200` `{
    totalMessages?: number,
    unreadCount?: number,
  \** @format date-time *\
    lastActivity?: string,
    participants?: number,

}` Returns conversation statistics
*/
  export namespace ChatControllerGetConversationStats {
    export type RequestParams = {
      /** Conversation ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      totalMessages?: number;
      unreadCount?: number;
      /** @format date-time */
      lastActivity?: string;
      participants?: number;
    };
  }

  /**
   * No description
   * @tags reviews
   * @name ReviewControllerCreateRestaurantReview
   * @summary Create restaurant review
   * @request POST:/api/reviews/restaurant/{restaurantId}
   * @secure
   * @response `201` `void` Review created successfully
   * @response `400` `void` Invalid input or already reviewed
   * @response `404` `void` Restaurant not found
   */
  export namespace ReviewControllerCreateRestaurantReview {
    export type RequestParams = {
      /** Restaurant ID */
      restaurantId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateReviewDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags reviews
   * @name ReviewControllerGetRestaurantReviews
   * @summary Get restaurant reviews
   * @request GET:/api/reviews/restaurant/{restaurantId}
   * @response `200` `void` Return restaurant reviews
   */
  export namespace ReviewControllerGetRestaurantReviews {
    export type RequestParams = {
      /** Restaurant ID */
      restaurantId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags reviews
   * @name ReviewControllerCreateMenuItemReview
   * @summary Create menu item review
   * @request POST:/api/reviews/menu-item/{itemId}
   * @secure
   * @response `201` `void` Review created successfully
   * @response `400` `void` Invalid input or already reviewed
   * @response `404` `void` Menu item not found
   */
  export namespace ReviewControllerCreateMenuItemReview {
    export type RequestParams = {
      /** Menu item ID */
      itemId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateReviewDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags reviews
   * @name ReviewControllerGetMenuItemReviews
   * @summary Get menu item reviews
   * @request GET:/api/reviews/menu-item/{itemId}
   * @response `200` `void` Return menu item reviews
   */
  export namespace ReviewControllerGetMenuItemReviews {
    export type RequestParams = {
      /** Menu item ID */
      itemId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags reviews
   * @name ReviewControllerMarkHelpful
   * @summary Mark review as helpful
   * @request PATCH:/api/reviews/{id}/helpful
   * @secure
   * @response `200` `void` Review marked as helpful
   * @response `404` `void` Review not found
   */
  export namespace ReviewControllerMarkHelpful {
    export type RequestParams = {
      /** Review ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags reviews
   * @name ReviewControllerUpdateReview
   * @summary Update review
   * @request PUT:/api/reviews/{id}
   * @secure
   * @response `200` `void` Review updated successfully
   * @response `403` `void` Not authorized to update this review
   * @response `404` `void` Review not found
   */
  export namespace ReviewControllerUpdateReview {
    export type RequestParams = {
      /** Review ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateReviewDto;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * No description
   * @tags reviews
   * @name ReviewControllerDeleteReview
   * @summary Delete review
   * @request DELETE:/api/reviews/{id}
   * @secure
   * @response `200` `void` Review deleted successfully
   * @response `403` `void` Not authorized to delete this review
   * @response `404` `void` Review not found
   */
  export namespace ReviewControllerDeleteReview {
    export type RequestParams = {
      /** Review ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title TiffinWale API
 * @version 1.0.0
 * @contact
 *
 * TiffinWale Backend API Documentation
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegister
     * @summary Register a new user
     * @request POST:/api/auth/register
     * @response `201` `void` User has been registered
     * @response `400` `void` Bad request
     * @response `409` `void` Email already exists
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegisterPartner
     * @summary Register a new partner (business user)
     * @request POST:/api/auth/register-partner
     * @response `201` `void` Partner has been registered
     * @response `400` `void` Bad request
     * @response `409` `void` Email already exists
     */
    authControllerRegisterPartner: (
      data: RegisterPartnerDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/register-partner`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegisterSuperAdmin
     * @summary Register a super admin user (development only)
     * @request POST:/api/auth/super-admin/register
     * @response `201` `void` Super admin has been registered
     * @response `400` `void` Bad request
     * @response `409` `void` Email already exists
     */
    authControllerRegisterSuperAdmin: (
      data: RegisterDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/super-admin/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @summary User login
     * @request POST:/api/auth/login
     * @response `200` `void` User login successful
     * @response `401` `void` Unauthorized
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerChangePassword
     * @summary Change user password
     * @request POST:/api/auth/change-password
     * @secure
     * @response `200` `void` Password changed successfully
     * @response `401` `void` Unauthorized
     */
    authControllerChangePassword: (
      data: ChangePasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRefresh
     * @summary Refresh JWT token
     * @request POST:/api/auth/refresh-token
     * @response `200` `void` Token refreshed successfully
     */
    authControllerRefresh: (
      data: RefreshTokenDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/auth/refresh-token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogout
     * @summary User logout
     * @request POST:/api/auth/logout
     * @secure
     * @response `200` `void` User logged out successfully
     * @response `401` `void` Unauthorized
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerForgotPassword
     * @summary Request password reset
     * @request POST:/api/auth/forgot-password
     * @response `200` `void` Password reset email sent
     * @response `400` `void` Bad request
     * @response `404` `void` User not found
     */
    authControllerForgotPassword: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/forgot-password`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerResetPassword
     * @summary Reset password with token
     * @request POST:/api/auth/reset-password
     * @response `200` `void` Password reset successfully
     * @response `400` `void` Bad request or invalid token
     */
    authControllerResetPassword: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/reset-password`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerCreate
     * @summary Create a new user
     * @request POST:/api/users
     * @secure
     * @response `201` `void` User has been created
     * @response `400` `void` Bad request
     * @response `409` `void` Email already exists
     */
    userControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerFindAll
     * @summary Get all users
     * @request GET:/api/users
     * @secure
     * @response `200` `void` Return all users
     */
    userControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerFindOne
     * @summary Get a user by ID
     * @request GET:/api/users/{id}
     * @secure
     * @response `200` `void` Return the user
     * @response `404` `void` User not found
     */
    userControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/users/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerUpdate
     * @summary Update a user
     * @request PATCH:/api/users/{id}
     * @secure
     * @response `200` `void` User has been updated
     * @response `404` `void` User not found
     */
    userControllerUpdate: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/users/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerRemove
     * @summary Delete a user
     * @request DELETE:/api/users/{id}
     * @secure
     * @response `200` `void` User has been deleted
     * @response `404` `void` User not found
     */
    userControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/users/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerGetProfile
     * @summary Get current user's profile
     * @request GET:/api/users/profile
     * @secure
     * @response `200` `void` Return current user
     */
    userControllerGetProfile: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/profile`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerUpdateProfile
     * @summary Update current user's profile
     * @request PATCH:/api/users/profile
     * @secure
     * @response `200` `void` User has been updated
     */
    userControllerUpdateProfile: (
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/profile`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerCreate
     * @summary Create a new subscription
     * @request POST:/api/subscriptions
     * @secure
     * @response `201` `void` The subscription has been created successfully.
     * @response `400` `void` Bad Request.
     * @response `401` `void` Unauthorized.
     */
    subscriptionControllerCreate: (
      data: CreateSubscriptionDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerFindAll
     * @summary Get all subscriptions
     * @request GET:/api/subscriptions
     * @secure
     * @response `200` `void` Return all subscriptions.
     * @response `401` `void` Unauthorized.
     */
    subscriptionControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/subscriptions`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerGetCurrentSubscription
     * @summary Get current active subscription for authenticated user
     * @request GET:/api/subscriptions/me/current
     * @secure
     * @response `200` `void` Return current active subscription.
     * @response `401` `void` Unauthorized.
     * @response `404` `void` No active subscription found.
     */
    subscriptionControllerGetCurrentSubscription: (
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions/me/current`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerGetAllUserSubscriptions
     * @summary Get all subscriptions for authenticated user
     * @request GET:/api/subscriptions/me/all
     * @secure
     * @response `200` `void` Return all user subscriptions.
     * @response `401` `void` Unauthorized.
     */
    subscriptionControllerGetAllUserSubscriptions: (
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions/me/all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerFindByCustomer
     * @summary Get all subscriptions for a customer
     * @request GET:/api/subscriptions/customer/{customerId}
     * @secure
     * @response `200` `void` Return all customer subscriptions.
     * @response `401` `void` Unauthorized.
     */
    subscriptionControllerFindByCustomer: (
      customerId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions/customer/${customerId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerFindOne
     * @summary Get a specific subscription by ID
     * @request GET:/api/subscriptions/{id}
     * @secure
     * @response `200` `void` Return the subscription.
     * @response `401` `void` Unauthorized.
     * @response `404` `void` Subscription not found.
     */
    subscriptionControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/subscriptions/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerUpdate
     * @summary Update a subscription
     * @request PATCH:/api/subscriptions/{id}
     * @secure
     * @response `200` `void` The subscription has been updated successfully.
     * @response `400` `void` Bad Request.
     * @response `401` `void` Unauthorized.
     * @response `404` `void` Subscription not found.
     */
    subscriptionControllerUpdate: (
      id: string,
      data: UpdateSubscriptionDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerRemove
     * @summary Delete a subscription
     * @request DELETE:/api/subscriptions/{id}
     * @secure
     * @response `200` `void` The subscription has been deleted successfully.
     * @response `401` `void` Unauthorized.
     * @response `404` `void` Subscription not found.
     */
    subscriptionControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/subscriptions/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerCancelSubscription
     * @summary Cancel a subscription
     * @request PATCH:/api/subscriptions/{id}/cancel
     * @secure
     * @response `200` `void` The subscription has been cancelled successfully.
     * @response `400` `void` Bad Request.
     * @response `401` `void` Unauthorized.
     * @response `404` `void` Subscription not found.
     */
    subscriptionControllerCancelSubscription: (
      id: string,
      query: {
        /** Reason for cancellation */
        reason: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions/${id}/cancel`,
        method: "PATCH",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerPauseSubscription
     * @summary Pause a subscription
     * @request PATCH:/api/subscriptions/{id}/pause
     * @secure
     * @response `200` `void` The subscription has been paused successfully.
     * @response `400` `void` Bad Request.
     * @response `401` `void` Unauthorized.
     * @response `404` `void` Subscription not found.
     */
    subscriptionControllerPauseSubscription: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions/${id}/pause`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscriptions
     * @name SubscriptionControllerResumeSubscription
     * @summary Resume a paused subscription
     * @request PATCH:/api/subscriptions/{id}/resume
     * @secure
     * @response `200` `void` The subscription has been resumed successfully.
     * @response `400` `void` Bad Request.
     * @response `401` `void` Unauthorized.
     * @response `404` `void` Subscription not found.
     */
    subscriptionControllerResumeSubscription: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscriptions/${id}/resume`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription-plans
     * @name SubscriptionPlanControllerCreate
     * @summary Create a new subscription plan
     * @request POST:/api/subscription-plans
     * @secure
     * @response `201` `void` Subscription plan created successfully
     * @response `400` `void` Bad request
     */
    subscriptionPlanControllerCreate: (
      data: CreateSubscriptionPlanDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscription-plans`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription-plans
     * @name SubscriptionPlanControllerFindAll
     * @summary Get all subscription plans
     * @request GET:/api/subscription-plans
     * @response `200` `void` Return all subscription plans
     */
    subscriptionPlanControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/subscription-plans`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription-plans
     * @name SubscriptionPlanControllerFindActive
     * @summary Get all active subscription plans
     * @request GET:/api/subscription-plans/active
     * @response `200` `void` Return active subscription plans
     */
    subscriptionPlanControllerFindActive: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/subscription-plans/active`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription-plans
     * @name SubscriptionPlanControllerFindOne
     * @summary Get a specific subscription plan by ID
     * @request GET:/api/subscription-plans/{id}
     * @response `200` `void` Return the subscription plan
     * @response `404` `void` Subscription plan not found
     */
    subscriptionPlanControllerFindOne: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscription-plans/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription-plans
     * @name SubscriptionPlanControllerUpdate
     * @summary Update a subscription plan
     * @request PATCH:/api/subscription-plans/{id}
     * @secure
     * @response `200` `void` Subscription plan updated successfully
     * @response `404` `void` Subscription plan not found
     */
    subscriptionPlanControllerUpdate: (
      id: string,
      data: UpdateSubscriptionPlanDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscription-plans/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags subscription-plans
     * @name SubscriptionPlanControllerRemove
     * @summary Delete a subscription plan
     * @request DELETE:/api/subscription-plans/{id}
     * @secure
     * @response `200` `void` Subscription plan deleted successfully
     * @response `404` `void` Subscription plan not found
     */
    subscriptionPlanControllerRemove: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/subscription-plans/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @name CustomerProfileControllerFindByUserId
     * @request GET:/api/customer-profile/{userId}
     * @response `200` `void`
     */
    customerProfileControllerFindByUserId: (
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/customer-profile/${userId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name CustomerProfileControllerUpdate
     * @request PUT:/api/customer-profile/{userId}
     * @response `200` `void`
     */
    customerProfileControllerUpdate: (
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/customer-profile/${userId}`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @name CustomerProfileControllerDelete
     * @request DELETE:/api/customer-profile/{userId}
     * @response `200` `void`
     */
    customerProfileControllerDelete: (
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/customer-profile/${userId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @name CustomerProfileControllerCreate
     * @request POST:/api/customer-profile
     * @response `201` `void`
     */
    customerProfileControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/customer-profile`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerGetTodayMeals
     * @summary Get today's meals for the authenticated user
     * @request GET:/api/meals/today
     * @secure
     * @response `200` `void` Return today's meals
     * @response `401` `void` Unauthorized
     */
    mealControllerGetTodayMeals: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/meals/today`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerGetMealHistory
     * @summary Get meal history for the authenticated user
     * @request GET:/api/meals/me/history
     * @secure
     * @response `200` `void` Return meal history
     * @response `401` `void` Unauthorized
     */
    mealControllerGetMealHistory: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/meals/me/history`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerGetUpcomingMeals
     * @summary Get upcoming meals for the authenticated user
     * @request GET:/api/meals/upcoming
     * @secure
     * @response `200` `void` Return upcoming meals
     * @response `401` `void` Unauthorized
     */
    mealControllerGetUpcomingMeals: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/meals/upcoming`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerGetMealById
     * @summary Get a specific meal by ID
     * @request GET:/api/meals/{id}
     * @secure
     * @response `200` `void` Return the meal
     * @response `404` `void` Meal not found
     */
    mealControllerGetMealById: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/meals/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerUpdateMealStatus
     * @summary Update meal status
     * @request PATCH:/api/meals/{id}/status
     * @secure
     * @response `200` `void` Meal status updated successfully
     * @response `404` `void` Meal not found
     */
    mealControllerUpdateMealStatus: (
      id: string,
      data: UpdateMealStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/meals/${id}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerSkipMeal
     * @summary Skip a meal
     * @request PATCH:/api/meals/{id}/skip
     * @secure
     * @response `200` `void` Meal skipped successfully
     * @response `404` `void` Meal not found
     */
    mealControllerSkipMeal: (
      id: string,
      data: SkipMealDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/meals/${id}/skip`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerRateMeal
     * @summary Rate a meal
     * @request POST:/api/meals/{id}/rate
     * @secure
     * @response `201` `void` Meal rated successfully
     * @response `404` `void` Meal not found
     */
    mealControllerRateMeal: (
      id: string,
      data: RateMealDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/meals/${id}/rate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags meals
     * @name MealControllerCreateMeal
     * @summary Create a new meal
     * @request POST:/api/meals
     * @secure
     * @response `201` `void` Meal created successfully
     * @response `400` `void` Bad request
     */
    mealControllerCreateMeal: (
      data: CreateMealDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/meals`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerCreate
     * @summary Create a new partner
     * @request POST:/api/partners
     * @secure
     * @response `201` `void` Partner created successfully
     * @response `400` `void` Bad request
     */
    partnerControllerCreate: (
      data: CreatePartnerDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/partners`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerFindAll
     * @summary Get all partners/restaurants
     * @request GET:/api/partners
     * @response `200` `void` Return all partners
     */
    partnerControllerFindAll: (
      query?: {
        /** Filter by cuisine type */
        cuisineType?: string;
        /** Filter by minimum rating */
        rating?: number;
        /** Filter by city */
        city?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/partners`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerFindOne
     * @summary Get a specific partner by ID
     * @request GET:/api/partners/{id}
     * @response `200` `void` Return the partner
     * @response `404` `void` Partner not found
     */
    partnerControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/partners/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerUpdate
     * @summary Update a partner
     * @request PATCH:/api/partners/{id}
     * @secure
     * @response `200` `void` Partner updated successfully
     * @response `404` `void` Partner not found
     */
    partnerControllerUpdate: (
      id: string,
      data: UpdatePartnerDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/partners/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerRemove
     * @summary Delete a partner
     * @request DELETE:/api/partners/{id}
     * @secure
     * @response `200` `void` Partner deleted successfully
     * @response `404` `void` Partner not found
     */
    partnerControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/partners/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerGetMenu
     * @summary Get menu for a specific partner
     * @request GET:/api/partners/{id}/menu
     * @response `200` `void` Return partner menu
     * @response `404` `void` Partner not found
     */
    partnerControllerGetMenu: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/partners/${id}/menu`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerGetReviews
     * @summary Get reviews for a specific partner
     * @request GET:/api/partners/{id}/reviews
     * @response `200` `void` Return partner reviews
     * @response `404` `void` Partner not found
     */
    partnerControllerGetReviews: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/partners/${id}/reviews`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags partners
     * @name PartnerControllerGetStats
     * @summary Get statistics for a specific partner
     * @request GET:/api/partners/{id}/stats
     * @response `200` `void` Return partner statistics
     * @response `404` `void` Partner not found
     */
    partnerControllerGetStats: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/partners/${id}/stats`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerFindAllCategories
     * @summary Get all categories
     * @request GET:/api/menu/categories
     * @secure
     * @response `200` `void` Return all categories
     */
    menuControllerFindAllCategories: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/menu/categories`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerCreateCategory
     * @summary Create a new category
     * @request POST:/api/menu/categories
     * @secure
     * @response `201` `void` Category created successfully
     * @response `400` `void` Invalid input
     */
    menuControllerCreateCategory: (
      data: CreateCategoryDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/menu/categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerFindCategoryById
     * @summary Get category by ID
     * @request GET:/api/menu/categories/{id}
     * @secure
     * @response `200` `void` Return the category
     * @response `404` `void` Category not found
     */
    menuControllerFindCategoryById: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/menu/categories/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerUpdateCategory
     * @summary Update a category
     * @request PATCH:/api/menu/categories/{id}
     * @secure
     * @response `200` `void` Category updated successfully
     * @response `400` `void` Invalid input
     * @response `404` `void` Category not found
     */
    menuControllerUpdateCategory: (
      id: string,
      data: UpdateCategoryDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/menu/categories/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerDeleteCategory
     * @summary Delete a category
     * @request DELETE:/api/menu/categories/{id}
     * @secure
     * @response `200` `void` Category deleted successfully
     * @response `404` `void` Category not found
     */
    menuControllerDeleteCategory: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/menu/categories/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerFindMenuItemsByPartner
     * @summary Get menu items by partner
     * @request GET:/api/menu/partner/{partnerId}
     * @secure
     * @response `200` `void` Return partner menu items
     */
    menuControllerFindMenuItemsByPartner: (
      partnerId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/menu/partner/${partnerId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerFindAllMenuItems
     * @summary Get all menu items
     * @request GET:/api/menu
     * @secure
     * @response `200` `void` Return all menu items
     */
    menuControllerFindAllMenuItems: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/menu`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerCreateMenuItem
     * @summary Create a new menu item
     * @request POST:/api/menu
     * @secure
     * @response `201` `void` Menu item created successfully
     * @response `400` `void` Invalid input
     */
    menuControllerCreateMenuItem: (
      data: CreateMenuItemDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/menu`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerGetMenuItemDetails
     * @summary Get menu item details with reviews
     * @request GET:/api/menu/item/{itemId}
     * @response `200` `void` Return menu item details
     * @response `404` `void` Menu item not found
     */
    menuControllerGetMenuItemDetails: (
      itemId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/menu/item/${itemId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerGetRestaurantMenus
     * @summary Get all menus for a restaurant
     * @request GET:/api/menu/restaurant/{restaurantId}/menus
     * @response `200` `void` Return restaurant menus
     */
    menuControllerGetRestaurantMenus: (
      restaurantId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/menu/restaurant/${restaurantId}/menus`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerFindMenuItemById
     * @summary Get menu item by ID
     * @request GET:/api/menu/{id}
     * @secure
     * @response `200` `void` Return the menu item
     * @response `404` `void` Menu item not found
     */
    menuControllerFindMenuItemById: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/menu/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerUpdateMenuItem
     * @summary Update a menu item
     * @request PATCH:/api/menu/{id}
     * @secure
     * @response `200` `void` Menu item updated successfully
     * @response `400` `void` Invalid input
     * @response `404` `void` Menu item not found
     */
    menuControllerUpdateMenuItem: (
      id: string,
      data: UpdateMenuItemDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/menu/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu
     * @name MenuControllerDeleteMenuItem
     * @summary Delete a menu item
     * @request DELETE:/api/menu/{id}
     * @secure
     * @response `200` `void` Menu item deleted successfully
     * @response `404` `void` Menu item not found
     */
    menuControllerDeleteMenuItem: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/menu/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags feedback
     * @name FeedbackControllerSubmitFeedback
     * @summary Submit feedback or report
     * @request POST:/api/feedback
     * @response `201` `FeedbackResponseDto` Feedback submitted successfully
     * @response `400` `void` Invalid data format or missing required fields
     * @response `429` `void` Too many requests (rate limiting)
     */
    feedbackControllerSubmitFeedback: (
      data: CreateFeedbackDto,
      params: RequestParams = {},
    ) =>
      this.request<FeedbackResponseDto, void>({
        path: `/api/feedback`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags feedback
     * @name FeedbackControllerGetFeedback
     * @summary View customer feedback (admin)
     * @request GET:/api/admin/feedback
     * @secure
     * @response `200` `void` List of feedback returned successfully
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     */
    feedbackControllerGetFeedback: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/admin/feedback`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerCreate
     * @summary Create a new order
     * @request POST:/api/orders
     * @secure
     * @response `201` `void` Order has been created
     * @response `400` `void` Bad request
     */
    orderControllerCreate: (data: CreateOrderDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/orders`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerFindAll
     * @summary Get all orders
     * @request GET:/api/orders
     * @secure
     * @response `200` `void` Return all orders
     */
    orderControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/orders`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerGetMyOrders
     * @summary Get orders for current authenticated customer
     * @request GET:/api/orders/me
     * @secure
     * @response `200` `void` Return customer orders
     */
    orderControllerGetMyOrders: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/orders/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerFindByStatus
     * @summary Get orders by status
     * @request GET:/api/orders/status/{status}
     * @secure
     * @response `200` `void` Return orders by status
     */
    orderControllerFindByStatus: (status: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/orders/status/${status}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerFindByCustomer
     * @summary Get orders by customer
     * @request GET:/api/orders/customer/{customerId}
     * @secure
     * @response `200` `void` Return customer orders
     */
    orderControllerFindByCustomer: (
      customerId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/orders/customer/${customerId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerFindByPartner
     * @summary Get orders by business partner
     * @request GET:/api/orders/partner/{partnerId}
     * @secure
     * @response `200` `void` Return partner orders
     */
    orderControllerFindByPartner: (
      partnerId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/orders/partner/${partnerId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerFindOne
     * @summary Get order by ID
     * @request GET:/api/orders/{id}
     * @secure
     * @response `200` `void` Return the order
     * @response `404` `void` Order not found
     */
    orderControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/orders/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerUpdate
     * @summary Update an order
     * @request PATCH:/api/orders/{id}
     * @secure
     * @response `200` `void` Order has been updated
     * @response `400` `void` Bad request
     * @response `404` `void` Order not found
     */
    orderControllerUpdate: (
      id: string,
      data: UpdateOrderDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/orders/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerRemove
     * @summary Delete an order
     * @request DELETE:/api/orders/{id}
     * @secure
     * @response `204` `void` Order has been deleted
     * @response `400` `void` Bad request
     * @response `404` `void` Order not found
     */
    orderControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/orders/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerUpdateStatus
     * @summary Update order status
     * @request PATCH:/api/orders/{id}/status
     * @secure
     * @response `200` `void` Order status has been updated
     * @response `400` `void` Bad request
     * @response `404` `void` Order not found
     */
    orderControllerUpdateStatus: (
      id: string,
      data: UpdateOrderStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/orders/${id}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerMarkAsPaid
     * @summary Mark order as paid
     * @request PATCH:/api/orders/{id}/paid
     * @secure
     * @response `200` `void` Order has been marked as paid
     * @response `400` `void` Bad request
     * @response `404` `void` Order not found
     * @response `409` `void` Order is already paid
     */
    orderControllerMarkAsPaid: (
      id: string,
      data: MarkOrderPaidDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/orders/${id}/paid`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags orders
     * @name OrderControllerAddReview
     * @summary Add review to an order
     * @request PATCH:/api/orders/{id}/review
     * @secure
     * @response `200` `void` Review has been added
     * @response `400` `void` Bad request
     * @response `404` `void` Order not found
     * @response `409` `void` Order already has a review
     */
    orderControllerAddReview: (
      id: string,
      data: AddOrderReviewDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/orders/${id}/review`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetDashboardStats
     * @request GET:/api/admin/dashboard/stats
     * @response `200` `void`
     */
    adminControllerGetDashboardStats: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/admin/dashboard/stats`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetRecentActivities
     * @request GET:/api/admin/dashboard/activities
     * @response `200` `void`
     */
    adminControllerGetRecentActivities: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/admin/dashboard/activities`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetAllOrders
     * @summary Get all orders with filters (admin only)
     * @request GET:/api/admin/orders
     * @response `200` `void` Orders returned
     */
    adminControllerGetAllOrders: (
      query?: {
        status?: string;
        search?: string;
        limit?: number;
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/admin/orders`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetAllPartners
     * @summary Get all partners with filters (admin only)
     * @request GET:/api/admin/partners
     * @response `200` `void` Partners returned
     */
    adminControllerGetAllPartners: (
      query?: {
        status?: string;
        search?: string;
        limit?: number;
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/admin/partners`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetAllCustomers
     * @summary Get all customers with filters (admin only)
     * @request GET:/api/admin/customers
     * @response `200` `void` Customers returned
     */
    adminControllerGetAllCustomers: (
      query?: {
        status?: string;
        search?: string;
        limit?: number;
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/admin/customers`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetAllSubscriptions
     * @summary Get all subscriptions with filters (admin only)
     * @request GET:/api/admin/subscriptions
     * @response `200` `void` Subscriptions returned
     */
    adminControllerGetAllSubscriptions: (
      query?: {
        status?: string;
        limit?: number;
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/admin/subscriptions`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetRevenueData
     * @summary Get revenue data with filters (admin only)
     * @request GET:/api/admin/revenue
     * @response `200` `void` Revenue data returned
     */
    adminControllerGetRevenueData: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/admin/revenue`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetAllSupportTickets
     * @summary Get all support tickets (admin only)
     * @request GET:/api/admin/support/tickets
     * @response `200` `void` Support tickets returned
     */
    adminControllerGetAllSupportTickets: (
      query?: {
        status?: string;
        priority?: string;
        limit?: number;
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/admin/support/tickets`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerUpdateSupportTicket
     * @summary Update support ticket status
     * @request PUT:/api/admin/support/tickets/{id}
     * @response `200` `void` Support ticket updated
     */
    adminControllerUpdateSupportTicket: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/admin/support/tickets/${id}`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name AdminControllerGetRevenueHistory
     * @summary Get revenue history for analytics
     * @request GET:/api/admin/analytics/revenue-history
     * @response `200` `void` Revenue history returned
     */
    adminControllerGetRevenueHistory: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/admin/analytics/revenue-history`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment
     * @name PaymentControllerCreatePaymentMethod
     * @summary Create a new payment method
     * @request POST:/api/payment/methods
     * @secure
     * @response `201` `void` The payment method has been successfully created.
     * @response `400` `void` Invalid input.
     */
    paymentControllerCreatePaymentMethod: (
      data: CreatePaymentMethodDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/payment/methods`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment
     * @name PaymentControllerGetCustomerPaymentMethods
     * @summary Get all payment methods for a customer
     * @request GET:/api/payment/methods/customer/{customerId}
     * @secure
     * @response `200` `void` Returns all payment methods for the specified customer.
     */
    paymentControllerGetCustomerPaymentMethods: (
      customerId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/payment/methods/customer/${customerId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment
     * @name PaymentControllerGetPaymentMethodById
     * @summary Get a payment method by ID
     * @request GET:/api/payment/methods/{id}
     * @secure
     * @response `200` `void` Returns the payment method.
     * @response `404` `void` Payment method not found.
     */
    paymentControllerGetPaymentMethodById: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/payment/methods/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment
     * @name PaymentControllerUpdatePaymentMethod
     * @summary Update a payment method
     * @request PATCH:/api/payment/methods/{id}
     * @secure
     * @response `200` `void` The payment method has been successfully updated.
     * @response `404` `void` Payment method not found.
     */
    paymentControllerUpdatePaymentMethod: (
      id: string,
      data: UpdatePaymentMethodDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/payment/methods/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment
     * @name PaymentControllerDeletePaymentMethod
     * @summary Delete a payment method
     * @request DELETE:/api/payment/methods/{id}
     * @secure
     * @response `200` `void` The payment method has been successfully deleted.
     * @response `404` `void` Payment method not found.
     */
    paymentControllerDeletePaymentMethod: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/payment/methods/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment
     * @name PaymentControllerSetDefaultPaymentMethod
     * @summary Set a payment method as default
     * @request PATCH:/api/payment/methods/{id}/set-default
     * @secure
     * @response `200` `void` The payment method has been set as default.
     * @response `404` `void` Payment method not found.
     */
    paymentControllerSetDefaultPaymentMethod: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/payment/methods/${id}/set-default`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags payment-webhooks
     * @name WebhookControllerHandleRazorpayWebhook
     * @summary Handle Razorpay webhook events
     * @request POST:/api/webhook/razorpay
     * @response `200` `void` Webhook processed successfully
     * @response `400` `void` Invalid webhook event
     */
    webhookControllerHandleRazorpayWebhook: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/webhook/razorpay`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerRegisterDevice
     * @summary Register device for push notifications
     * @request POST:/api/notifications/register-device
     * @secure
     * @response `201` `void` Device registered successfully
     */
    notificationsControllerRegisterDevice: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notifications/register-device`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerUnregisterDevice
     * @summary Unregister device from push notifications
     * @request DELETE:/api/notifications/unregister-device
     * @secure
     * @response `200` `void` Device unregistered successfully
     */
    notificationsControllerUnregisterDevice: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notifications/unregister-device`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerUpdateDevice
     * @summary Update device user association
     * @request PUT:/api/notifications/update-device
     * @secure
     * @response `200` `void` Device updated successfully
     */
    notificationsControllerUpdateDevice: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notifications/update-device`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerSendNotification
     * @summary Send notification
     * @request POST:/api/notifications/send
     * @secure
     * @response `201` `void` Notification sent successfully
     */
    notificationsControllerSendNotification: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notifications/send`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerSendOrderUpdate
     * @summary Send order status update notification
     * @request POST:/api/notifications/send-order-update
     * @secure
     * @response `201` `void` Order notification sent successfully
     */
    notificationsControllerSendOrderUpdate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notifications/send-order-update`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerSendNewOrderNotification
     * @summary Notify partner of new order
     * @request POST:/api/notifications/send-new-order
     * @secure
     * @response `201` `void` New order notification sent successfully
     */
    notificationsControllerSendNewOrderNotification: (
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/notifications/send-new-order`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerSendMessageNotification
     * @summary Send chat message notification
     * @request POST:/api/notifications/send-message
     * @secure
     * @response `201` `void` Message notification sent successfully
     */
    notificationsControllerSendMessageNotification: (
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/notifications/send-message`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerGetNotificationHistory
     * @summary Get notification history
     * @request GET:/api/notifications/history
     * @secure
     * @response `200` `void` Notification history retrieved successfully
     */
    notificationsControllerGetNotificationHistory: (
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/notifications/history`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerGetPendingNotifications
     * @summary Get pending notifications
     * @request GET:/api/notifications/pending
     * @secure
     * @response `200` `void` Pending notifications retrieved successfully
     */
    notificationsControllerGetPendingNotifications: (
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/notifications/pending`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerMarkAsRead
     * @summary Mark notification as read
     * @request PUT:/api/notifications/{id}/read
     * @secure
     * @response `200` `void` Notification marked as read
     */
    notificationsControllerMarkAsRead: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/notifications/${id}/read`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerNotifyOrderReady
     * @summary Notify student that order is ready
     * @request POST:/api/notifications/partner/order-ready
     * @secure
     * @response `201` `void` Order ready notification sent
     */
    notificationsControllerNotifyOrderReady: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notifications/partner/order-ready`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerNotifyOrderDelay
     * @summary Notify student of order delay
     * @request POST:/api/notifications/partner/delay-notification
     * @secure
     * @response `201` `void` Delay notification sent
     */
    notificationsControllerNotifyOrderDelay: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notifications/partner/delay-notification`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationsControllerSendPromotionalNotification
     * @summary Send promotional notification to all users
     * @request POST:/api/notifications/promotion/broadcast
     * @secure
     * @response `201` `void` Promotional notification sent
     */
    notificationsControllerSendPromotionalNotification: (
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/notifications/promotion/broadcast`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerGetProfile
     * @summary Get customer profile for authenticated user
     * @request GET:/api/customers/profile
     * @secure
     * @response `200` `void` Return customer profile
     * @response `401` `void` Unauthorized
     */
    customerControllerGetProfile: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/customers/profile`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerUpdateProfile
     * @summary Update customer profile
     * @request PATCH:/api/customers/profile
     * @secure
     * @response `200` `void` Profile updated successfully
     * @response `400` `void` Bad request
     */
    customerControllerUpdateProfile: (
      data: UpdateCustomerProfileDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/customers/profile`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerGetAddresses
     * @summary Get customer delivery addresses
     * @request GET:/api/customers/addresses
     * @secure
     * @response `200` `void` Return delivery addresses
     */
    customerControllerGetAddresses: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/customers/addresses`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerAddAddress
     * @summary Add new delivery address
     * @request POST:/api/customers/addresses
     * @secure
     * @response `201` `void` Address added successfully
     * @response `400` `void` Bad request
     */
    customerControllerAddAddress: (
      data: CreateDeliveryAddressDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/customers/addresses`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerUpdateAddress
     * @summary Update delivery address
     * @request PATCH:/api/customers/addresses/{id}
     * @secure
     * @response `200` `void` Address updated successfully
     * @response `404` `void` Address not found
     */
    customerControllerUpdateAddress: (
      id: string,
      data: UpdateDeliveryAddressDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/customers/addresses/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerDeleteAddress
     * @summary Delete delivery address
     * @request DELETE:/api/customers/addresses/{id}
     * @secure
     * @response `200` `void` Address deleted successfully
     * @response `404` `void` Address not found
     */
    customerControllerDeleteAddress: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/customers/addresses/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerGetOrders
     * @summary Get customer orders
     * @request GET:/api/customers/orders
     * @secure
     * @response `200` `void` Return customer orders
     */
    customerControllerGetOrders: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/customers/orders`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name CustomerControllerGetSubscriptions
     * @summary Get customer subscriptions
     * @request GET:/api/customers/subscriptions
     * @secure
     * @response `200` `void` Return customer subscriptions
     */
    customerControllerGetSubscriptions: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/customers/subscriptions`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags system
     * @name SystemControllerHealthCheck
     * @summary Server health check
     * @request GET:/api/ping
     * @response `200` `HealthCheckDto` Server health status
     * @response `503` `void` Server is experiencing issues
     */
    systemControllerHealthCheck: (params: RequestParams = {}) =>
      this.request<HealthCheckDto, void>({
        path: `/api/ping`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags system
     * @name SystemControllerGetVersion
     * @summary Application version information
     * @request GET:/api/version
     * @response `200` `VersionDto` Application version details
     */
    systemControllerGetVersion: (params: RequestParams = {}) =>
      this.request<VersionDto, any>({
        path: `/api/version`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags landing
     * @name LandingControllerSubmitContact
     * @summary Submit contact form
     * @request POST:/api/contact
     * @response `201` `ContactResponseDto` Contact form submitted successfully
     * @response `400` `void` Invalid data format or missing required fields
     * @response `429` `void` Too many requests (rate limiting)
     */
    landingControllerSubmitContact: (
      data: CreateContactDto,
      params: RequestParams = {},
    ) =>
      this.request<ContactResponseDto, void>({
        path: `/api/contact`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags landing
     * @name LandingControllerSubmitContactAlias
     * @summary Submit contact form (alias)
     * @request POST:/api/landing/contact
     * @response `201` `ContactResponseDto` Contact form submitted successfully
     */
    landingControllerSubmitContactAlias: (
      data: CreateContactDto,
      params: RequestParams = {},
    ) =>
      this.request<ContactResponseDto, any>({
        path: `/api/landing/contact`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags landing
     * @name LandingControllerSubscribe
     * @summary Subscribe to newsletter
     * @request POST:/api/subscribe
     * @response `201` `SubscriberResponseDto` Subscription created successfully
     * @response `400` `void` Invalid data format or missing required fields
     * @response `409` `void` Email already subscribed
     * @response `429` `void` Too many requests (rate limiting)
     */
    landingControllerSubscribe: (
      data: CreateSubscriberDto,
      params: RequestParams = {},
    ) =>
      this.request<SubscriberResponseDto, void>({
        path: `/api/subscribe`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags landing
     * @name LandingControllerGetContacts
     * @summary Get contact submissions (admin)
     * @request GET:/api/admin/contacts
     * @secure
     * @response `200` `void` Contacts list returned successfully
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     */
    landingControllerGetContacts: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/admin/contacts`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags landing
     * @name LandingControllerGetSubscribers
     * @summary Get newsletter subscribers (admin)
     * @request GET:/api/admin/subscribers
     * @secure
     * @response `200` `GetSubscribersResponseDto` Subscribers list returned successfully
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     */
    landingControllerGetSubscribers: (params: RequestParams = {}) =>
      this.request<GetSubscribersResponseDto, void>({
        path: `/api/admin/subscribers`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerCreateReferral
     * @summary Submit referral
     * @request POST:/api/referrals
     * @response `201` `ReferralResponseDto` Referral created successfully
     * @response `400` `void` Invalid data format or missing required fields
     * @response `409` `void` Self-referral or already referred
     * @response `429` `void` Too many requests (rate limiting)
     */
    marketingControllerCreateReferral: (
      data: CreateReferralDto,
      params: RequestParams = {},
    ) =>
      this.request<ReferralResponseDto, void>({
        path: `/api/referrals`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerGetReferrals
     * @summary View tracked referrals (admin)
     * @request GET:/api/referrals
     * @secure
     * @response `200` `void` List of referrals returned successfully
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     */
    marketingControllerGetReferrals: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/referrals`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerGetUserReferrals
     * @summary Get referrals for a specific user
     * @request GET:/api/referrals/user/{userId}
     * @secure
     * @response `200` `void` User referrals returned successfully
     * @response `401` `void` Unauthorized
     */
    marketingControllerGetUserReferrals: (
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/referrals/user/${userId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerCreateTestimonial
     * @summary Submit testimonial
     * @request POST:/api/testimonials
     * @response `201` `TestimonialResponseDto` Testimonial submitted successfully
     * @response `400` `void` Invalid data format or missing required fields
     * @response `429` `void` Too many requests (rate limiting)
     */
    marketingControllerCreateTestimonial: (
      data: CreateTestimonialDto,
      params: RequestParams = {},
    ) =>
      this.request<TestimonialResponseDto, void>({
        path: `/api/testimonials`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerGetPublicTestimonials
     * @summary Get approved testimonials (public)
     * @request GET:/api/testimonials/public
     * @response `200` `void` Public testimonials returned successfully
     */
    marketingControllerGetPublicTestimonials: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/testimonials/public`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerGetTestimonials
     * @summary Get all testimonials (admin)
     * @request GET:/api/admin/testimonials
     * @secure
     * @response `200` `GetTestimonialsResponseDto` Testimonials returned successfully
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     */
    marketingControllerGetTestimonials: (
      query?: {
        /**
         * Page number
         * @default 1
         */
        page?: number;
        /**
         * Items per page
         * @default 10
         */
        limit?: number;
        /** Filter by approval status */
        isApproved?: boolean;
        /** Filter by featured status */
        isFeatured?: boolean;
        /** Search term for filtering testimonials */
        search?: string;
        /** Start date for filtering testimonials */
        startDate?: string;
        /** End date for filtering testimonials */
        endDate?: string;
        /**
         * Field to sort testimonials by
         * @example "createdAt"
         */
        sortBy?: string;
        /**
         * Sort order (asc or desc)
         * @default "desc"
         */
        sortOrder?: "asc" | "desc";
      },
      params: RequestParams = {},
    ) =>
      this.request<GetTestimonialsResponseDto, void>({
        path: `/api/admin/testimonials`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerUpdateTestimonialStatus
     * @summary Update testimonial status (admin)
     * @request PATCH:/api/admin/testimonials/{id}
     * @secure
     * @response `200` `TestimonialResponseDto` Testimonial updated successfully
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     * @response `404` `void` Testimonial not found
     */
    marketingControllerUpdateTestimonialStatus: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<TestimonialResponseDto, void>({
        path: `/api/admin/testimonials/${id}`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerGetActivePromotions
     * @summary Get active promotions
     * @request GET:/api/promotions/active
     * @response `200` `void` Active promotions returned successfully
     */
    marketingControllerGetActivePromotions: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/promotions/active`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags marketing
     * @name MarketingControllerApplyPromotion
     * @summary Apply promotion code
     * @request POST:/api/apply-promotion
     * @secure
     * @response `200` `void` Promotion applied successfully
     * @response `400` `void` Invalid promotion code
     * @response `401` `void` Unauthorized
     */
    marketingControllerApplyPromotion: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/apply-promotion`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags corporate
     * @name CorporateControllerCreateQuoteRequest
     * @summary Submit a corporate quote request
     * @request POST:/api/corporate/quote
     * @response `201` `void` Corporate quote request submitted successfully
     * @response `400` `void` Bad Request - Invalid data provided
     */
    corporateControllerCreateQuoteRequest: (
      data: CreateCorporateQuoteDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/corporate/quote`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags corporate
     * @name CorporateControllerGetQuoteRequests
     * @summary Get corporate quote requests (admin)
     * @request GET:/api/corporate/quotes
     * @secure
     * @response `200` `void` Quote requests list returned successfully
     * @response `401` `void` Unauthorized
     * @response `403` `void` Forbidden
     */
    corporateControllerGetQuoteRequests: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/corporate/quotes`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags analytics
     * @name AnalyticsControllerEarnings
     * @summary Get earnings analytics
     * @request GET:/api/analytics/earnings
     * @response `200` `void`
     */
    analyticsControllerEarnings: (
      query?: {
        startDate?: string;
        endDate?: string;
        period?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/analytics/earnings`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags analytics
     * @name AnalyticsControllerOrders
     * @summary Get order analytics
     * @request GET:/api/analytics/orders
     * @response `200` `void`
     */
    analyticsControllerOrders: (
      query?: {
        period?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/analytics/orders`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags analytics
     * @name AnalyticsControllerRevenueHistory
     * @summary Get revenue history data
     * @request GET:/api/analytics/revenue-history
     * @response `200` `void`
     */
    analyticsControllerRevenueHistory: (
      query?: {
        months?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/analytics/revenue-history`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags support
     * @name SupportControllerCreateTicket
     * @summary Create a new support ticket
     * @request POST:/api/support/ticket
     * @secure
     * @response `201` `TicketDto` Ticket created successfully.
     */
    supportControllerCreateTicket: (
      data: CreateTicketDto,
      params: RequestParams = {},
    ) =>
      this.request<TicketDto, any>({
        path: `/api/support/ticket`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags support
     * @name SupportControllerGetMyTickets
     * @summary Get all support tickets for the current user
     * @request GET:/api/support/tickets
     * @secure
     * @response `200` `(TicketDto)[]` Returns all support tickets for the user.
     */
    supportControllerGetMyTickets: (params: RequestParams = {}) =>
      this.request<TicketDto[], any>({
        path: `/api/support/tickets`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags upload
     * @name UploadControllerUploadImage
     * @summary Upload image
     * @request POST:/api/upload/image
     * @secure
     * @response `201` `void`
     */
    uploadControllerUploadImage: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/upload/image`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags upload
     * @name UploadControllerDelete
     * @summary Delete uploaded image
     * @request DELETE:/api/upload/image/{publicId}
     * @secure
     * @response `200` `void`
     */
    uploadControllerDelete: (publicId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/upload/image/${publicId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerSeedDummyData
     * @summary Seed all dummy data (legacy endpoint)
     * @request POST:/api/seeder/seedDummyData
     * @response `200` `void` Seeding completed
     */
    seederControllerSeedDummyData: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/seeder/seedDummyData`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Execute all seeding phases with optional configuration. Supports different profiles and incremental seeding.
     *
     * @tags seeder
     * @name SeederControllerSeedAll
     * @summary Seed all data with configuration
     * @request POST:/api/seeder/seed
     * @response `200` `SeederSummaryDto` Comprehensive seeding completed successfully
     * @response `400` `void` Invalid configuration provided
     * @response `500` `void` Seeding failed with errors
     */
    seederControllerSeedAll: (
      data?: {
        /**
         * Predefined data volume profile
         * @example "standard"
         */
        profile?: "minimal" | "standard" | "extensive";
        /**
         * Add data without cleaning existing collections
         * @example false
         */
        incremental?: boolean;
        /**
         * Skip cleanup phase entirely
         * @example false
         */
        skipCleanup?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SeederSummaryDto, void>({
        path: `/api/seeder/seed`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerSeedPhase
     * @summary Seed specific phase
     * @request POST:/api/seeder/phase/{phaseName}
     * @response `200` `void` Phase seeding completed
     */
    seederControllerSeedPhase: (
      phaseName:
        | "core"
        | "partner"
        | "customer"
        | "transaction"
        | "communication"
        | "marketing"
        | "support",
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/seeder/phase/${phaseName}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerCleanPhase
     * @summary Clean specific phase data
     * @request DELETE:/api/seeder/phase/{phaseName}
     * @response `204` `void` Phase data cleaned
     */
    seederControllerCleanPhase: (
      phaseName: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/seeder/phase/${phaseName}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerSeedProfile
     * @summary Seed data using predefined profile
     * @request POST:/api/seeder/profile/{profileName}
     * @response `200` `void` Profile seeding completed
     */
    seederControllerSeedProfile: (
      profileName: "minimal" | "standard" | "extensive",
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/seeder/profile/${profileName}`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Monitor real-time seeding progress, current phase, and completion estimates
     *
     * @tags seeder
     * @name SeederControllerGetStatus
     * @summary Get current seeding status
     * @request GET:/api/seeder/status
     * @response `200` `SeederStatusDto` Current seeding status with progress information
     */
    seederControllerGetStatus: (params: RequestParams = {}) =>
      this.request<SeederStatusDto, any>({
        path: `/api/seeder/status`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerGetConfig
     * @summary Get current seeder configuration
     * @request GET:/api/seeder/config
     * @response `200` `void` Current configuration
     */
    seederControllerGetConfig: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/seeder/config`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerUpdateConfig
     * @summary Update seeder configuration
     * @request POST:/api/seeder/config
     * @response `200` `void` Configuration updated
     */
    seederControllerUpdateConfig: (
      data: {
        profile?: string;
        imageStrategy?: object;
        geographic?: object;
        volumes?: object;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/seeder/config`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Comprehensive validation of data relationships, business logic, and integrity constraints
     *
     * @tags seeder
     * @name SeederControllerValidateData
     * @summary Validate seeded data integrity
     * @request GET:/api/seeder/validate
     * @response `200` `ValidationResultDto` Data validation results with errors and warnings
     */
    seederControllerValidateData: (params: RequestParams = {}) =>
      this.request<ValidationResultDto, any>({
        path: `/api/seeder/validate`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerGetStats
     * @summary Get collection statistics
     * @request GET:/api/seeder/stats
     * @response `200` `void` Collection statistics
     */
    seederControllerGetStats: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/seeder/stats`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerCleanAll
     * @summary Clean all seeded data
     * @request DELETE:/api/seeder/all
     * @response `204` `void` All data cleaned
     */
    seederControllerCleanAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/seeder/all`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerGetAvailablePhases
     * @summary Get available seeding phases
     * @request GET:/api/seeder/phases
     * @response `200` `void` List of available phases
     */
    seederControllerGetAvailablePhases: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/seeder/phases`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seeder
     * @name SeederControllerGetAvailableProfiles
     * @summary Get available seeding profiles
     * @request GET:/api/seeder/profiles
     * @response `200` `void` List of available profiles
     */
    seederControllerGetAvailableProfiles: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/seeder/profiles`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerCreateConversation
     * @summary Create a new conversation
     * @request POST:/api/chat/conversations
     * @secure
     * @response `201` `Conversation` Conversation created successfully
     */
    chatControllerCreateConversation: (
      data: CreateConversationDto,
      params: RequestParams = {},
    ) =>
      this.request<Conversation, any>({
        path: `/api/chat/conversations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerGetConversations
     * @summary Get all conversations for the current user
     * @request GET:/api/chat/conversations
     * @secure
     * @response `200` `(Conversation)[]` Returns all conversations for the user
     */
    chatControllerGetConversations: (params: RequestParams = {}) =>
      this.request<Conversation[], any>({
        path: `/api/chat/conversations`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerGetConversationById
     * @summary Get conversation by ID
     * @request GET:/api/chat/conversations/{id}
     * @secure
     * @response `200` `Conversation` Returns the conversation
     */
    chatControllerGetConversationById: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<Conversation, any>({
        path: `/api/chat/conversations/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerSendMessage
     * @summary Send a new message
     * @request POST:/api/chat/messages
     * @secure
     * @response `201` `ChatMessage` Message sent successfully
     */
    chatControllerSendMessage: (
      data: SendMessageDto,
      params: RequestParams = {},
    ) =>
      this.request<ChatMessage, any>({
        path: `/api/chat/messages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerGetMessages
     * @summary Get messages for a conversation
     * @request GET:/api/chat/conversations/{id}/messages
     * @secure
     * @response `200` `(ChatMessage)[]` Returns messages for the conversation
     */
    chatControllerGetMessages: (
      id: string,
      query?: {
        /** Page number */
        page?: number;
        /** Messages per page */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChatMessage[], any>({
        path: `/api/chat/conversations/${id}/messages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerMarkMessagesAsRead
     * @summary Mark messages as read
     * @request PUT:/api/chat/messages/read
     * @secure
     * @response `200` `void` Messages marked as read successfully
     */
    chatControllerMarkMessagesAsRead: (
      data: UpdateMessageStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/chat/messages/read`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerDeleteMessage
     * @summary Delete a message
     * @request DELETE:/api/chat/messages/{id}
     * @secure
     * @response `200` `void` Message deleted successfully
     */
    chatControllerDeleteMessage: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/chat/messages/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerEditMessage
     * @summary Edit a message
     * @request PUT:/api/chat/messages/{id}
     * @secure
     * @response `200` `ChatMessage` Message edited successfully
     */
    chatControllerEditMessage: (
      id: string,
      data: {
        content?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChatMessage, any>({
        path: `/api/chat/messages/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerSetTypingIndicator
     * @summary Set typing indicator
     * @request POST:/api/chat/typing
     * @secure
     * @response `200` `void` Typing indicator set successfully
     */
    chatControllerSetTypingIndicator: (
      data: {
        conversationId?: string;
        isTyping?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/chat/typing`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerGetTypingIndicators
     * @summary Get typing indicators for a conversation
     * @request GET:/api/chat/conversations/{id}/typing
     * @secure
     * @response `200` `(TypingIndicator)[]` Returns typing indicators
     */
    chatControllerGetTypingIndicators: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<TypingIndicator[], any>({
        path: `/api/chat/conversations/${id}/typing`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerGetOfflineMessages
     * @summary Get offline messages for sync
     * @request GET:/api/chat/offline/messages
     * @secure
     * @response `200` `(ChatMessage)[]` Returns offline messages
     */
    chatControllerGetOfflineMessages: (
      query: {
        /** Last sync timestamp */
        lastSyncTime: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChatMessage[], any>({
        path: `/api/chat/offline/messages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatControllerSyncOfflineMessages
     * @summary Sync offline messages
     * @request POST:/api/chat/offline/sync
     * @secure
     * @response `200` `(ChatMessage)[]` Messages synced successfully
     */
    chatControllerSyncOfflineMessages: (
      data: ChatMessage[],
      params: RequestParams = {},
    ) =>
      this.request<ChatMessage[], any>({
        path: `/api/chat/offline/sync`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * No description
 *
 * @tags chat
 * @name ChatControllerGetConversationStats
 * @summary Get conversation statistics
 * @request GET:/api/chat/conversations/{id}/stats
 * @secure
 * @response `200` `{
    totalMessages?: number,
    unreadCount?: number,
  \** @format date-time *\
    lastActivity?: string,
    participants?: number,

}` Returns conversation statistics
 */
    chatControllerGetConversationStats: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          totalMessages?: number;
          unreadCount?: number;
          /** @format date-time */
          lastActivity?: string;
          participants?: number;
        },
        any
      >({
        path: `/api/chat/conversations/${id}/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewControllerCreateRestaurantReview
     * @summary Create restaurant review
     * @request POST:/api/reviews/restaurant/{restaurantId}
     * @secure
     * @response `201` `void` Review created successfully
     * @response `400` `void` Invalid input or already reviewed
     * @response `404` `void` Restaurant not found
     */
    reviewControllerCreateRestaurantReview: (
      restaurantId: string,
      data: CreateReviewDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/reviews/restaurant/${restaurantId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewControllerGetRestaurantReviews
     * @summary Get restaurant reviews
     * @request GET:/api/reviews/restaurant/{restaurantId}
     * @response `200` `void` Return restaurant reviews
     */
    reviewControllerGetRestaurantReviews: (
      restaurantId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reviews/restaurant/${restaurantId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewControllerCreateMenuItemReview
     * @summary Create menu item review
     * @request POST:/api/reviews/menu-item/{itemId}
     * @secure
     * @response `201` `void` Review created successfully
     * @response `400` `void` Invalid input or already reviewed
     * @response `404` `void` Menu item not found
     */
    reviewControllerCreateMenuItemReview: (
      itemId: string,
      data: CreateReviewDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/reviews/menu-item/${itemId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewControllerGetMenuItemReviews
     * @summary Get menu item reviews
     * @request GET:/api/reviews/menu-item/{itemId}
     * @response `200` `void` Return menu item reviews
     */
    reviewControllerGetMenuItemReviews: (
      itemId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reviews/menu-item/${itemId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewControllerMarkHelpful
     * @summary Mark review as helpful
     * @request PATCH:/api/reviews/{id}/helpful
     * @secure
     * @response `200` `void` Review marked as helpful
     * @response `404` `void` Review not found
     */
    reviewControllerMarkHelpful: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/reviews/${id}/helpful`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewControllerUpdateReview
     * @summary Update review
     * @request PUT:/api/reviews/{id}
     * @secure
     * @response `200` `void` Review updated successfully
     * @response `403` `void` Not authorized to update this review
     * @response `404` `void` Review not found
     */
    reviewControllerUpdateReview: (
      id: string,
      data: CreateReviewDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/reviews/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reviews
     * @name ReviewControllerDeleteReview
     * @summary Delete review
     * @request DELETE:/api/reviews/{id}
     * @secure
     * @response `200` `void` Review deleted successfully
     * @response `403` `void` Not authorized to delete this review
     * @response `404` `void` Review not found
     */
    reviewControllerDeleteReview: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/reviews/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
