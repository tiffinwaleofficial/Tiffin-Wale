import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

// Core schemas
import { User } from "../user/schemas/user.schema";
import { Partner, PartnerStatus } from "../partner/schemas/partner.schema";
import { UserRole } from "src/common/interfaces/user.interface";

// Menu schemas
import { Category } from "../menu/schemas/category.schema";
import { MenuItem } from "../menu/schemas/menu-item.schema";

// Order and Meal schemas
import { Order } from "../order/schemas/order.schema";
import { Meal, MealType, MealStatus } from "../meal/schemas/meal.schema";
import { OrderStatus } from "src/common/interfaces/order.interface";

// Subscription schemas
import {
  Subscription,
  SubscriptionStatus,
  PaymentFrequency,
} from "../subscription/schemas/subscription.schema";
import {
  SubscriptionPlan,
  DurationType,
  MealFrequency,
} from "../subscription/schemas/subscription-plan.schema";

// Payment schemas
import {
  Payment,
  PaymentStatus,
  PaymentType,
} from "../payment/schemas/payment.schema";
import {
  PaymentMethod,
  PaymentMethodType,
} from "../payment/schemas/payment-method.schema";

// Customer schemas
import { CustomerProfile } from "../customer/schemas/customer-profile.schema";

// Feedback schema
import { Feedback } from "../feedback/schemas/feedback.schema";
import { FeedbackType, FeedbackCategory } from "../feedback/dto/feedback.dto";

// Marketing schemas
import { Testimonial } from "../marketing/schemas/testimonial.schema";
import { Referral } from "../marketing/schemas/referral.schema";
import { CorporateQuote } from "../marketing/schemas/corporate-quote.schema";

// Landing page schemas
import { Contact } from "../landing/schemas/contact.schema";
import { Subscriber } from "../landing/schemas/subscriber.schema";

@Injectable()
export class SeederService {
  // Store created documents for relationships
  private users: User[] = [];
  private partners: Partner[] = [];
  private categories: Category[] = [];
  private menuItems: MenuItem[] = [];
  private customerProfiles: CustomerProfile[] = [];
  private subscriptionPlans: SubscriptionPlan[] = [];
  private subscriptions: Subscription[] = [];
  private orders: Order[] = [];

  constructor(
    // Core models
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Partner.name) private readonly partnerModel: Model<Partner>,

    // Menu models
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,

    // Order and Meal models
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,

    // Subscription models
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(SubscriptionPlan.name)
    private readonly subscriptionPlanModel: Model<SubscriptionPlan>,

    // Payment models
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(PaymentMethod.name)
    private readonly paymentMethodModel: Model<PaymentMethod>,

    // Customer models
    @InjectModel(CustomerProfile.name)
    private readonly customerProfileModel: Model<CustomerProfile>,

    // Feedback model
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,

    // Marketing models
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<Testimonial>,
    @InjectModel(Referral.name) private readonly referralModel: Model<Referral>,
    @InjectModel(CorporateQuote.name)
    private readonly corporateQuoteModel: Model<CorporateQuote>,

