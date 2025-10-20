import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Feedback, FeedbackDocument } from "./schemas";
import {
  CreateFeedbackDto,
  FeedbackResponseDto,
  FeedbackType,
  FeedbackCategory,
} from "./dto";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  /**
   * Create a new feedback submission
   */
  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
    userId?: string,
  ): Promise<FeedbackResponseDto> {
    // Determine priority based on feedback type and content
    const priority = this.determinePriority(createFeedbackDto);

    // Create the feedback
    const feedback = new this.feedbackModel({
      ...createFeedbackDto,
      priority,
      user: userId,
    });

    await feedback.save();

    return {
      id: feedback._id,
      user: feedback.user,
      type: feedback.type as FeedbackType,
      subject: feedback.subject,
      message: feedback.message,
      category: feedback.category as FeedbackCategory,
      priority: feedback.priority,
      status: feedback.status,
      rating: feedback.rating,
      deviceInfo: feedback.deviceInfo,
      isResolved: feedback.isResolved,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  }

  /**
   * Get feedback list (admin)
   */
  async getFeedbackList(options: {
    page: number;
    limit: number;
    type?: string;
    category?: string;
    priority?: string;
    status?: string;
    isResolved?: boolean;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const {
      page,
      limit,
      type,
      category,
      priority,
      status,
      isResolved,
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    // Build filter
    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (status) {
      filter.status = status;
    }

    if (isResolved !== undefined) {
      filter.isResolved = isResolved;
    }

    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    // Date range
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Count total
    const total = await this.feedbackModel.countDocuments(filter);

    // Get data with pagination and sorting
    const feedbackItems = await this.feedbackModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // Calculate statistics
    const statistics = {
      totalFeedback: total,
      byType: await this.getCountByField("type"),
      byCategory: await this.getCountByField("category"),
      byPriority: await this.getCountByField("priority"),
      byStatus: await this.getCountByField("status"),
      resolved: await this.feedbackModel.countDocuments({ isResolved: true }),
      unresolved: await this.feedbackModel.countDocuments({
        isResolved: false,
      }),
    };

    return {
      feedback: feedbackItems.map((feedback) => ({
        id: feedback._id,
        user: feedback.user,
        type: feedback.type as FeedbackType,
        subject: feedback.subject,
        message: feedback.message,
        category: feedback.category as FeedbackCategory,
        priority: feedback.priority,
        status: feedback.status,
        rating: feedback.rating,
        deviceInfo: feedback.deviceInfo,
        isResolved: feedback.isResolved,
        resolvedAt: feedback.resolvedAt,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
      })),
      statistics,
      total,
      page,
      limit,
    };
  }

  /**
   * Get count by field for statistics
   */
  private async getCountByField(field: string) {
    const results = await this.feedbackModel.aggregate([
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object for easier use
    return results.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  }

  /**
   * Determine priority based on feedback content
   */
  private determinePriority(feedback: CreateFeedbackDto): string {
    // Default priority is medium
    let priority = "medium";

    // Bugs and complaints get higher priority
    if (feedback.type === FeedbackType.BUG) {
      priority = "high";
    } else if (feedback.type === FeedbackType.COMPLAINT) {
      priority = "high";
    }

    // If it's related to food or delivery, increase priority
    if (
      feedback.category === FeedbackCategory.FOOD ||
      feedback.category === FeedbackCategory.DELIVERY
    ) {
      if (priority === "medium") {
        priority = "high";
      } else if (priority === "high") {
        priority = "critical";
      }
    }

    // Look for urgent keywords in the subject or message
    const urgentKeywords = [
      "urgent",
      "immediately",
      "critical",
      "broken",
      "not working",
      "failed",
    ];
    const combinedText =
      `${feedback.subject} ${feedback.message}`.toLowerCase();

    if (urgentKeywords.some((keyword) => combinedText.includes(keyword))) {
      if (priority !== "critical") {
        priority = "high";
      }
    }

    return priority;
  }
}
