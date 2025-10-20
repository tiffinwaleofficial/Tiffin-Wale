import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentMethod } from "./schemas/payment-method.schema";
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from "./dtos/payment-method.dto";
import { EmailService } from "../email/email.service";

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<PaymentMethod>,
    private readonly emailService: EmailService,
  ) {}

  async createPaymentMethod(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    // If this is set as default, unset any existing default for this customer
    if (createPaymentMethodDto.isDefault) {
      await this.paymentMethodModel.updateMany(
        { customerId: createPaymentMethodDto.customerId },
        { isDefault: false },
      );
    }

    const paymentMethod = new this.paymentMethodModel(createPaymentMethodDto);
    return paymentMethod.save();
  }

  async getCustomerPaymentMethods(
    customerId: string,
  ): Promise<PaymentMethod[]> {
    return this.paymentMethodModel.find({ customerId, isValid: true }).exec();
  }

  async getPaymentMethodById(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodModel.findById(id).exec();
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID "${id}" not found`);
    }
    return paymentMethod;
  }

  async updatePaymentMethod(
    id: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    // If setting as default, unset any existing default for this customer
    if (updatePaymentMethodDto.isDefault) {
      const paymentMethod = await this.getPaymentMethodById(id);
      await this.paymentMethodModel.updateMany(
        { customerId: paymentMethod.customerId, _id: { $ne: id } },
        { isDefault: false },
      );
    }

    const updatedPaymentMethod = await this.paymentMethodModel
      .findByIdAndUpdate(id, updatePaymentMethodDto, { new: true })
      .exec();

    if (!updatedPaymentMethod) {
      throw new NotFoundException(`Payment method with ID "${id}" not found`);
    }

    return updatedPaymentMethod;
  }

  async deletePaymentMethod(id: string): Promise<void> {
    const result = await this.paymentMethodModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Payment method with ID "${id}" not found`);
    }
  }

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.getPaymentMethodById(id);

    // Unset any existing default payment methods for this customer
    await this.paymentMethodModel.updateMany(
      { customerId: paymentMethod.customerId, _id: { $ne: id } },
      { isDefault: false },
    );

    // Set this payment method as default
    return this.updatePaymentMethod(id, { isDefault: true });
  }

  // Email helper methods for payment notifications
  async sendPaymentSuccessEmail(paymentData: {
    customerName: string;
    customerEmail: string;
    amount: number;
    paymentId: string;
    orderNumber?: string;
    subscriptionId?: string;
    paymentMethod?: string;
  }): Promise<void> {
    try {
      await this.emailService.sendPaymentConfirmation({
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        amount: paymentData.amount,
        paymentId: paymentData.paymentId,
        orderNumber: paymentData.orderNumber,
        subscriptionId: paymentData.subscriptionId,
      });
    } catch (error) {
      console.error("Failed to send payment success email:", error);
    }
  }

  async sendPaymentFailureEmail(paymentData: {
    customerName: string;
    customerEmail: string;
    amount: number;
    reason: string;
    retryUrl: string;
  }): Promise<void> {
    try {
      await this.emailService.sendPaymentFailure(paymentData);
    } catch (error) {
      console.error("Failed to send payment failure email:", error);
    }
  }
}
