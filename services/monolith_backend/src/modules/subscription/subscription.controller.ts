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
} from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetCurrentUser } from "../../common/decorators/user.decorator";

@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new subscription" })
  @ApiResponse({
    status: 201,
    description: "The subscription has been created successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all subscriptions" })
  @ApiResponse({ status: 200, description: "Return all subscriptions." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get("me/current")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current active subscription for authenticated user",
  })
  @ApiResponse({
    status: 200,
    description: "Return current active subscription.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "No active subscription found." })
  getCurrentSubscription(@GetCurrentUser("_id") userId: string) {
    return this.subscriptionService.getCurrentSubscription(userId);
  }

  @Get("me/all")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all subscriptions for authenticated user" })
  @ApiResponse({
    status: 200,
    description: "Return all user subscriptions.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  getAllUserSubscriptions(@GetCurrentUser("_id") userId: string) {
    return this.subscriptionService.findByCustomer(userId);
  }

  @Get("customer/:customerId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all subscriptions for a customer" })
  @ApiResponse({
    status: 200,
    description: "Return all customer subscriptions.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiParam({ name: "customerId", description: "Customer ID" })
  findByCustomer(@Param("customerId") customerId: string) {
    return this.subscriptionService.findByCustomer(customerId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a specific subscription by ID" })
  @ApiResponse({ status: 200, description: "Return the subscription." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Subscription not found." })
  findOne(@Param("id") id: string) {
    return this.subscriptionService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a subscription" })
  @ApiResponse({
    status: 200,
    description: "The subscription has been updated successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Subscription not found." })
  update(
    @Param("id") id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a subscription" })
  @ApiResponse({
    status: 200,
    description: "The subscription has been deleted successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Subscription not found." })
  remove(@Param("id") id: string) {
    return this.subscriptionService.remove(id);
  }

  @Patch(":id/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancel a subscription" })
  @ApiResponse({
    status: 200,
    description: "The subscription has been cancelled successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Subscription not found." })
  @ApiQuery({
    name: "reason",
    description: "Reason for cancellation",
    required: true,
  })
  cancelSubscription(@Param("id") id: string, @Query("reason") reason: string) {
    return this.subscriptionService.cancelSubscription(id, reason);
  }

  @Patch(":id/pause")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Pause a subscription" })
  @ApiResponse({
    status: 200,
    description: "The subscription has been paused successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Subscription not found." })
  pauseSubscription(@Param("id") id: string) {
    return this.subscriptionService.pauseSubscription(id);
  }

  @Patch(":id/resume")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Resume a paused subscription" })
  @ApiResponse({
    status: 200,
    description: "The subscription has been resumed successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Subscription not found." })
  resumeSubscription(@Param("id") id: string) {
    return this.subscriptionService.resumeSubscription(id);
  }

  @Post(":id/regenerate-orders")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Regenerate orders for an existing subscription" })
  @ApiResponse({
    status: 200,
    description: "Orders regenerated successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Subscription not found." })
  regenerateOrders(@Param("id") id: string) {
    return this.subscriptionService.regenerateOrders(id);
  }
}
