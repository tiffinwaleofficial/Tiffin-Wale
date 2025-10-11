import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("Admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard endpoints
  @Get("dashboard/stats")
  async getDashboardStats(): Promise<any> {
    return this.adminService.getDashboardStats();
  }

  @Get("dashboard/activities")
  async getRecentActivities(@Query("limit") limit = 10): Promise<any[]> {
    return this.adminService.getRecentActivities(Number(limit));
  }

  // Order management
  @Get("orders")
  @ApiOperation({ summary: "Get all orders with filters (admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "Orders returned" })
  async getAllOrders(
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("status") status?: string,
    @Query("search") search?: string,
  ) {
    return this.adminService.getAllOrders(Number(page), Number(limit), {
      status,
      search,
    });
  }

  // Partner management
  @Get("partners")
  @ApiOperation({ summary: "Get all partners with filters (admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "Partners returned" })
  async getAllPartners(
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("status") status?: string,
    @Query("search") search?: string,
  ) {
    return this.adminService.getAllPartners(Number(page), Number(limit), {
      status,
      search,
    });
  }

  // Customer management
  @Get("customers")
  @ApiOperation({ summary: "Get all customers with filters (admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "Customers returned" })
  async getAllCustomers(
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("status") status?: string,
    @Query("search") search?: string,
  ) {
    return this.adminService.getAllCustomers(Number(page), Number(limit), {
      search,
      status,
    });
  }

  @Get("subscriptions")
  @ApiOperation({ summary: "Get all subscriptions with filters (admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Subscriptions returned" })
  async getAllSubscriptions(
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("status") status?: string,
  ) {
    return this.adminService.getAllSubscriptions(Number(page), Number(limit), {
      status,
    });
  }

  @Get("revenue")
  @ApiOperation({ summary: "Get revenue data with filters (admin only)" })
  @ApiResponse({ status: 200, description: "Revenue data returned" })
  async getRevenueData() {
    return this.adminService.getRevenueStats();
  }

  @Get("support/tickets")
  @ApiOperation({ summary: "Get all support tickets (admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "priority", required: false, type: String })
  @ApiResponse({ status: 200, description: "Support tickets returned" })
  async getAllSupportTickets(
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("status") status?: string,
    @Query("priority") priority?: string,
  ) {
    return this.adminService.getAllSupportTickets(Number(page), Number(limit), {
      status,
      priority,
    });
  }

  @Put("support/tickets/:id")
  @ApiOperation({ summary: "Update support ticket status" })
  @ApiParam({ name: "id", description: "Ticket ID" })
  @ApiResponse({ status: 200, description: "Support ticket updated" })
  async updateSupportTicket(
    @Param("id") id: string,
    @Body() body: { status?: string; response?: string; priority?: string },
  ) {
    return this.adminService.updateSupportTicket(id, body, "admin");
  }

  // Analytics endpoints
  @Get("analytics/revenue-history")
  @ApiOperation({ summary: "Get revenue history for analytics" })
  @ApiResponse({ status: 200, description: "Revenue history returned" })
  async getRevenueHistory() {
    return this.adminService.getRevenueStats();
  }
}