    // Landing page models
    @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<Subscriber>,
  ) {}

  async seedDummyData() {
    console.log("🌱 Starting comprehensive database seeding...");

    // Clean all collections first
    await this.cleanAllCollections();

    // Seed in dependency order
    await this.seedUsers();
    await this.seedPartners();
    await this.seedCustomerProfiles();
    await this.seedCategoriesAndMenuItems();
    await this.seedSubscriptionPlans();
    await this.seedSubscriptions();
    await this.seedOrders();
    await this.seedMeals();
    await this.seedPayments();
    await this.seedPaymentMethods();
    await this.seedFeedback();
    await this.seedTestimonials();
    await this.seedReferrals();
    await this.seedCorporateQuotes();
    await this.seedContacts();
    await this.seedSubscribers();

    console.log("✅ Comprehensive database seeding completed successfully!");
    return {
      message: "Comprehensive dummy data seeding completed successfully!",
      summary: {
        users: this.users.length,
        partners: this.partners.length,
        categories: this.categories.length,
        menuItems: this.menuItems.length,
        customerProfiles: this.customerProfiles.length,
        subscriptionPlans: this.subscriptionPlans.length,
        subscriptions: this.subscriptions.length,
        orders: this.orders.length,
      },
    };
  }

  private async cleanAllCollections() {
    console.log("🧹 Cleaning all collections...");
    await Promise.all([
      this.userModel.deleteMany({}),
      this.partnerModel.deleteMany({}),
      this.categoryModel.deleteMany({}),
      this.menuItemModel.deleteMany({}),
      this.orderModel.deleteMany({}),
      this.mealModel.deleteMany({}),
      this.subscriptionModel.deleteMany({}),
      this.subscriptionPlanModel.deleteMany({}),
      this.paymentModel.deleteMany({}),
      this.paymentMethodModel.deleteMany({}),
      this.customerProfileModel.deleteMany({}),
      this.feedbackModel.deleteMany({}),
      this.testimonialModel.deleteMany({}),
      this.referralModel.deleteMany({}),
      this.corporateQuoteModel.deleteMany({}),
      this.contactModel.deleteMany({}),
      this.subscriberModel.deleteMany({}),
    ]);
  }

  private async seedUsers() {
    console.log("👥 Seeding users...");
    const usersToCreate = [];
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash("password", salt);

    // Create admin users
    usersToCreate.push(
      {
        email: "admin@tiffin-wale.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
        firstName: "Admin",
        lastName: "User",
        phoneNumber: "+91-9876543210",
        isActive: true,
      },
      {
        email: "superadmin@tiffin-wale.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        firstName: "Super",
        lastName: "Admin",
        phoneNumber: "+91-9876543211",
        isActive: true,
      },
    );

    // Create business users (restaurant partners)
    for (let i = 0; i < 15; i++) {
      usersToCreate.push({
        email: faker.internet.email(),
        password: hashedPassword,
        role: UserRole.BUSINESS,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        isActive: true,
      });
    }

    // Create customer users
    for (let i = 0; i < 50; i++) {
      usersToCreate.push({
        email: faker.internet.email(),
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        isActive: true,
      });
    }

    try {
      this.users = (await this.userModel.insertMany(usersToCreate)) as User[];
      console.log(`✅ Created ${this.users.length} users`);
    } catch (error) {
      console.error("❌ Error seeding users:", error);
    }
  }

  private async seedPartners() {
    console.log("🏪 Seeding partners...");
    const partnersToCreate = [];
    const businessUsers = this.users.filter(
      (user) => user.role === UserRole.BUSINESS,
    );

    const cuisineTypes = [
      "North Indian",
      "South Indian",
      "Chinese",
      "Italian",
      "Mexican",
      "Thai",
      "Continental",
      "Fast Food",
      "Healthy",
      "Vegan",
    ];

    for (const user of businessUsers) {
      partnersToCreate.push({
        user: user._id,
        businessName: faker.company.name() + " Restaurant",
        description: faker.lorem.paragraph(),
        cuisineTypes: faker.helpers.arrayElements(cuisineTypes, {
          min: 1,
          max: 3,
        }),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          postalCode: faker.location.zipCode(),
          country: "India",
        },
        businessHours: {
          open: "09:00",
          close: "22:00",
          days: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        status: faker.helpers.arrayElement([
          PartnerStatus.APPROVED,
          PartnerStatus.APPROVED,
          PartnerStatus.PENDING,
        ]),
        isAcceptingOrders: true,
        isFeatured: faker.datatype.boolean(0.3), // 30% chance of being featured
        averageRating: faker.number.float({
          min: 3.5,
          max: 5.0,
          fractionDigits: 1,
        }),
        totalReviews: faker.number.int({ min: 10, max: 500 }),
      });
    }

    try {
      this.partners = (await this.partnerModel.insertMany(
        partnersToCreate,
      )) as Partner[];
      console.log(`✅ Created ${this.partners.length} partners`);
    } catch (error) {
      console.error("❌ Error seeding partners:", error);
    }
  }

  private async seedCustomerProfiles() {
    console.log("👤 Seeding customer profiles...");
    const customerProfilesToCreate = [];
    const customerUsers = this.users.filter(
      (user) => user.role === UserRole.CUSTOMER,
    );

    const cities = [
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Kolkata",
    ];
    const colleges = [
      "IIT",
      "NIT",
      "BITS",
      "Delhi University",
      "Mumbai University",
      "Anna University",
    ];
    const branches = [
      "Computer Science",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
    ];
    const dietaryPrefs = [
      "Vegetarian",
      "Vegan",
      "Non-Vegetarian",
      "Jain",
      "Gluten-Free",
    ];
    const cuisines = [
      "North Indian",
      "South Indian",
      "Chinese",
      "Italian",
      "Continental",
    ];

    for (const user of customerUsers) {
      customerProfilesToCreate.push({
        user: user._id,
        city: faker.helpers.arrayElement(cities),
        college: faker.helpers.arrayElement(colleges),
        branch: faker.helpers.arrayElement(branches),
        graduationYear: faker.number.int({ min: 2020, max: 2027 }),
        dietaryPreferences: faker.helpers.arrayElements(dietaryPrefs, {
          min: 1,
          max: 2,
        }),
        favoriteCuisines: faker.helpers.arrayElements(cuisines, {
          min: 1,
          max: 3,
        }),
        preferredPaymentMethods: faker.helpers.arrayElements(
          ["UPI", "Card", "Wallet"],
          { min: 1, max: 2 },
        ),
        deliveryAddresses: [
          {
            name: "Home",
            street: faker.location.streetAddress(),
            city: faker.helpers.arrayElement(cities),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: "India",
            isDefault: true,
          },
          {
            name: "College",
            street: faker.location.streetAddress(),
            city: faker.helpers.arrayElement(cities),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: "India",
            isDefault: false,
          },
        ],
      });
    }

    try {
      this.customerProfiles = (await this.customerProfileModel.insertMany(
        customerProfilesToCreate,
      )) as CustomerProfile[];
      console.log(
        `✅ Created ${this.customerProfiles.length} customer profiles`,
      );
    } catch (error) {
      console.error("❌ Error seeding customer profiles:", error);
    }
  }

  private async seedCategoriesAndMenuItems() {
    console.log("🍽️ Seeding categories and menu items...");
    const categoriesToCreate = [];
    const menuItemsToCreate = [];

    const categoryNames = [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snacks",
      "Beverages",
      "Desserts",
    ];

    for (const partner of this.partners) {
      // Create 3-4 categories per partner
      const partnerCategories = faker.helpers.arrayElements(categoryNames, {
        min: 3,
        max: 4,
      });

      for (const categoryName of partnerCategories) {
        categoriesToCreate.push({
          name: categoryName,
          description: faker.lorem.sentence(),
          businessPartner: partner.user,
          isActive: true,
        });
      }
    }

    try {
      this.categories = (await this.categoryModel.insertMany(
        categoriesToCreate,
      )) as Category[];
      console.log(`✅ Created ${this.categories.length} categories`);

      // Create menu items for each category
      for (const category of this.categories) {
        const partner = this.partners.find(
          (p) => p.user.toString() === category.businessPartner.toString(),
        );
        if (partner) {
          // Create 5-8 menu items per category
          const itemCount = faker.number.int({ min: 5, max: 8 });

          for (let i = 0; i < itemCount; i++) {
            menuItemsToCreate.push({
              name: faker.commerce.productName(),
              description: faker.lorem.sentence(),
              price: faker.number.int({ min: 80, max: 400 }),
              businessPartner: partner.user,
              category: category._id,
              isAvailable: faker.datatype.boolean(0.9), // 90% available
              tags: faker.helpers.arrayElements(
                ["Spicy", "Sweet", "Healthy", "Popular", "New"],
                { min: 1, max: 2 },
              ),
              allergens: faker.helpers.arrayElements(
                ["Nuts", "Dairy", "Gluten"],
                { min: 0, max: 1 },
              ),
              nutritionalInfo: {
                calories: faker.number.int({ min: 200, max: 800 }),
                protein: faker.number.int({ min: 10, max: 50 }),
                carbs: faker.number.int({ min: 20, max: 100 }),
                fat: faker.number.int({ min: 5, max: 40 }),
              },
            });
          }
        }
      }

      this.menuItems = (await this.menuItemModel.insertMany(
        menuItemsToCreate,
      )) as MenuItem[];
      console.log(`✅ Created ${this.menuItems.length} menu items`);
    } catch (error) {
      console.error("❌ Error seeding categories or menu items:", error);
    }
  }

  private async seedSubscriptionPlans() {
    console.log("📋 Seeding subscription plans...");
    const plansToCreate = [
      {
        name: "Basic Daily Plan",
        description: "Perfect for students - one meal per day",
        price: 2500,
        discountedPrice: 2200,
        durationValue: 1,
        durationType: DurationType.MONTH,
        mealFrequency: MealFrequency.DAILY,
        mealsPerDay: 1,
        deliveryFee: 0,
        features: ["One meal per day", "Free delivery", "Flexible timing"],
        maxPauseCount: 5,
        maxSkipCount: 3,
        isActive: true,
      },
      {
        name: "Premium Daily Plan",
        description: "Two meals per day for active students",
        price: 4500,
        discountedPrice: 4000,
        durationValue: 1,
        durationType: DurationType.MONTH,
        mealFrequency: MealFrequency.DAILY,
        mealsPerDay: 2,
        deliveryFee: 0,
        features: ["Two meals per day", "Free delivery", "Priority support"],
        maxPauseCount: 7,
        maxSkipCount: 5,
        isActive: true,
      },
      {
        name: "Weekday Special",
        description: "Perfect for working professionals",
        price: 3000,
        discountedPrice: 2700,
        durationValue: 1,
        durationType: DurationType.MONTH,
        mealFrequency: MealFrequency.WEEKDAYS,
        mealsPerDay: 1,
        deliveryFee: 20,
        features: [
          "Weekday delivery only",
          "Office delivery",
          "Healthy options",
        ],
        maxPauseCount: 3,
        maxSkipCount: 2,
        isActive: true,
      },
      {
        name: "Weekend Feast",
        description: "Special meals for weekends",
        price: 1200,
        durationValue: 1,
        durationType: DurationType.MONTH,
        mealFrequency: MealFrequency.WEEKENDS,
        mealsPerDay: 2,
        deliveryFee: 30,
        features: [
          "Weekend special meals",
          "Family portions",
          "Premium ingredients",
        ],
        maxPauseCount: 2,
        maxSkipCount: 1,
        isActive: true,
      },
    ];

    try {
      this.subscriptionPlans = (await this.subscriptionPlanModel.insertMany(
        plansToCreate,
      )) as SubscriptionPlan[];
      console.log(
        `✅ Created ${this.subscriptionPlans.length} subscription plans`,
      );
    } catch (error) {
      console.error("❌ Error seeding subscription plans:", error);
    }
  }

  private async seedSubscriptions() {
    console.log("📝 Seeding subscriptions...");
    const subscriptionsToCreate = [];
    const customerUsers = this.users.filter(
      (user) => user.role === UserRole.CUSTOMER,
    );

    // Create subscriptions for 60% of customers
    const subscribedCustomers = faker.helpers.arrayElements(
      customerUsers,
      Math.floor(customerUsers.length * 0.6),
    );

    for (const customer of subscribedCustomers) {
      const plan = faker.helpers.arrayElement(this.subscriptionPlans);
      const startDate = faker.date.past({ years: 0.5 });
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + plan.durationValue);

      subscriptionsToCreate.push({
        customer: customer._id,
        plan: plan._id,
        status: faker.helpers.arrayElement([
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.PAUSED,
          SubscriptionStatus.CANCELLED,
        ]),
        startDate,
        endDate,
        autoRenew: faker.datatype.boolean(0.7),
        paymentFrequency: PaymentFrequency.MONTHLY,
        totalAmount: plan.discountedPrice || plan.price,
        discountAmount: plan.discountedPrice
          ? plan.price - plan.discountedPrice
          : 0,
        isPaid: faker.datatype.boolean(0.8),
        customizations: faker.helpers.arrayElements(
          ["No onions", "Less spicy", "Extra rice"],
          { min: 0, max: 2 },
        ),
      });
    }

    try {
      this.subscriptions = (await this.subscriptionModel.insertMany(
        subscriptionsToCreate,
      )) as Subscription[];
      console.log(`✅ Created ${this.subscriptions.length} subscriptions`);
    } catch (error) {
      console.error("❌ Error seeding subscriptions:", error);
    }
  }

  private async seedOrders() {
    console.log("🛒 Seeding orders...");
    const ordersToCreate = [];
    const customerUsers = this.users.filter(
      (user) => user.role === UserRole.CUSTOMER,
    );

    // Create 100-150 orders
    for (let i = 0; i < 120; i++) {
      const customer = faker.helpers.arrayElement(customerUsers);
      const partner = faker.helpers.arrayElement(this.partners);
      const partnerMenuItems = this.menuItems.filter(
        (item) => item.businessPartner.toString() === partner.user.toString(),
      );

      if (partnerMenuItems.length > 0) {
        const orderItems = [];
        const itemCount = faker.number.int({ min: 1, max: 4 });
        const selectedItems = faker.helpers.arrayElements(
          partnerMenuItems,
          itemCount,
        );

        let totalAmount = 0;
        for (const item of selectedItems) {
          const quantity = faker.number.int({ min: 1, max: 3 });
          const price = item.price * quantity;
          totalAmount += price;

          orderItems.push({
            mealId: item._id,
            quantity,
            specialInstructions: faker.helpers.maybe(
              () => faker.lorem.sentence(),
              { probability: 0.3 },
            ),
            price,
          });
        }

        const customerProfile = this.customerProfiles.find(
          (cp) => cp.user.toString() === customer._id.toString(),
        );

        ordersToCreate.push({
          customer: customer._id,
          businessPartner: partner.user,
          items: orderItems,
          totalAmount,
          status: faker.helpers.arrayElement([
            OrderStatus.DELIVERED,
            OrderStatus.DELIVERED,
            OrderStatus.DELIVERED,
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.CANCELLED,
          ]),
          deliveryAddress:
            customerProfile?.deliveryAddresses[0]?.street ||
            faker.location.streetAddress(),
          deliveryInstructions: faker.helpers.maybe(
            () => faker.lorem.sentence(),
            { probability: 0.4 },
          ),
          isPaid: faker.datatype.boolean(0.8),
          paymentDetails: {
            transactionId: faker.string.alphanumeric(12),
            paidAt: faker.date.recent(),
            paymentMethod: faker.helpers.arrayElement([
              "UPI",
              "Card",
              "Wallet",
            ]),
            amount: totalAmount,
          },
          scheduledDeliveryTime: faker.date.soon({ days: 1 }),
          rating: faker.helpers.maybe(
            () => faker.number.int({ min: 3, max: 5 }),
            { probability: 0.6 },
          ),
          review: faker.helpers.maybe(() => faker.lorem.paragraph(), {
            probability: 0.4,
          }),
        });
      }
    }

    try {
      this.orders = (await this.orderModel.insertMany(
        ordersToCreate,
      )) as Order[];
      console.log(`✅ Created ${this.orders.length} orders`);
    } catch (error) {
      console.error("❌ Error seeding orders:", error);
    }
  }

  private async seedMeals() {
    console.log("🍽️ Seeding meals...");
    const mealsToCreate = [];

    // Create meals from active subscriptions
    const activeSubscriptions = this.subscriptions.filter(
      (sub) => sub.status === SubscriptionStatus.ACTIVE,
    );

    for (const subscription of activeSubscriptions) {
      const plan = this.subscriptionPlans.find(
        (p) => p._id.toString() === subscription.plan.toString(),
      );
      if (!plan) continue;

      const partner = faker.helpers.arrayElement(this.partners);
      const partnerMenuItems = this.menuItems.filter(
        (item) => item.businessPartner.toString() === partner.user.toString(),
      );

      // Create meals for the next 7 days
      for (let day = 0; day < 7; day++) {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + day);

        for (let mealIndex = 0; mealIndex < plan.mealsPerDay; mealIndex++) {
          const mealType = mealIndex === 0 ? MealType.LUNCH : MealType.DINNER;
          const selectedMenuItems = faker.helpers.arrayElements(
            partnerMenuItems,
            { min: 1, max: 2 },
          );

          mealsToCreate.push({
            type: mealType,
            scheduledDate,
            menuItems: selectedMenuItems.map((item) => item._id),
            status: faker.helpers.arrayElement([
              MealStatus.SCHEDULED,
              MealStatus.SCHEDULED,
              MealStatus.PREPARING,
              MealStatus.READY,
              MealStatus.DELIVERED,
            ]),
            customer: subscription.customer,
            businessPartner: partner.user,
            businessPartnerName: partner.businessName,
            isRated: faker.datatype.boolean(0.3),
            rating: faker.helpers.maybe(
              () => faker.number.int({ min: 3, max: 5 }),
              { probability: 0.3 },
            ),
            review: faker.helpers.maybe(() => faker.lorem.sentence(), {
              probability: 0.2,
            }),
            deliveryNotes: faker.helpers.maybe(() => faker.lorem.sentence(), {
              probability: 0.2,
            }),
          });
        }
      }
    }

    try {
      await this.mealModel.insertMany(mealsToCreate);
      console.log(`✅ Created ${mealsToCreate.length} meals`);
    } catch (error) {
      console.error("❌ Error seeding meals:", error);
    }
  }

  private async seedPayments() {
    console.log("💳 Seeding payments...");
    const paymentsToCreate = [];

    // Create payments for paid orders
    const paidOrders = this.orders.filter((order) => order.isPaid);
    for (const order of paidOrders) {
      paymentsToCreate.push({
        customerId: order.customer,
        amount: order.totalAmount * 100, // Convert to paise
        currency: "INR",
        status: PaymentStatus.CAPTURED,
        razorpayPaymentId: `pay_${faker.string.alphanumeric(14)}`,
        razorpayOrderId: `order_${faker.string.alphanumeric(14)}`,
        type: PaymentType.ORDER,
        referenceId: order._id,
        method: faker.helpers.arrayElement([
          "card",
          "upi",
          "wallet",
          "netbanking",
        ]),
        paidAt: faker.date.recent(),
      });
    }

    // Create payments for paid subscriptions
    const paidSubscriptions = this.subscriptions.filter((sub) => sub.isPaid);
    for (const subscription of paidSubscriptions) {
      paymentsToCreate.push({
        customerId: subscription.customer,
        amount: subscription.totalAmount * 100, // Convert to paise
        currency: "INR",
        status: PaymentStatus.CAPTURED,
        razorpayPaymentId: `pay_${faker.string.alphanumeric(14)}`,
        razorpayOrderId: `order_${faker.string.alphanumeric(14)}`,
        type: PaymentType.SUBSCRIPTION,
        referenceId: subscription._id,
        method: faker.helpers.arrayElement(["card", "upi", "wallet"]),
        paidAt: faker.date.recent(),
      });
    }

    try {
      await this.paymentModel.insertMany(paymentsToCreate);
      console.log(`✅ Created ${paymentsToCreate.length} payments`);
    } catch (error) {
      console.error("❌ Error seeding payments:", error);
    }
  }

  private async seedPaymentMethods() {
    console.log("💳 Seeding payment methods...");
    const paymentMethodsToCreate = [];
    const customerUsers = this.users.filter(
      (user) => user.role === UserRole.CUSTOMER,
    );

    for (const customer of customerUsers) {
      // 70% chance of having saved payment methods
      if (faker.datatype.boolean(0.7)) {
        const methodCount = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < methodCount; i++) {
          const type = faker.helpers.arrayElement([
            PaymentMethodType.CARD,
            PaymentMethodType.UPI,
            PaymentMethodType.WALLET,
          ]);

          let paymentMethod: any = {
            customerId: customer._id,
            type,
            isDefault: i === 0,
            tokenId: faker.string.alphanumeric(24),
            isValid: faker.datatype.boolean(0.95),
          };

          switch (type) {
            case PaymentMethodType.CARD:
              paymentMethod = {
                ...paymentMethod,
                last4: faker.finance
                  .creditCardNumber("####-####-####-####")
                  .slice(-4),
                brand: faker.helpers.arrayElement([
                  "Visa",
                  "Mastercard",
                  "RuPay",
                ]),
                expiryMonth: faker.number.int({ min: 1, max: 12 }),
                expiryYear: faker.number.int({ min: 2024, max: 2030 }),
                cardholderName: `${customer.firstName} ${customer.lastName}`,
              };
              break;
            case PaymentMethodType.UPI:
              paymentMethod = {
                ...paymentMethod,
                upiId: `${customer.firstName.toLowerCase()}@${faker.helpers.arrayElement(["paytm", "phonepe", "gpay"])}`,
              };
              break;
            case PaymentMethodType.WALLET:
              paymentMethod = {
                ...paymentMethod,
                walletName: faker.helpers.arrayElement([
                  "Paytm",
                  "PhonePe",
                  "Amazon Pay",
                ]),
              };
              break;
          }

          paymentMethodsToCreate.push(paymentMethod);
        }
      }
    }

    try {
      await this.paymentMethodModel.insertMany(paymentMethodsToCreate);
      console.log(
        `✅ Created ${paymentMethodsToCreate.length} payment methods`,
      );
    } catch (error) {
      console.error("❌ Error seeding payment methods:", error);
    }
  }

  private async seedFeedback() {
    console.log("💬 Seeding feedback...");
    const feedbackToCreate = [];
    const customerUsers = this.users.filter(
      (user) => user.role === UserRole.CUSTOMER,
    );

    for (let i = 0; i < 30; i++) {
      const user = faker.helpers.arrayElement(customerUsers);

      feedbackToCreate.push({
        user: user._id,
        type: faker.helpers.arrayElement(Object.values(FeedbackType)),
        subject: faker.lorem.sentence(),
        message: faker.lorem.paragraphs(2),
        category: faker.helpers.arrayElement(Object.values(FeedbackCategory)),
        priority: faker.helpers.arrayElement([
          "low",
          "medium",
          "high",
          "critical",
        ]),
        status: faker.helpers.arrayElement([
          "new",
          "in-review",
          "addressed",
          "closed",
        ]),
        rating: faker.helpers.maybe(
          () => faker.number.int({ min: 1, max: 5 }),
          { probability: 0.6 },
        ),
        deviceInfo: {
          platform: faker.helpers.arrayElement(["web", "android", "ios"]),
          browser: faker.helpers.arrayElement(["Chrome", "Firefox", "Safari"]),
          device: faker.helpers.arrayElement(["Desktop", "Mobile", "Tablet"]),
          os: faker.helpers.arrayElement([
            "Windows",
            "MacOS",
            "Android",
            "iOS",
          ]),
        },
        isResolved: faker.datatype.boolean(0.6),
      });
    }

    try {
      await this.feedbackModel.insertMany(feedbackToCreate);
      console.log(`✅ Created ${feedbackToCreate.length} feedback entries`);
    } catch (error) {
      console.error("❌ Error seeding feedback:", error);
    }
  }

  private async seedTestimonials() {
    console.log("⭐ Seeding testimonials...");
    const testimonialsToCreate = [];
    const customerUsers = this.users.filter(
      (user) => user.role === UserRole.CUSTOMER,
    );

    for (let i = 0; i < 20; i++) {
      const user = faker.helpers.arrayElement(customerUsers);

      testimonialsToCreate.push({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profession: faker.person.jobTitle(),
        rating: faker.number.int({ min: 4, max: 5 }), // Only good testimonials
        testimonial: faker.lorem.paragraphs(1),
        isApproved: faker.datatype.boolean(0.8),
        isFeatured: faker.datatype.boolean(0.3),
        user: user._id,
        source: faker.helpers.arrayElement(["web", "app", "manual"]),
      });
    }

    try {
      await this.testimonialModel.insertMany(testimonialsToCreate);
      console.log(`✅ Created ${testimonialsToCreate.length} testimonials`);
    } catch (error) {
      console.error("❌ Error seeding testimonials:", error);
    }
  }

  private async seedReferrals() {
    console.log("🔗 Seeding referrals...");
    const referralsToCreate = [];
    const customerUsers = this.users.filter(
      (user) => user.role === UserRole.CUSTOMER,
    );

    for (let i = 0; i < 25; i++) {
      const referrer = faker.helpers.arrayElement(customerUsers);
      const referred = faker.helpers.arrayElement(
        customerUsers.filter((u) => u._id !== referrer._id),
      );

      referralsToCreate.push({
        referrer: referrer._id,
        referrerEmail: referrer.email,
        referredEmail: referred.email,
        referredUser: faker.datatype.boolean(0.6) ? referred._id : undefined,
        status: faker.helpers.arrayElement(["pending", "converted", "expired"]),
        conversionDate: faker.helpers.maybe(() => faker.date.recent(), {
          probability: 0.6,
        }),
        rewards: {
          referrerReward: "₹100 off next order",
          referredReward: "₹100 off first order",
          referrerRewardClaimed: faker.datatype.boolean(0.4),
          referredRewardClaimed: faker.datatype.boolean(0.3),
        },
      });
    }

    try {
      await this.referralModel.insertMany(referralsToCreate);
      console.log(`✅ Created ${referralsToCreate.length} referrals`);
    } catch (error) {
      console.error("❌ Error seeding referrals:", error);
    }
  }

  private async seedCorporateQuotes() {
    console.log("🏢 Seeding corporate quotes...");
    const quotesToCreate = [];

    for (let i = 0; i < 15; i++) {
      quotesToCreate.push({
        companyName: faker.company.name(),
        contactPerson: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        employeeCount: faker.helpers.arrayElement([
          "10-50",
          "50-100",
          "100-500",
          "500+",
        ]),
        requirements: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement([
          "new",
          "contacted",
          "proposal-sent",
          "closed",
        ]),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.5,
        }),
        followUpDate: faker.helpers.maybe(() => faker.date.future(), {
          probability: 0.7,
        }),
      });
    }

    try {
      await this.corporateQuoteModel.insertMany(quotesToCreate);
      console.log(`✅ Created ${quotesToCreate.length} corporate quotes`);
    } catch (error) {
      console.error("❌ Error seeding corporate quotes:", error);
    }
  }

  private async seedContacts() {
    console.log("📞 Seeding contacts...");
    const contactsToCreate = [];

    for (let i = 0; i < 25; i++) {
      contactsToCreate.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phoneNumber: faker.helpers.maybe(() => faker.phone.number(), {
          probability: 0.7,
        }),
        subject: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.8,
        }),
        message: faker.lorem.paragraphs(1),
        source: faker.helpers.arrayElement(["website", "app", "social-media"]),
        status: faker.helpers.arrayElement(["new", "contacted", "resolved"]),
        isResolved: faker.datatype.boolean(0.6),
      });
    }

    try {
      await this.contactModel.insertMany(contactsToCreate);
      console.log(`✅ Created ${contactsToCreate.length} contacts`);
    } catch (error) {
      console.error("❌ Error seeding contacts:", error);
    }
  }

  private async seedSubscribers() {
    console.log("📧 Seeding newsletter subscribers...");
    const subscribersToCreate = [];

    for (let i = 0; i < 100; i++) {
      subscribersToCreate.push({
        email: faker.internet.email(),
        name: faker.helpers.maybe(() => faker.person.fullName(), {
          probability: 0.6,
        }),
        preferences: faker.helpers.arrayElements(
          ["weekly-menu", "offers", "blog-updates"],
          { min: 1, max: 3 },
        ),
        isActive: faker.datatype.boolean(0.9),
        source: faker.helpers.arrayElement([
          "landing-page",
          "app",
          "social-media",
          "referral",
        ]),
      });
    }

    try {
      await this.subscriberModel.insertMany(subscribersToCreate);
      console.log(
        `✅ Created ${subscribersToCreate.length} newsletter subscribers`,
      );
    } catch (error) {
      console.error("❌ Error seeding newsletter subscribers:", error);
    }
  }
}
