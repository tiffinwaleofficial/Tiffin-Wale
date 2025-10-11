import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CustomerService } from "./customer.service";
import { UpdateCustomerProfileDto } from "./dto/update-customer-profile.dto";
import { CreateDeliveryAddressDto } from "./dto/create-delivery-address.dto";
import { UpdateDeliveryAddressDto } from "./dto/update-delivery-address.dto";
import { GetCurrentUser } from "../../common/decorators/user.decorator";

@ApiTags("customers")
@Controller("customers")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get customer profile for authenticated user" })
  @ApiResponse({ status: 200, description: "Return customer profile" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getProfile(@GetCurrentUser("_id") userId: string) {
    return this.customerService.getProfile(userId);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Update customer profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async updateProfile(
    @GetCurrentUser("_id") userId: string,
    @Body() updateCustomerProfileDto: UpdateCustomerProfileDto,
  ) {
    return this.customerService.updateProfile(userId, updateCustomerProfileDto);
  }

  @Get("addresses")
  @ApiOperation({ summary: "Get customer delivery addresses" })
  @ApiResponse({ status: 200, description: "Return delivery addresses" })
  async getAddresses(@GetCurrentUser("_id") userId: string) {
    return this.customerService.getAddresses(userId);
  }

  @Post("addresses")
  @ApiOperation({ summary: "Add new delivery address" })
  @ApiResponse({ status: 201, description: "Address added successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async addAddress(
    @GetCurrentUser("_id") userId: string,
    @Body() createDeliveryAddressDto: CreateDeliveryAddressDto,
  ) {
    return this.customerService.addAddress(userId, createDeliveryAddressDto);
  }

  @Patch("addresses/:id")
  @ApiOperation({ summary: "Update delivery address" })
  @ApiResponse({ status: 200, description: "Address updated successfully" })
  @ApiResponse({ status: 404, description: "Address not found" })
  @ApiParam({ name: "id", description: "Address ID" })
  async updateAddress(
    @Param("id") id: string,
    @Body() updateDeliveryAddressDto: UpdateDeliveryAddressDto,
  ) {
    return this.customerService.updateAddress(id, updateDeliveryAddressDto);
  }

  @Delete("addresses/:id")
  @ApiOperation({ summary: "Delete delivery address" })
  @ApiResponse({ status: 200, description: "Address deleted successfully" })
  @ApiResponse({ status: 404, description: "Address not found" })
  @ApiParam({ name: "id", description: "Address ID" })
  async deleteAddress(@Param("id") id: string) {
    return this.customerService.deleteAddress(id);
  }

  @Get("orders")
  @ApiOperation({ summary: "Get customer orders" })
  @ApiResponse({ status: 200, description: "Return customer orders" })
  async getOrders(@GetCurrentUser("_id") userId: string) {
    return this.customerService.getOrders(userId);
  }

  @Get("subscriptions")
  @ApiOperation({ summary: "Get customer subscriptions" })
  @ApiResponse({ status: 200, description: "Return customer subscriptions" })
  async getSubscriptions(@GetCurrentUser("_id") userId: string) {
    return this.customerService.getSubscriptions(userId);
  }
}
