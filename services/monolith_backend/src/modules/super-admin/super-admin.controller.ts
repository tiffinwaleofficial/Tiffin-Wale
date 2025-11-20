import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Res,
} from "@nestjs/common";
import { SuperAdminService } from "./super-admin.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/interfaces/user.interface";
import { UpdatePartnerStatusDto } from "./dto/update-partner-status.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { UpdateCustomerStatusDto } from "./dto/update-customer-status.dto";
import { UpdateCustomerProfileDto } from "../customer/dto/update-customer-profile.dto";
import { CreatePartnerDto } from "../partner/dto/create-partner.dto";
import { CreateNotificationDto } from "../notifications/notifications.service";
import { InviteUserDto } from "./dto/invite-user.dto";

@ApiTags("Super Admin")
@ApiBearerAuth()
@Roles(UserRole.SUPER_ADMIN)
@Controller("super-admin")
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) { }

  @Get("dashboard-stats")
  @ApiOperation({ summary: "Get dashboard stats" })
  @ApiResponse({
    status: 200,
    description: "Dashboard stats retrieved successfully",
  })
  getDashboardStats() {
    return this.superAdminService.getDashboardStats();
  }

  // Partner Management
  @Get("partners")
  @ApiOperation({ summary: "Get all partners" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Partners retrieved successfully" })
  getAllPartners(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("status") status: string,
  ) {
    return this.superAdminService.getAllPartners(page, limit, status);
  }

  @Get("partners/:id")
  @ApiOperation({ summary: "Get partner by ID" })
  @ApiResponse({ status: 200, description: "Partner retrieved successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  getPartnerById(@Param("id") id: string) {
    return this.superAdminService.getPartnerById(id);
  }

  @Put("partners/:id")
  @ApiOperation({ summary: "Update a partner" })
  @ApiResponse({ status: 200, description: "Partner updated successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  updatePartner(
    @Param("id") id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.superAdminService.updatePartner(id, updatePartnerDto);
  }

  @Delete("partners/:id")
  @ApiOperation({ summary: "Delete a partner" })
  @ApiResponse({ status: 200, description: "Partner deleted successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  deletePartner(@Param("id") id: string) {
    return this.superAdminService.deletePartner(id);
  }

  @Patch("partners/:id/status")
  @ApiOperation({ summary: "Update partner status" })
  @ApiResponse({
    status: 200,
    description: "Partner status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  updatePartnerStatus(
    @Param("id") id: string,
    @Body() updatePartnerStatusDto: UpdatePartnerStatusDto,
  ) {
    return this.superAdminService.updatePartnerStatus(
      id,
      updatePartnerStatusDto,
    );
  }

  // Customer Management
  @Get("customers")
  @ApiOperation({ summary: "Get all customers" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Customers retrieved successfully" })
  getAllCustomers(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getAllCustomers(page, limit);
  }

  @Get("customers/:id")
  @ApiOperation({ summary: "Get customer by ID" })
  @ApiResponse({ status: 200, description: "Customer retrieved successfully" })
  @ApiResponse({ status: 404, description: "Customer not found" })
  getCustomerById(@Param("id") id: string) {
    return this.superAdminService.getCustomerById(id);
  }

  @Put("customers/:id")
  @ApiOperation({ summary: "Update a customer" })
  @ApiResponse({ status: 200, description: "Customer updated successfully" })
  @ApiResponse({ status: 404, description: "Customer not found" })
  updateCustomer(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerProfileDto,
  ) {
    return this.superAdminService.updateCustomer(id, updateCustomerDto);
  }

  @Delete("customers/:id")
  @ApiOperation({ summary: "Delete a customer" })
  @ApiResponse({ status: 200, description: "Customer deleted successfully" })
  @ApiResponse({ status: 404, description: "Customer not found" })
  deleteCustomer(@Param("id") id: string) {
    return this.superAdminService.deleteCustomer(id);
  }

  @Patch("customers/:id/status")
  @ApiOperation({ summary: "Update customer status" })
  @ApiResponse({
    status: 200,
    description: "Customer status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Customer not found" })
  updateCustomerStatus(
    @Param("id") id: string,
    @Body() updateCustomerStatusDto: UpdateCustomerStatusDto,
  ) {
    return this.superAdminService.updateCustomerStatus(
      id,
      updateCustomerStatusDto,
    );
  }

  // Order Management
  @Get("orders")
  @ApiOperation({ summary: "Get all orders" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Orders retrieved successfully" })
  getAllOrders(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("status") status: string,
  ) {
    return this.superAdminService.getAllOrders(page, limit, status);
  }

  @Get("orders/:id")
  @ApiOperation({ summary: "Get order by ID" })
  @ApiResponse({ status: 200, description: "Order retrieved successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  getOrderById(@Param("id") id: string) {
    return this.superAdminService.getOrderById(id);
  }

  @Patch("orders/:id/status")
  @ApiOperation({ summary: "Update order status" })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  updateOrderStatus(@Param("id") id: string, @Body() body: { status: string }) {
    return this.superAdminService.updateOrderStatus(id, body.status);
  }

  @Delete("orders/:id")
  @ApiOperation({ summary: "Delete an order" })
  @ApiResponse({ status: 200, description: "Order deleted successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  deleteOrder(@Param("id") id: string) {
    return this.superAdminService.deleteOrder(id);
  }

  // Subscription Management
  @Get("subscriptions")
  @ApiOperation({ summary: "Get all subscriptions" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Subscriptions retrieved successfully",
  })
  getAllSubscriptions(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("status") status: string,
  ) {
    return this.superAdminService.getAllSubscriptions(page, limit, status);
  }

  @Get("subscriptions/active")
  @ApiOperation({ summary: "Get active subscriptions" })
  @ApiResponse({
    status: 200,
    description: "Active subscriptions retrieved successfully",
  })
  getActiveSubscriptions() {
    return this.superAdminService.getActiveSubscriptions();
  }

  @Get("subscriptions/:id")
  @ApiOperation({ summary: "Get subscription by ID" })
  @ApiResponse({
    status: 200,
    description: "Subscription retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Subscription not found" })
  getSubscriptionById(@Param("id") id: string) {
    return this.superAdminService.getSubscriptionById(id);
  }

  @Patch("subscriptions/:id/status")
  @ApiOperation({ summary: "Update subscription status" })
  @ApiResponse({
    status: 200,
    description: "Subscription status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Subscription not found" })
  updateSubscriptionStatus(
    @Param("id") id: string,
    @Body() body: { status: string },
  ) {
    return this.superAdminService.updateSubscriptionStatus(id, body.status);
  }

  @Delete("subscriptions/:id")
  @ApiOperation({ summary: "Delete a subscription" })
  @ApiResponse({
    status: 200,
    description: "Subscription deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Subscription not found" })
  deleteSubscription(@Param("id") id: string) {
    return this.superAdminService.deleteSubscription(id);
  }

  // Support/Ticket Management
  @Get("support/tickets")
  @ApiOperation({ summary: "Get all support tickets" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "priority", required: false, type: String })
  @ApiResponse({ status: 200, description: "Tickets retrieved successfully" })
  getAllSupportTickets(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("status") status: string,
    @Query("priority") priority: string,
  ) {
    const filters = { status, priority };
    return this.superAdminService.getAllSupportTickets(page, limit, filters);
  }

  @Get("support/tickets/:id")
  @ApiOperation({ summary: "Get support ticket by ID" })
  @ApiResponse({ status: 200, description: "Ticket retrieved successfully" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  getTicketById(@Param("id") id: string) {
    return this.superAdminService.getTicketById(id);
  }

  @Patch("support/tickets/:id")
  @ApiOperation({ summary: "Update support ticket" })
  @ApiResponse({ status: 200, description: "Ticket updated successfully" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  updateTicket(@Param("id") id: string, @Body() updates: any) {
    return this.superAdminService.updateTicket(id, updates);
  }

  @Patch("support/tickets/:id/status")
  @ApiOperation({ summary: "Update support ticket status" })
  @ApiResponse({
    status: 200,
    description: "Ticket status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  updateTicketStatus(
    @Param("id") id: string,
    @Body() body: { status: string },
  ) {
    return this.superAdminService.updateTicketStatus(id, body.status);
  }

  @Delete("support/tickets/:id")
  @ApiOperation({ summary: "Delete a support ticket" })
  @ApiResponse({ status: 200, description: "Ticket deleted successfully" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  deleteTicket(@Param("id") id: string) {
    return this.superAdminService.deleteTicket(id);
  }

  // Menu Management
  @Get("menu/items")
  @ApiOperation({ summary: "Get all menu items" })
  @ApiQuery({ name: "partnerId", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Menu items retrieved successfully",
  })
  getAllMenuItems(@Query("partnerId") partnerId: string) {
    const filters = partnerId ? { partnerId } : undefined;
    return this.superAdminService.getAllMenuItems(filters);
  }

  @Post("menu/items")
  @ApiOperation({ summary: "Create menu item" })
  @ApiResponse({ status: 201, description: "Menu item created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  createMenuItem(@Body() data: any) {
    return this.superAdminService.createMenuItem(data);
  }

  @Put("menu/items/:id")
  @ApiOperation({ summary: "Update menu item" })
  @ApiResponse({ status: 200, description: "Menu item updated successfully" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  updateMenuItem(@Param("id") id: string, @Body() data: any) {
    return this.superAdminService.updateMenuItem(id, data);
  }

  @Delete("menu/items/:id")
  @ApiOperation({ summary: "Delete menu item" })
  @ApiResponse({ status: 200, description: "Menu item deleted successfully" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  deleteMenuItem(@Param("id") id: string) {
    return this.superAdminService.deleteMenuItem(id);
  }

  @Get("menu/menus")
  @ApiOperation({ summary: "Get all menus" })
  @ApiQuery({ name: "partnerId", required: false, type: String })
  @ApiQuery({ name: "restaurantId", required: false, type: String })
  @ApiResponse({ status: 200, description: "Menus retrieved successfully" })
  getAllMenus(
    @Query("partnerId") partnerId: string,
    @Query("restaurantId") restaurantId: string,
  ) {
    const filters = { partnerId, restaurantId };
    return this.superAdminService.getAllMenus(filters);
  }

  @Get("menu/menus/:id")
  @ApiOperation({ summary: "Get menu with items by ID" })
  @ApiResponse({ status: 200, description: "Menu retrieved successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  getMenuWithItems(@Param("id") id: string) {
    return this.superAdminService.getMenuWithItems(id);
  }

  // Dashboard & Analytics
  @Get("dashboard/activities")
  @ApiOperation({ summary: "Get recent dashboard activities" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Dashboard activities retrieved successfully",
  })
  getDashboardActivities(@Query("limit") limit: number = 10) {
    return this.superAdminService.getDashboardActivities(Number(limit));
  }

  @Get("analytics/revenue-history")
  @ApiOperation({ summary: "Get revenue history" })
  @ApiQuery({ name: "months", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Revenue history retrieved successfully",
  })
  getRevenueHistory(@Query("months") months: number = 6) {
    return this.superAdminService.getRevenueHistory(Number(months));
  }

  @Get("analytics/earnings")
  @ApiOperation({ summary: "Get earnings data" })
  @ApiQuery({ name: "period", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Earnings data retrieved successfully",
  })
  getEarnings(@Query("period") period: string = "month") {
    return this.superAdminService.getEarningsData(period);
  }

  @Get("analytics/order-stats")
  @ApiOperation({ summary: "Get order statistics" })
  @ApiQuery({ name: "period", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Order statistics retrieved successfully",
  })
  getOrderStats(@Query("period") period: string = "week") {
    return this.superAdminService.getOrderStats(period);
  }

  @Get("analytics/user-growth")
  @ApiOperation({ summary: "Get user growth metrics" })
  @ApiQuery({ name: "months", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "User growth metrics retrieved successfully",
  })
  getUserGrowth(@Query("months") months: number = 6) {
    return this.superAdminService.getUserGrowth(Number(months));
  }

  @Get("analytics/partner-performance")
  @ApiOperation({ summary: "Get partner performance analytics" })
  @ApiQuery({ name: "partnerId", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Partner performance analytics retrieved successfully",
  })
  getPartnerPerformance(@Query("partnerId") partnerId?: string) {
    return this.superAdminService.getPartnerPerformance(partnerId);
  }

  // Partner Management - Create
  @Post("partners")
  @ApiOperation({ summary: "Create a new partner" })
  @ApiResponse({ status: 201, description: "Partner created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  createPartner(@Body() createPartnerDto: CreatePartnerDto) {
    return this.superAdminService.createPartner(createPartnerDto);
  }

  // Revenue & Payouts Management
  @Get("revenue/stats")
  @ApiOperation({ summary: "Get revenue statistics" })
  @ApiResponse({
    status: 200,
    description: "Revenue stats retrieved successfully",
  })
  getRevenueStats() {
    return this.superAdminService.getRevenueStats();
  }

  @Get("payouts")
  @ApiOperation({ summary: "Get all payouts" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Payouts retrieved successfully" })
  getAllPayouts(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("status") status: string,
  ) {
    return this.superAdminService.getAllPayouts(
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get("payouts/:id")
  @ApiOperation({ summary: "Get payout by ID" })
  @ApiResponse({ status: 200, description: "Payout retrieved successfully" })
  @ApiResponse({ status: 404, description: "Payout not found" })
  getPayoutById(@Param("id") id: string) {
    return this.superAdminService.getPayoutById(id);
  }

  @Patch("payouts/:id/status")
  @ApiOperation({ summary: "Update payout status" })
  @ApiResponse({
    status: 200,
    description: "Payout status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Payout not found" })
  updatePayoutStatus(
    @Param("id") id: string,
    @Body() body: { status: string },
  ) {
    return this.superAdminService.updatePayoutStatus(id, body.status);
  }

  // User Management
  @Get("users")
  @ApiOperation({ summary: "Get all users" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  getAllUsers(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getAllUsers(Number(page), Number(limit));
  }

  @Get("users/:id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  getUserById(@Param("id") id: string) {
    return this.superAdminService.getUserById(id);
  }

  @Patch("users/:id")
  @ApiOperation({ summary: "Update a user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  updateUser(@Param("id") id: string, @Body() updateData: any) {
    return this.superAdminService.updateUser(id, updateData);
  }

  @Delete("users/:id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  deleteUser(@Param("id") id: string) {
    return this.superAdminService.deleteUser(id);
  }

  // System Config Management
  @Get("system/config")
  @ApiOperation({ summary: "Get system configuration" })
  @ApiResponse({
    status: 200,
    description: "System configuration retrieved successfully",
  })
  getSystemConfig() {
    return this.superAdminService.getSystemConfig();
  }

  @Patch("system/config")
  @ApiOperation({ summary: "Update system configuration" })
  @ApiResponse({
    status: 200,
    description: "System configuration updated successfully",
  })
  updateSystemConfig(@Body() updates: any) {
    return this.superAdminService.updateSystemConfig(updates);
  }

  @Get("system/stats")
  @ApiOperation({ summary: "Get system statistics" })
  @ApiResponse({
    status: 200,
    description: "System statistics retrieved successfully",
  })
  getSystemStats() {
    return this.superAdminService.getSystemStats();
  }

  @Get("system/health")
  @ApiOperation({ summary: "Get system health check" })
  @ApiResponse({
    status: 200,
    description: "System health check retrieved successfully",
  })
  getSystemHealth() {
    return this.superAdminService.getSystemHealth();
  }

  @Get("system/db-stats")
  @ApiOperation({ summary: "Get database statistics" })
  @ApiResponse({
    status: 200,
    description: "Database statistics retrieved successfully",
  })
  getDatabaseStats() {
    return this.superAdminService.getDatabaseStats();
  }

  @Post("system/commands/clean-db")
  @ApiOperation({ summary: "Clean database collections" })
  @ApiResponse({
    status: 200,
    description: "Database cleaned successfully",
  })
  cleanDatabase(@Body() body: { target: string }) {
    return this.superAdminService.cleanDatabase(body.target);
  }

  @Get("system/collections/:collectionName/documents")
  @ApiOperation({ summary: "Get documents from a collection" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Collection documents retrieved successfully",
  })
  getCollectionDocuments(
    @Param("collectionName") collectionName: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 50,
  ) {
    return this.superAdminService.getCollectionDocuments(
      collectionName,
      Number(page),
      Number(limit),
    );
  }

  @Delete("system/collections/:collectionName/documents")
  @ApiOperation({ summary: "Delete specific documents from a collection" })
  @ApiResponse({
    status: 200,
    description: "Documents deleted successfully",
  })
  deleteCollectionDocuments(
    @Param("collectionName") collectionName: string,
    @Body() body: { ids: string[] },
  ) {
    return this.superAdminService.deleteCollectionDocuments(
      collectionName,
      body.ids,
    );
  }


  // Notifications Management
  @Post("notifications")
  @ApiOperation({ summary: "Broadcast notification" })
  @ApiResponse({
    status: 201,
    description: "Notification broadcasted successfully",
  })
  broadcastNotification(@Body() dto: CreateNotificationDto) {
    return this.superAdminService.broadcastNotification(dto);
  }

  @Get("notifications")
  @ApiOperation({ summary: "Get all notifications" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Notifications retrieved successfully",
  })
  getAllNotifications(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getAllNotifications(
      Number(page),
      Number(limit),
    );
  }

  @Get("notifications/user/:userId")
  @ApiOperation({ summary: "Get notifications for a user" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "User notifications retrieved successfully",
  })
  getUserNotifications(
    @Param("userId") userId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getUserNotifications(
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Patch("notifications/:id/read")
  @ApiOperation({ summary: "Mark notification as read" })
  @ApiResponse({
    status: 200,
    description: "Notification marked as read successfully",
  })
  markNotificationRead(@Param("id") id: string) {
    return this.superAdminService.markNotificationRead(id);
  }

  @Delete("notifications/:id")
  @ApiOperation({ summary: "Delete a notification" })
  @ApiResponse({
    status: 200,
    description: "Notification deleted successfully",
  })
  deleteNotification(@Param("id") id: string) {
    return this.superAdminService.deleteNotification(id);
  }

  // Feedback Management
  @Get("feedback")
  @ApiOperation({ summary: "Get all feedback" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "type", required: false, type: String })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiQuery({ name: "priority", required: false, type: String })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "isResolved", required: false, type: Boolean })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "Feedback retrieved successfully" })
  getAllFeedback(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("type") type: string,
    @Query("category") category: string,
    @Query("priority") priority: string,
    @Query("status") status: string,
    @Query("isResolved") isResolved: string,
    @Query("search") search: string,
  ) {
    return this.superAdminService.getAllFeedback(Number(page), Number(limit), {
      type,
      category,
      priority,
      status,
      isResolved:
        isResolved === "true"
          ? true
          : isResolved === "false"
            ? false
            : undefined,
      search,
    });
  }

  @Get("feedback/:id")
  @ApiOperation({ summary: "Get feedback by ID" })
  @ApiResponse({ status: 200, description: "Feedback retrieved successfully" })
  @ApiResponse({ status: 404, description: "Feedback not found" })
  getFeedbackById(@Param("id") id: string) {
    return this.superAdminService.getFeedbackById(id);
  }

  @Patch("feedback/:id/response")
  @ApiOperation({ summary: "Update feedback response" })
  @ApiResponse({
    status: 200,
    description: "Feedback response updated successfully",
  })
  @ApiResponse({ status: 404, description: "Feedback not found" })
  updateFeedbackResponse(
    @Param("id") id: string,
    @Body() body: { response: string },
  ) {
    return this.superAdminService.updateFeedbackResponse(id, body.response);
  }

  @Get("feedback/user/:userId")
  @ApiOperation({ summary: "Get feedback by user ID" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "User feedback retrieved successfully",
  })
  getFeedbackByUser(
    @Param("userId") userId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getFeedbackByUser(
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Get("feedback/partner/:partnerId")
  @ApiOperation({ summary: "Get feedback by partner ID" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Partner feedback retrieved successfully",
  })
  getFeedbackByPartner(
    @Param("partnerId") partnerId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getFeedbackByPartner(
      partnerId,
      Number(page),
      Number(limit),
    );
  }

  // Payments Management
  @Get("payments/history")
  @ApiOperation({ summary: "Get payment history" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "type", required: false, type: String })
  @ApiQuery({ name: "customerId", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "Payment history retrieved successfully",
  })
  getPaymentHistory(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("status") status: string,
    @Query("type") type: string,
    @Query("customerId") customerId: string,
  ) {
    return this.superAdminService.getPaymentHistory(
      Number(page),
      Number(limit),
      {
        status,
        type,
        customerId,
      },
    );
  }

  @Get("payments/dashboard")
  @ApiOperation({ summary: "Get payment dashboard statistics" })
  @ApiResponse({
    status: 200,
    description: "Payment dashboard stats retrieved successfully",
  })
  getPaymentDashboard() {
    return this.superAdminService.getPaymentDashboard();
  }

  @Get("payments/order/:orderId")
  @ApiOperation({ summary: "Get payments by order ID" })
  @ApiResponse({
    status: 200,
    description: "Payments for order retrieved successfully",
  })
  getPaymentByOrderId(@Param("orderId") orderId: string) {
    return this.superAdminService.getPaymentByOrderId(orderId);
  }

  @Post("payments/verify/:paymentId")
  @ApiOperation({ summary: "Verify a payment" })
  @ApiResponse({ status: 200, description: "Payment verified successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  verifyPayment(@Param("paymentId") paymentId: string) {
    return this.superAdminService.verifyPayment(paymentId);
  }

  @Get("payments/:id")
  @ApiOperation({ summary: "Get payment by ID" })
  @ApiResponse({ status: 200, description: "Payment retrieved successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  getPaymentById(@Param("id") id: string) {
    return this.superAdminService.getPaymentById(id);
  }

  // User Invitation
  @Post("users/invite")
  @ApiOperation({ summary: "Invite a new admin user" })
  @ApiResponse({
    status: 201,
    description: "User invitation sent successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  inviteUser(@Body() inviteUserDto: InviteUserDto) {
    return this.superAdminService.inviteUser(inviteUserDto);
  }

  // Critical Commands
  @Post("system/commands/:command")
  @ApiOperation({ summary: "Execute a critical system command" })
  @ApiResponse({
    status: 200,
    description: "Command executed successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request or unknown command" })
  executeCommand(@Param("command") command: string, @Body() params?: any) {
    return this.superAdminService.executeCommand(command, params);
  }

  // Cron Preferences Management
  @Get("system/crons")
  @ApiOperation({ summary: "Get all cron job preferences" })
  @ApiResponse({
    status: 200,
    description: "Cron preferences retrieved successfully",
  })
  getAllCronPreferences() {
    return this.superAdminService.getAllCronPreferences();
  }

  @Get("system/crons/:name")
  @ApiOperation({ summary: "Get cron preference by name" })
  @ApiResponse({
    status: 200,
    description: "Cron preference retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Cron preference not found" })
  getCronPreferenceByName(@Param("name") name: string) {
    return this.superAdminService.getCronPreferenceByName(name);
  }

  @Patch("system/crons/:name/status")
  @ApiOperation({ summary: "Update cron preference status (enable/disable)" })
  @ApiResponse({
    status: 200,
    description: "Cron preference status updated successfully",
  })
  updateCronPreferenceStatus(
    @Param("name") name: string,
    @Body() body: { enabled: boolean },
  ) {
    return this.superAdminService.updateCronPreferenceStatus(
      name,
      body.enabled,
    );
  }

  @Post("system/crons/:name/trigger")
  @ApiOperation({ summary: "Trigger a cron job manually" })
  @ApiResponse({
    status: 200,
    description: "Cron job triggered successfully",
  })
  @ApiResponse({ status: 404, description: "Cron preference not found" })
  triggerCronPreference(@Param("name") name: string) {
    return this.superAdminService.triggerCronPreference(name);
  }

  @Put("system/crons/:name")
  @ApiOperation({ summary: "Create or update cron preference" })
  @ApiResponse({
    status: 200,
    description: "Cron preference created/updated successfully",
  })
  createOrUpdateCronPreference(@Param("name") name: string, @Body() body: any) {
    return this.superAdminService.createOrUpdateCronPreference(name, body);
  }

  @Delete("system/crons/:name")
  @ApiOperation({ summary: "Delete cron preference" })
  @ApiResponse({
    status: 200,
    description: "Cron preference deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Cron preference not found" })
  deleteCronPreference(@Param("name") name: string) {
    return this.superAdminService.deleteCronPreference(name);
  }

  // Review Management
  @Get("reviews")
  @ApiOperation({ summary: "Get all reviews" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Reviews retrieved successfully" })
  getAllReviews(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getAllReviews(Number(page), Number(limit));
  }

  @Get("reviews/:id")
  @ApiOperation({ summary: "Get review by ID" })
  @ApiResponse({ status: 200, description: "Review retrieved successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  getReviewById(@Param("id") id: string) {
    return this.superAdminService.getReviewById(id);
  }

  @Delete("reviews/:id")
  @ApiOperation({ summary: "Delete a review" })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  deleteReview(@Param("id") id: string) {
    return this.superAdminService.deleteReview(id);
  }

  // Meal Management
  @Get("meals")
  @ApiOperation({ summary: "Get all meals" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Meals retrieved successfully" })
  getAllMeals(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.superAdminService.getAllMeals(Number(page), Number(limit));
  }

  @Get("meals/:id")
  @ApiOperation({ summary: "Get meal by ID" })
  @ApiResponse({ status: 200, description: "Meal retrieved successfully" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  getMealById(@Param("id") id: string) {
    return this.superAdminService.getMealById(id);
  }

  @Post("meals")
  @ApiOperation({ summary: "Create a meal" })
  @ApiResponse({ status: 201, description: "Meal created successfully" })
  createMeal(@Body() data: any) {
    return this.superAdminService.createMeal(data);
  }

  @Put("meals/:id")
  @ApiOperation({ summary: "Update a meal" })
  @ApiResponse({ status: 200, description: "Meal updated successfully" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  updateMeal(@Param("id") id: string, @Body() data: any) {
    return this.superAdminService.updateMeal(id, data);
  }

  @Delete("meals/:id")
  @ApiOperation({ summary: "Delete a meal" })
  @ApiResponse({ status: 200, description: "Meal deleted successfully" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  deleteMeal(@Param("id") id: string) {
    return this.superAdminService.deleteMeal(id);
  }

  // Report Management
  @Get("reports")
  @ApiOperation({ summary: "Get available reports" })
  @ApiResponse({
    status: 200,
    description: "Available reports retrieved successfully",
  })
  getAvailableReports() {
    return this.superAdminService.getAvailableReports();
  }

  @Post("reports/generate")
  @ApiOperation({ summary: "Generate a report (preview, download, or email)" })
  @ApiResponse({
    status: 200,
    description: "Report generated successfully",
  })
  @ApiResponse({ status: 400, description: "Invalid report type or payload" })
  async generateReport(@Body() dto: any, @Res() res: any) {
    const result = await this.superAdminService.generateReport(dto);

    // If action is email, just return success message
    if (dto.action === 'email') {
      return res.json(result);
    }

    // For preview/download, stream the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${result.filename}"`);
    return res.send(result.buffer);
  }

  // Feedback Delete
  @Delete("feedback/:id")
  @ApiOperation({ summary: "Delete feedback" })
  @ApiResponse({ status: 200, description: "Feedback deleted successfully" })
  @ApiResponse({ status: 404, description: "Feedback not found" })
  deleteFeedback(@Param("id") id: string) {
    return this.superAdminService.deleteFeedback(id);
  }
}
