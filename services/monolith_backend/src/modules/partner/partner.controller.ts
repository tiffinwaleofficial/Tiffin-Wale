import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { GetCurrentUser } from "../../common/decorators/user.decorator";
import { PartnerService } from "./partner.service";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { OrderService } from "../order/order.service";
import { UserService } from "../user/user.service";
import { BadRequestException } from "@nestjs/common";
import { SubscriptionService } from "../subscription/subscription.service";
import { CustomerProfileService } from "../customer/customer-profile.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "../order/schemas/order.schema";

@ApiTags("partners")
@Controller("partners")
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly customerProfileService: CustomerProfileService,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new partner" })
  @ApiResponse({ status: 201, description: "Partner created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  // Partner Self-Management Endpoints (must come before :id routes)
  @Get("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner profile" })
  @ApiResponse({ status: 200, description: "Return current partner profile" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async getCurrentProfile(@GetCurrentUser() user: any) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);

    // Get full user information
    const fullUser = await this.userService.findById(userId);

    // Return combined partner and user data
    return {
      ...partner.toObject(),
      user: {
        id: fullUser._id,
        email: fullUser.email,
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        phoneNumber: fullUser.phoneNumber,
        phoneVerified: fullUser.phoneVerified,
        profileImage: fullUser.profileImage,
        isActive: fullUser.isActive,
      },
    };
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current partner profile" })
  @ApiResponse({ status: 200, description: "Partner updated successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async updateCurrentProfile(
    @GetCurrentUser() user: any,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    return this.partnerService.update(partner._id.toString(), updatePartnerDto);
  }

  @Patch("notification-preferences")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update partner notification preferences" })
  @ApiResponse({ status: 200, description: "Preferences updated successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async updateNotificationPreferences(
    @GetCurrentUser() user: any,
    @Body()
    preferences: {
      pushEnabled?: boolean;
      orders?: boolean;
      payments?: boolean;
      reminders?: boolean;
      updates?: boolean;
      marketing?: boolean;
    },
  ) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    if (!partner) {
      throw new NotFoundException("Partner profile not found");
    }

    // Update notification preferences
    const updatedPartner = await this.partnerService.update(
      partner._id.toString(),
      {
        notificationPreferences: {
          ...partner.notificationPreferences,
          ...preferences,
        },
      } as any,
    );

    return {
      success: true,
      preferences: updatedPartner.notificationPreferences,
    };
  }

  @Get("my-stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner statistics" })
  @ApiResponse({ status: 200, description: "Return partner statistics" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async getCurrentStats(@GetCurrentUser() user: any) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    return this.partnerService.getStats(partner._id.toString());
  }

  @Patch("my-status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current partner accepting orders status" })
  @ApiResponse({ status: 200, description: "Status updated successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async updateAcceptingStatus(
    @GetCurrentUser() user: any,
    @Body("isAcceptingOrders") isAcceptingOrders: boolean,
  ) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    return this.partnerService.update(partner._id.toString(), {
      isAcceptingOrders,
    });
  }

  @Get("my-orders")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner orders" })
  @ApiResponse({ status: 200, description: "Return partner orders" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  async getCurrentPartnerOrders(
    @GetCurrentUser() user: any,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("status") status?: string,
  ) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    return this.orderService.findByPartnerId(
      partner._id.toString(),
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get("my-orders/today")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's orders for current partner" })
  @ApiResponse({ status: 200, description: "Return today's orders" })
  async getTodayOrders(@GetCurrentUser() user: any) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    return this.orderService.getTodayOrdersByPartnerId(partner._id.toString());
  }

  @Get("my-menu")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner menu" })
  @ApiResponse({ status: 200, description: "Return partner menu" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async getCurrentMenu(@GetCurrentUser() user: any) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    return this.partnerService.getMenu(partner._id.toString());
  }

  @Get("my-reviews")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner reviews" })
  @ApiResponse({ status: 200, description: "Return partner reviews" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getCurrentReviews(
    @GetCurrentUser() user: any,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    // Handle both _id (from Mongoose) and id (from transformed JWT)
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }
    const partner = await this.partnerService.findByUserId(userId);
    return this.partnerService.getReviews(
      partner._id.toString(),
      Number(page),
      Number(limit),
    );
  }

  // ==================== CUSTOMER MANAGEMENT ENDPOINTS ====================
  // IMPORTANT: Must come BEFORE generic :id routes to avoid route conflicts

  @Get("my-customers")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all customers subscribed to current partner" })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["active", "paused", "cancelled"],
    description: "Filter by subscription status",
  })
  @ApiResponse({ status: 200, description: "Customers retrieved successfully" })
  async getMyCustomers(
    @GetCurrentUser() user: any,
    @Query("status") status?: string,
  ) {
    // Extract user ID from JWT (decoded from Bearer token)
    const userId = user?._id || user?.id || (user as any).sub;
    if (!userId) {
      throw new BadRequestException("User ID not found in token");
    }

    // Get partner by user ID
    const partner = await this.partnerService.findByUserId(userId);
    if (!partner) {
      throw new NotFoundException("Partner profile not found");
    }

    // Get subscriptions for this partner's plans
    const subscriptions = await this.subscriptionService.findByPartner(
      partner._id.toString(),
      status,
    );

    // Build customer list with subscription details
    const customers = await Promise.all(
      subscriptions.map(async (subscription: any) => {
        const customer = await this.userService.findById(
          subscription.customer._id || subscription.customer,
        );

        // Get customer profile for address
        const customerProfile = await this.customerProfileService.findByUserId(
          customer._id.toString(),
        );

        // Get default or first delivery address
        const defaultAddress = customerProfile?.deliveryAddresses?.find(
          (addr: any) => addr.isDefault,
        );
        const address =
          defaultAddress || customerProfile?.deliveryAddresses?.[0];
        const addressString = address
          ? `${address.street}, ${address.city}, ${address.state} ${address.postalCode}`
          : customerProfile?.city || "N/A";

        // Get customer's orders from this partner
        const orders = await this.orderService.findByCustomerAndPartner(
          customer._id.toString(),
          userId,
        );

        return {
          _id: customer._id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: addressString,
          distance: null, // TODO: Calculate distance
          subscriptionStatus: subscription.status,
          planName: subscription.plan?.name || "N/A",
          planPrice: subscription.totalAmount || 0,
          subscribedDate: subscription.startDate,
          totalOrders: orders.length,
          lastOrderDate: orders[0]?.createdAt || null,
        };
      }),
    );

    return customers;
  }

  @Get("customers/:customerId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get specific customer profile" })
  @ApiParam({ name: "customerId", description: "Customer ID" })
  @ApiResponse({ status: 200, description: "Customer profile retrieved" })
  @ApiResponse({ status: 404, description: "Customer not found" })
  async getCustomerProfile(
    @GetCurrentUser() user: any,
    @Param("customerId") customerId: string,
  ) {
    // Extract user ID from JWT (decoded from Bearer token)
    const userId = user?._id || user?.id || (user as any).sub;
    if (!userId) {
      throw new BadRequestException("User ID not found in token");
    }

    // Get partner
    const partner = await this.partnerService.findByUserId(userId);
    if (!partner) {
      throw new NotFoundException("Partner profile not found");
    }

    // Get customer
    const customer = await this.userService.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // Get customer profile for address
    const customerProfile =
      await this.customerProfileService.findByUserId(customerId);

    // Get default or first delivery address
    const defaultAddress = customerProfile?.deliveryAddresses?.find(
      (addr: any) => addr.isDefault,
    );
    const address = defaultAddress || customerProfile?.deliveryAddresses?.[0];
    const addressString = address
      ? `${address.street}, ${address.city}, ${address.state} ${address.postalCode}`
      : customerProfile?.city || "N/A";

    // Get customer's subscription with this partner
    const subscription =
      await this.subscriptionService.findByCustomerAndPartner(
        customerId,
        partner._id.toString(),
      );

    if (!subscription) {
      throw new NotFoundException(
        "No subscription found for this customer with your business",
      );
    }

    // Get customer's orders
    const orders = await this.orderService.findByCustomerAndPartner(
      customerId,
      userId,
    );

    return {
      _id: customer._id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: addressString,
      subscriptionStatus: subscription.status,
      planName: subscription.plan?.name || "N/A",
      planPrice: subscription.totalAmount || 0,
      subscribedDate: subscription.startDate,
      totalOrders: orders.length,
      lastOrderDate: orders[0]?.createdAt || null,
      subscription: {
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        autoRenew: subscription.autoRenew,
        paymentFrequency: subscription.paymentFrequency,
        nextRenewalDate: subscription.nextRenewalDate,
      },
      orders: orders.slice(0, 10), // Return last 10 orders
    };
  }

  @Get("customers/:customerId/orders")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get customer order history" })
  @ApiParam({ name: "customerId", description: "Customer ID" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page",
  })
  @ApiResponse({ status: 200, description: "Orders retrieved successfully" })
  async getCustomerOrders(
    @GetCurrentUser() user: any,
    @Param("customerId") customerId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    // Extract user ID from JWT (decoded from Bearer token)
    const userId = user?._id || user?.id || (user as any).sub;
    if (!userId) {
      throw new BadRequestException("User ID not found in token");
    }

    // Verify customer exists
    const customer = await this.userService.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // Get orders
    const orders = await this.orderService.findByCustomerAndPartner(
      customerId,
      userId,
      { page, limit },
    );

    return {
      orders,
      pagination: {
        page,
        limit,
        total: orders.length,
      },
    };
  }

  @Get("customers/:customerId/subscription")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get customer subscription details" })
  @ApiParam({ name: "customerId", description: "Customer ID" })
  @ApiResponse({
    status: 200,
    description: "Subscription details retrieved",
  })
  @ApiResponse({ status: 404, description: "Subscription not found" })
  async getCustomerSubscription(
    @GetCurrentUser() user: any,
    @Param("customerId") customerId: string,
  ) {
    // Extract user ID from JWT (decoded from Bearer token)
    const userId = user?._id || user?.id || (user as any).sub;
    if (!userId) {
      throw new BadRequestException("User ID not found in token");
    }

    // Get partner
    const partner = await this.partnerService.findByUserId(userId);
    if (!partner) {
      throw new NotFoundException("Partner profile not found");
    }

    // Get subscription
    const subscription =
      await this.subscriptionService.findByCustomerAndPartner(
        customerId,
        partner._id.toString(),
      );

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return subscription;
  }

  // ==================== PRODUCTION MANAGEMENT ====================
  // IMPORTANT: Must come BEFORE generic :id routes

  @Get("production-summary")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get production summary for a specific date" })
  @ApiQuery({
    name: "date",
    required: false,
    type: String,
    description: "Date in YYYY-MM-DD format (defaults to today)",
  })
  @ApiResponse({ status: 200, description: "Production summary retrieved" })
  async getProductionSummary(
    @GetCurrentUser() user: any,
    @Query("date") date?: string,
  ) {
    const userId = user?._id || user?.id || (user as any).sub;
    if (!userId) {
      throw new BadRequestException("User ID not found in token");
    }

    const partner = await this.partnerService.findByUserId(userId);
    if (!partner) {
      throw new NotFoundException("Partner profile not found");
    }

    // Parse date or use today
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get all orders for this date
    const orders = await this.orderModel
      .find({
        businessPartner: userId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      })
      .populate("subscriptionPlan")
      .populate("customer")
      .exec();

    // Aggregate meal breakdown
    const mealBreakdown = {
      breakfast: orders.filter((o: any) => o.mealType === "breakfast").length,
      lunch: orders.filter((o: any) => o.mealType === "lunch").length,
      dinner: orders.filter((o: any) => o.mealType === "dinner").length,
    };

    // Aggregate ingredients from subscription plans
    const ingredientTotals: any = {
      rotis: 0,
      sabzis: {},
      dal: { total: 0, types: {} },
      rice: { total: 0, types: {} },
      extras: {},
      salad: 0,
      curd: 0,
    };

    orders.forEach((order: any) => {
      const plan = order.subscriptionPlan;
      if (plan?.mealSpecification) {
        const spec = plan.mealSpecification;

        // Rotis
        if (spec.rotis) ingredientTotals.rotis += spec.rotis;

        // Sabzis
        spec.sabzis?.forEach((sabzi: any) => {
          if (!ingredientTotals.sabzis[sabzi.name]) {
            ingredientTotals.sabzis[sabzi.name] = 0;
          }
          ingredientTotals.sabzis[sabzi.name] += 1;
        });

        // Dal
        if (spec.dal) {
          ingredientTotals.dal.total += 1;
          const dalType = spec.dal.type || "mixed";
          ingredientTotals.dal.types[dalType] =
            (ingredientTotals.dal.types[dalType] || 0) + 1;
        }

        // Rice
        if (spec.rice) {
          ingredientTotals.rice.total += 1;
          const riceType = spec.rice.type || "white";
          ingredientTotals.rice.types[riceType] =
            (ingredientTotals.rice.types[riceType] || 0) + 1;
        }

        // Extras
        spec.extras?.forEach((extra: any) => {
          if (extra.included) {
            ingredientTotals.extras[extra.name] =
              (ingredientTotals.extras[extra.name] || 0) + 1;
          }
        });

        // Salad & Curd
        if (spec.salad) ingredientTotals.salad += 1;
        if (spec.curd) ingredientTotals.curd += 1;
      }
    });

    // Plan-wise breakdown
    const planBreakdown: any = {};
    orders.forEach((order: any) => {
      const planName = order.subscriptionPlan?.name || "Unknown Plan";
      if (!planBreakdown[planName]) {
        planBreakdown[planName] = { count: 0, orders: [] };
      }
      planBreakdown[planName].count += 1;
      planBreakdown[planName].orders.push(order._id);
    });

    // Status breakdown
    const statusBreakdown = {
      pending: orders.filter((o: any) => o.status === "pending").length,
      preparing: orders.filter((o: any) => o.status === "preparing").length,
      ready: orders.filter((o: any) => o.status === "ready").length,
      outForDelivery: orders.filter((o: any) => o.status === "out_for_delivery")
        .length,
      delivered: orders.filter((o: any) => o.status === "delivered").length,
    };

    const completionPercentage =
      orders.length > 0
        ? Math.round((statusBreakdown.delivered / orders.length) * 100)
        : 0;

    return {
      date: targetDate.toISOString().split("T")[0],
      totalOrders: orders.length,
      mealBreakdown,
      ingredientTotals,
      planBreakdown,
      statusBreakdown,
      completionPercentage,
    };
  }

  // ==================== GENERIC PARTNER ENDPOINTS ====================
  // IMPORTANT: These must come AFTER all specific routes to prevent conflicts

  @Get()
  @ApiOperation({ summary: "Get all partners/restaurants" })
  @ApiResponse({ status: 200, description: "Return all partners" })
  @ApiQuery({
    name: "cuisineType",
    required: false,
    description: "Filter by cuisine type",
  })
  @ApiQuery({
    name: "rating",
    required: false,
    description: "Filter by minimum rating",
  })
  @ApiQuery({ name: "city", required: false, description: "Filter by city" })
  async findAll(
    @Query("cuisineType") cuisineType?: string,
    @Query("rating") rating?: number,
    @Query("city") city?: string,
  ) {
    return this.partnerService.findAll({ cuisineType, rating, city });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific partner by ID" })
  @ApiResponse({ status: 200, description: "Return the partner" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async findOne(@Param("id") id: string) {
    return this.partnerService.findById(id);
  }

  @Get(":id/menu")
  @ApiOperation({ summary: "Get menu for a specific partner" })
  @ApiResponse({ status: 200, description: "Return partner menu" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async getMenu(@Param("id") id: string) {
    return this.partnerService.getMenu(id);
  }

  @Get(":id/plans")
  @ApiOperation({ summary: "Get subscription plans for a specific partner" })
  @ApiResponse({
    status: 200,
    description: "Return partner subscription plans",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async getSubscriptionPlans(@Param("id") id: string) {
    return this.partnerService.getSubscriptionPlans(id);
  }

  @Get(":id/reviews")
  @ApiOperation({ summary: "Get reviews for a specific partner" })
  @ApiResponse({ status: 200, description: "Return partner reviews" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getReviews(
    @Param("id") id: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.partnerService.getReviews(id, Number(page), Number(limit));
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "Get statistics for a specific partner" })
  @ApiResponse({ status: 200, description: "Return partner statistics" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async getStats(@Param("id") id: string) {
    return this.partnerService.getStats(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a partner" })
  @ApiResponse({ status: 200, description: "Partner updated successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async update(
    @Param("id") id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a partner" })
  @ApiResponse({ status: 200, description: "Partner deleted successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async remove(@Param("id") id: string) {
    return this.partnerService.delete(id);
  }
}
