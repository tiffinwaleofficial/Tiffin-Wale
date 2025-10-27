import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

// Core schemas
import { User, UserSchema } from "../user/schemas/user.schema";
import { Partner, PartnerSchema } from "../partner/schemas/partner.schema";

// Menu schemas
import { Category, CategorySchema } from "../menu/schemas/category.schema";
import { MenuItem, MenuItemSchema } from "../menu/schemas/menu-item.schema";

// Order and Meal schemas
import { Order, OrderSchema } from "../order/schemas/order.schema";
import { Meal, MealSchema } from "../meal/schemas/meal.schema";

// Subscription schemas
import {
  Subscription,
  SubscriptionSchema,
} from "../subscription/schemas/subscription.schema";
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from "../subscription/schemas/subscription-plan.schema";

// Payment schemas
import { Payment, PaymentSchema } from "../payment/schemas/payment.schema";
import {
  PaymentMethod,
  PaymentMethodSchema,
} from "../payment/schemas/payment-method.schema";

// Customer schemas
import {
  CustomerProfile,
  CustomerProfileSchema,
} from "../customer/schemas/customer-profile.schema";

// Feedback schema
import { Feedback, FeedbackSchema } from "../feedback/schemas/feedback.schema";

// Marketing schemas
import {
  Testimonial,
  TestimonialSchema,
} from "../marketing/schemas/testimonial.schema";
import { Referral, ReferralSchema } from "../marketing/schemas/referral.schema";
import {
  CorporateQuote,
  CorporateQuoteSchema,
} from "../marketing/schemas/corporate-quote.schema";

// Landing page schemas
import { Contact, ContactSchema } from "../landing/schemas/contact.schema";
import {
  Subscriber,
  SubscriberSchema,
} from "../landing/schemas/subscriber.schema";

// Chat schemas
import {
  Conversation,
  ConversationSchema,
} from "../chat/schemas/conversation.schema";
import {
  ChatMessage,
  ChatMessageSchema,
} from "../chat/schemas/chat-message.schema";
import {
  TypingIndicator,
  TypingIndicatorSchema,
} from "../chat/schemas/typing-indicator.schema";

// Notification schemas
import {
  Notification,
  NotificationSchema,
} from "../notifications/schemas/notification.schema";
import {
  NotificationTemplate,
  NotificationTemplateSchema,
} from "../notifications/schemas/notification-template.schema";
import {
  DeviceRegistration,
  DeviceRegistrationSchema,
} from "../notifications/schemas/device-registration.schema";

// Review schema
import { Review, ReviewSchema } from "../review/schemas/review.schema";

// Email schemas
import { EmailLog, EmailLogSchema } from "../email/schemas/email-log.schema";
import {
  EmailPreference,
  EmailPreferenceSchema,
} from "../email/schemas/email-preference.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      // Core entities
      { name: User.name, schema: UserSchema },
      { name: Partner.name, schema: PartnerSchema },

      // Menu entities
      { name: Category.name, schema: CategorySchema },
      { name: MenuItem.name, schema: MenuItemSchema },

      // Order and Meal entities
      { name: Order.name, schema: OrderSchema },
      { name: Meal.name, schema: MealSchema },

      // Subscription entities
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },

      // Payment entities
      { name: Payment.name, schema: PaymentSchema },
      { name: PaymentMethod.name, schema: PaymentMethodSchema },

      // Customer entities
      { name: CustomerProfile.name, schema: CustomerProfileSchema },

      // Feedback entity
      { name: Feedback.name, schema: FeedbackSchema },

      // Marketing entities
      { name: Testimonial.name, schema: TestimonialSchema },
      { name: Referral.name, schema: ReferralSchema },
      { name: CorporateQuote.name, schema: CorporateQuoteSchema },

      // Landing page entities
      { name: Contact.name, schema: ContactSchema },
      { name: Subscriber.name, schema: SubscriberSchema },

      // Chat entities
      { name: Conversation.name, schema: ConversationSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: TypingIndicator.name, schema: TypingIndicatorSchema },

      // Notification entities
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationTemplate.name, schema: NotificationTemplateSchema },
      { name: DeviceRegistration.name, schema: DeviceRegistrationSchema },

      // Review entity
      { name: Review.name, schema: ReviewSchema },

      // Email entities
      { name: EmailLog.name, schema: EmailLogSchema },
      { name: EmailPreference.name, schema: EmailPreferenceSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
