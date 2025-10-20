import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CustomerProfile } from "./schemas/customer-profile.schema";

@Injectable()
export class CustomerProfileService {
  constructor(
    @InjectModel(CustomerProfile.name)
    private readonly customerProfileModel: Model<CustomerProfile>,
  ) {}

  async findByUserId(userId: string): Promise<CustomerProfile | null> {
    return this.customerProfileModel.findOne({ user: userId }).exec();
  }

  async create(data: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const profile = new this.customerProfileModel(data);
    return profile.save();
  }

  async update(
    userId: string,
    data: Partial<CustomerProfile>,
  ): Promise<CustomerProfile | null> {
    return this.customerProfileModel
      .findOneAndUpdate({ user: userId }, data, { new: true })
      .exec();
  }

  async delete(userId: string): Promise<boolean> {
    const result = await this.customerProfileModel
      .deleteOne({ user: userId })
      .exec();
    return result.deletedCount > 0;
  }
}
