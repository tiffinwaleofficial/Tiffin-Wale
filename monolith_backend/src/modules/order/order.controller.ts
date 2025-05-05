import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { MarkOrderPaidDto } from "./dto/mark-order-paid.dto";
import { AddOrderReviewDto } from "./dto/add-order-review.dto";

@ApiTags("orders")
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new order" })
  @ApiResponse({ status: 201, description: "Order has been created" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({ status: 200, description: "Return all orders" })
  findAll() {
    return this.orderService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get order by ID" })
  @ApiResponse({ status: 200, description: "Return the order" })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id") id: string) {
    return this.orderService.findById(id);
  }

  @Get("status/:status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get orders by status" })
  @ApiResponse({ status: 200, description: "Return orders by status" })
  findByStatus(@Param("status") status: string) {
    return this.orderService.findByStatus(status as any);
  }

  @Get("customer/:customerId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get orders by customer" })
  @ApiResponse({ status: 200, description: "Return customer orders" })
  findByCustomer(@Param("customerId") customerId: string) {
    return this.orderService.findByCustomer(customerId);
  }

  @Get("partner/:partnerId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get orders by business partner" })
  @ApiResponse({ status: 200, description: "Return partner orders" })
  findByPartner(@Param("partnerId") partnerId: string) {
    return this.orderService.findByPartner(partnerId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update an order" })
  @ApiResponse({ status: 200, description: "Order has been updated" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Order not found" })
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete an order" })
  @ApiResponse({ status: 204, description: "Order has been deleted" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Order not found" })
  remove(@Param("id") id: string) {
    return this.orderService.remove(id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update order status" })
  @ApiResponse({ status: 200, description: "Order status has been updated" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Order not found" })
  updateStatus(
    @Param("id") id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, updateStatusDto);
  }

  @Patch(":id/paid")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark order as paid" })
  @ApiResponse({ status: 200, description: "Order has been marked as paid" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 409, description: "Order is already paid" })
  markAsPaid(
    @Param("id") id: string,
    @Body() markOrderPaidDto: MarkOrderPaidDto,
  ) {
    return this.orderService.markAsPaid(id, markOrderPaidDto);
  }

  @Patch(":id/review")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add review to an order" })
  @ApiResponse({ status: 200, description: "Review has been added" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 409, description: "Order already has a review" })
  addReview(@Param("id") id: string, @Body() addReviewDto: AddOrderReviewDto) {
    return this.orderService.addReview(id, addReviewDto);
  }
}
