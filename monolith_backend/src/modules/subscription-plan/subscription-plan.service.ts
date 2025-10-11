import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SubscriptionPlan } from "./schemas/subscription-plan.schema";
import { CreateSubscriptionPlanDto } from "./dto/create-subscription-plan.dto";
import { UpdateSubscriptionPlanDto } from "./dto/update-subscription-plan.dto";

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
  ) {}

  async create(
    createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    const createdPlan = new this.subscriptionPlanModel(
      createSubscriptionPlanDto,
    );
    return createdPlan.save();
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanModel.find().exec();
  }

  async findActive(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<SubscriptionPlan> {
    const plan = await this.subscriptionPlanModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(
    id: string,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    const updatedPlan = await this.subscriptionPlanModel
      .findByIdAndUpdate(id, updateSubscriptionPlanDto, { new: true })
      .exec();

    if (!updatedPlan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    return updatedPlan;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.subscriptionPlanModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    return { deleted: true };
  }
}
