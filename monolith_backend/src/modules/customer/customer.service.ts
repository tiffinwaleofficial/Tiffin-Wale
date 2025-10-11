import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../user/schemas/user.schema";
import { Order } from "../order/schemas/order.schema";
import { Subscription } from "../subscription/schemas/subscription.schema";
import { DeliveryAddress } from "./schemas/delivery-address.schema";
import { UpdateCustomerProfileDto } from "./dto/update-customer-profile.dto";
import { CreateDeliveryAddressDto } from "./dto/create-delivery-address.dto";
import { UpdateDeliveryAddressDto } from "./dto/update-delivery-address.dto";

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    @InjectModel(DeliveryAddress.name)
    private deliveryAddressModel: Model<DeliveryAddress>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select("-password")
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateProfile(
    userId: string,
    updateCustomerProfileDto: UpdateCustomerProfileDto,
  ) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateCustomerProfileDto, { new: true })
      .select("-password")
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }

  async getAddresses(userId: string) {
    return this.deliveryAddressModel.find({ userId }).exec();
  }

  async addAddress(
    userId: string,
    createDeliveryAddressDto: CreateDeliveryAddressDto,
  ) {
    const newAddress = new this.deliveryAddressModel({
      ...createDeliveryAddressDto,
      userId,
    });
    return newAddress.save();
  }

  async updateAddress(
    id: string,
    updateDeliveryAddressDto: UpdateDeliveryAddressDto,
  ) {
    const updatedAddress = await this.deliveryAddressModel
      .findByIdAndUpdate(id, updateDeliveryAddressDto, { new: true })
      .exec();

    if (!updatedAddress) {
      throw new NotFoundException(`Delivery address with ID ${id} not found`);
    }

    return updatedAddress;
  }

  async deleteAddress(id: string) {
    const result = await this.deliveryAddressModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Delivery address with ID ${id} not found`);
    }

    return { deleted: true };
  }

  async getOrders(userId: string) {
    return this.orderModel
      .find({ customerId: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSubscriptions(userId: string) {
    return this.subscriptionModel
      .find({ customerId: userId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
