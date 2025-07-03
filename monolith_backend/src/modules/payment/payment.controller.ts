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
import { PaymentService } from "./payment.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from "./dtos/payment-method.dto";

@ApiTags("payment")
@Controller("payment")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("methods")
  @ApiOperation({ summary: "Create a new payment method" })
  @ApiResponse({
    status: 201,
    description: "The payment method has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Invalid input." })
  createPaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentService.createPaymentMethod(createPaymentMethodDto);
  }

  @Get("methods/customer/:customerId")
  @ApiOperation({ summary: "Get all payment methods for a customer" })
  @ApiResponse({
    status: 200,
    description: "Returns all payment methods for the specified customer.",
  })
  getCustomerPaymentMethods(@Param("customerId") customerId: string) {
    return this.paymentService.getCustomerPaymentMethods(customerId);
  }

  @Get("methods/:id")
  @ApiOperation({ summary: "Get a payment method by ID" })
  @ApiResponse({ status: 200, description: "Returns the payment method." })
  @ApiResponse({ status: 404, description: "Payment method not found." })
  getPaymentMethodById(@Param("id") id: string) {
    return this.paymentService.getPaymentMethodById(id);
  }

  @Patch("methods/:id")
  @ApiOperation({ summary: "Update a payment method" })
  @ApiResponse({
    status: 200,
    description: "The payment method has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "Payment method not found." })
  updatePaymentMethod(
    @Param("id") id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentService.updatePaymentMethod(id, updatePaymentMethodDto);
  }

  @Delete("methods/:id")
  @ApiOperation({ summary: "Delete a payment method" })
  @ApiResponse({
    status: 200,
    description: "The payment method has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Payment method not found." })
  deletePaymentMethod(@Param("id") id: string) {
    return this.paymentService.deletePaymentMethod(id);
  }

  @Patch("methods/:id/set-default")
  @ApiOperation({ summary: "Set a payment method as default" })
  @ApiResponse({
    status: 200,
    description: "The payment method has been set as default.",
  })
  @ApiResponse({ status: 404, description: "Payment method not found." })
  setDefaultPaymentMethod(@Param("id") id: string) {
    return this.paymentService.setDefaultPaymentMethod(id);
  }
}
