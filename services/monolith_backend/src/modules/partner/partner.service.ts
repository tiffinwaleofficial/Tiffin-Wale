import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Partner } from "./schemas/partner.schema";
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

  async findOne(id: string): Promise<Partner> {
    const partner = await this.partnerModel.findById(id).exec();
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  async getMenu(partnerId: string): Promise<MenuItem[]> {
    // Verify partner exists
    await this.findOne(partnerId);

    return this.menuItemModel
      .find({
        partnerId,
        isActive: true,
      })
      .sort({ category: 1, name: 1 })
      .exec();
  }

  async getSubscriptionPlans(partnerId: string): Promise<SubscriptionPlan[]> {
    await this.findOne(partnerId);
    return this.subscriptionPlanModel
      .find({
        partner: partnerId,
        isActive: true,
      })
      .exec();
  }

  async getReviews(partnerId: string): Promise<Feedback[]> {
    // Verify partner exists
    await this.findOne(partnerId);

    return this.feedbackModel
      .find({
        category: "partner",
        // Note: We'll need to add partnerId field to feedback schema or use a different approach
      })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getStats(partnerId: string): Promise<any> {
    // Verify partner exists
    await this.findOne(partnerId);

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

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.partnerModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return { deleted: true };
  }

  // Email helper methods for partner notifications
  private async sendPartnerWelcomeEmail(partner: any): Promise<void> {
    try {
      await this.emailService.sendPartnerWelcomeEmail({
        name: partner.name || partner.ownerName || "Partner",
        email: partner.email || partner.contactEmail,
        businessName: partner.businessName || partner.name,
        partnerId: partner._id.toString(),
      });
    } catch (error) {
      console.error("Partner welcome email service error:", error);
    }
  }

  async sendNewOrderNotification(orderData: {
    partnerEmail: string;
    partnerName: string;
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number }>;
    deliveryTime: string;
    totalAmount: number;
  }): Promise<void> {
    try {
      await this.emailService.sendPartnerOrderNotification(orderData);
    } catch (error) {
      console.error("Failed to send new order notification email:", error);
    }
  }

  async sendEarningsSummary(partnerData: {
    partnerEmail: string;
    partnerName: string;
    period: string;
    totalEarnings: number;
    totalOrders: number;
    averageOrderValue: number;
  }): Promise<void> {
    try {
      // This would integrate with your earnings calculation logic
      console.log(
        "Earnings summary email would be sent to:",
        partnerData.partnerEmail,
      );
      // await this.emailService.sendEarningsSummary(partnerData);
    } catch (error) {
      console.error("Failed to send earnings summary email:", error);
    }
  }
}
