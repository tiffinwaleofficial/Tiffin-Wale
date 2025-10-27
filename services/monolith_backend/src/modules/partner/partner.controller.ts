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

@ApiTags("partners")
@Controller("partners")
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly orderService: OrderService,
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
  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner profile" })
  @ApiResponse({ status: 200, description: "Return current partner profile" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async getCurrentProfile(@GetCurrentUser() user: any) {
    return this.partnerService.findByUserId(user.id);
  }

  @Patch("me")
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
    const partner = await this.partnerService.findByUserId(user.id);
    return this.partnerService.update(partner._id.toString(), updatePartnerDto);
  }

  @Get("stats/me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner statistics" })
  @ApiResponse({ status: 200, description: "Return partner statistics" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async getCurrentStats(@GetCurrentUser() user: any) {
    const partner = await this.partnerService.findByUserId(user.id);
    return this.partnerService.getStats(partner._id.toString());
  }

  @Patch("status/me")
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
    const partner = await this.partnerService.findByUserId(user.id);
    return this.partnerService.update(partner._id.toString(), {
      isAcceptingOrders,
    });
  }

  @Get("orders/me")
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
    const partner = await this.partnerService.findByUserId(user.id);
    return this.orderService.findByPartnerId(
      partner._id.toString(),
      Number(page),
      Number(limit),
      status,
    );
  }

  @Get("orders/me/today")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's orders for current partner" })
  @ApiResponse({ status: 200, description: "Return today's orders" })
  async getTodayOrders(@GetCurrentUser() user: any) {
    const partner = await this.partnerService.findByUserId(user.id);
    return this.orderService.getTodayOrdersByPartnerId(partner._id.toString());
  }

  @Get("menu/me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current partner menu" })
  @ApiResponse({ status: 200, description: "Return partner menu" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  async getCurrentMenu(@GetCurrentUser() user: any) {
    const partner = await this.partnerService.findByUserId(user.id);
    return this.partnerService.getMenu(partner._id.toString());
  }

  @Get("reviews/me")
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
    const partner = await this.partnerService.findByUserId(user.id);
    return this.partnerService.getReviews(
      partner._id.toString(),
      Number(page),
      Number(limit),
    );
  }

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
    return this.partnerService.findOne(id);
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
    return this.partnerService.remove(id);
  }
}
