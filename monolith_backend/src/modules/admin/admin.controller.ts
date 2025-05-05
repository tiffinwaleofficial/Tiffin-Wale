import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import {
  SystemStatsDto,
  UserStatsDto,
  OrderStatsDto,
  PartnerStatsDto,
  RevenueStatsDto,
  SystemSettingsDto,
} from "./dto";

@ApiTags("admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get system statistics" })
  @ApiResponse({
    status: 200,
    description: "System statistics",
    type: SystemStatsDto,
  })
  async getSystemStats(): Promise<SystemStatsDto> {
    return this.adminService.getSystemStats();
  }

  @Get("users/stats")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get user statistics" })
  @ApiResponse({
    status: 200,
    description: "User statistics",
    type: UserStatsDto,
  })
  async getUserStats(): Promise<UserStatsDto> {
    return this.adminService.getUserStats();
  }

  @Get("orders/stats")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get order statistics" })
  @ApiResponse({
    status: 200,
    description: "Order statistics",
    type: OrderStatsDto,
  })
  async getOrderStats(): Promise<OrderStatsDto> {
    return this.adminService.getOrderStats();
  }

  @Get("partners/stats")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get partner statistics" })
  @ApiResponse({
    status: 200,
    description: "Partner statistics",
    type: PartnerStatsDto,
  })
  async getPartnerStats(): Promise<PartnerStatsDto> {
    return this.adminService.getPartnerStats();
  }

  @Get("revenue")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get revenue reports" })
  @ApiResponse({
    status: 200,
    description: "Revenue statistics",
    type: RevenueStatsDto,
  })
  async getRevenueStats(): Promise<RevenueStatsDto> {
    return this.adminService.getRevenueStats();
  }

  @Post("settings")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Update system settings" })
  @ApiResponse({ status: 200, description: "System settings updated" })
  async updateSystemSettings(
    @Body() settings: SystemSettingsDto,
  ): Promise<SystemSettingsDto> {
    return this.adminService.updateSystemSettings(settings);
  }
}
