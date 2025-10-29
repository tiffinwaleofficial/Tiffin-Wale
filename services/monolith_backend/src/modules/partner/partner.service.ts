import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Partner, PartnerStatus } from "./schemas/partner.schema";
import { MenuItem } from "../menu/schemas/menu-item.schema";
import { Feedback } from "../feedback/schemas/feedback.schema";
import { Order } from "../order/schemas/order.schema";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { EmailService } from "../email/email.service";
import { SubscriptionPlan } from "../subscription/schemas/subscription-plan.schema";

interface PartnerFilters {
  cuisineType?: string;
  rating?: number;
  city?: string;
}

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
    private readonly emailService: EmailService,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const createdPartner = new this.partnerModel(createPartnerDto);
    const savedPartner = await createdPartner.save();

    // Send partner welcome email (non-blocking)
    this.sendPartnerWelcomeEmail(savedPartner).catch((error) => {
      console.error("Failed to send partner welcome email:", error);
    });

    return savedPartner;
  }

  async findAll(filters: PartnerFilters = {}): Promise<Partner[]> {
    const query: any = { status: "approved" };

    if (filters.cuisineType) {
      query.cuisineType = { $in: [filters.cuisineType] };
    }

    if (filters.rating) {
      query.rating = { $gte: filters.rating };
    }

    if (filters.city) {
      query.city = { $regex: filters.city, $options: "i" };
    }

    return this.partnerModel.find(query).exec();
  }

  async findAllForSuperAdmin(
    page: number = 1,
    limit: number = 10,
    status?: PartnerStatus,
  ) {
    const query: any = {};
    if (status) {
      query.status = status;
    }
    const partners = await this.partnerModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.partnerModel.countDocuments(query).exec();
    return { partners, total, page, limit };
  }

  async findById(id: string): Promise<Partner> {
    const partner = await this.partnerModel.findById(id).exec();
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  async findByUserId(userId: string): Promise<Partner> {
    const partner = await this.partnerModel.findOne({ user: userId }).exec();
    if (!partner) {
      throw new NotFoundException(`Partner with user ID ${userId} not found`);
    }
    return partner;
  }

  async findByContactPhone(phoneNumber: string): Promise<Partner | null> {
    return this.partnerModel.findOne({ contactPhone: phoneNumber }).exec();
  }

  async countAllPartners(): Promise<number> {
    return this.partnerModel.countDocuments().exec();
  }

  async getMenu(partnerId: string): Promise<MenuItem[]> {
    // Verify partner exists and get user ID
    const partner = await this.findById(partnerId);
    const userId = partner.user?.toString() || partner.user;

    if (!userId) {
      throw new NotFoundException(
        `Partner user ID not found for partner ${partnerId}`,
      );
    }

    // Menu items use businessPartner (user ID), not partnerId
    return this.menuItemModel
      .find({
        businessPartner: userId,
      })
      .sort({ category: 1, name: 1 })
      .exec();
  }

  async getSubscriptionPlans(partnerId: string): Promise<SubscriptionPlan[]> {
    await this.findById(partnerId);
    return this.subscriptionPlanModel
      .find({
        partner: partnerId,
        isActive: true,
      })
      .exec();
  }

  async getReviews(
    partnerId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    reviews: Feedback[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Verify partner exists
    await this.findById(partnerId);

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.feedbackModel
        .find({
          category: "partner",
          // Note: We'll need to add partnerId field to feedback schema or use a different approach
        })
        .populate("user", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.feedbackModel.countDocuments({
        category: "partner",
      }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
    };
  }

  async getStats(partnerId: string): Promise<any> {
    // Verify partner exists
    await this.findById(partnerId);

    const [totalOrders, completedOrders, totalRevenue, averageRating] =
      await Promise.all([
        this.orderModel.countDocuments({ partnerId }),
        this.orderModel.countDocuments({ partnerId, status: "delivered" }),
        this.orderModel.aggregate([
          { $match: { partnerId, status: "delivered" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        this.feedbackModel.aggregate([
          { $match: { category: "partner" } },
          { $group: { _id: null, average: { $avg: "$rating" } } },
        ]),
      ]);

    return {
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageRating: averageRating[0]?.average || 0,
      completionRate:
        totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    };
  }

  async update(
    id: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    const updatedPartner = await this.partnerModel
      .findByIdAndUpdate(id, updatePartnerDto, { new: true })
      .exec();

    if (!updatedPartner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return updatedPartner;
  }

  async delete(id: string): Promise<void> {
    const result = await this.partnerModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
  }

  private async sendPartnerWelcomeEmail(partner: Partner): Promise<void> {
    // Use the integrated EmailService's sendPartnerWelcomeEmail method
    if (partner.contactEmail) {
      try {
        await this.emailService.sendPartnerWelcomeEmail({
          email: partner.contactEmail,
          name: partner.businessName,
          businessName: partner.businessName,
          partnerId: partner._id.toString(),
        });
      } catch (error) {
        console.error("Failed to send partner welcome email:", error);
      }
    }
  }
}
