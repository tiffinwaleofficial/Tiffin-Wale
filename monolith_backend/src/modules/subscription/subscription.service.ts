import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Subscription,
  SubscriptionStatus,
} from "./schemas/subscription.schema";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const newSubscription = new this.subscriptionModel(createSubscriptionDto);
    return newSubscription.save();
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel
      .find()
      .populate("customer")
      .populate("plan")
      .exec();
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findById(id)
      .populate("customer")
      .populate("plan")
      .exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async findByCustomer(customerId: string): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({ customer: customerId })
      .populate("plan")
      .exec();
  }

  async getCurrentSubscription(customerId: string): Promise<Subscription | null> {
    const subscription = await this.subscriptionModel
      .findOne({ 
        customer: customerId,
        status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING] },
        endDate: { $gt: new Date() }
      })
      .populate("plan")
      .sort({ createdAt: -1 })
      .exec();

    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    if (Object.keys(updateSubscriptionDto).length === 0) {
      throw new BadRequestException("Update data cannot be empty");
    }

    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(id, updateSubscriptionDto, { new: true })
      .populate("customer")
      .populate("plan")
      .exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.subscriptionModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return { deleted: true };
  }

  async cancelSubscription(id: string, reason: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException("Subscription is already cancelled");
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    subscription.autoRenew = false;

    return subscription.save();
  }

  async pauseSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status === SubscriptionStatus.PAUSED) {
      throw new BadRequestException("Subscription is already paused");
    }

    subscription.status = SubscriptionStatus.PAUSED;

    return subscription.save();
  }

  async resumeSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException("Only paused subscriptions can be resumed");
    }

    subscription.status = SubscriptionStatus.ACTIVE;

    return subscription.save();
  }
}
