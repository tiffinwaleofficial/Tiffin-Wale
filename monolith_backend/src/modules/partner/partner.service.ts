import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Partner, PartnerStatus } from "./schemas/partner.schema";
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  PartnerResponseDto,
  PartnerListResponseDto,
  PartnerStatusUpdateDto,
} from "./dto/partner.dto";
import { UserService } from "../user/user.service";
import { UserRole } from "../../common/interfaces/user.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name) private readonly partnerModel: Model<Partner>,
    private readonly userService: UserService,
  ) {}

  /**
   * Register a new partner
   */
  async create(
    createPartnerDto: CreatePartnerDto,
  ): Promise<PartnerResponseDto> {
    // Check if email already exists
    try {
      const existingUser = await this.userService.findByEmailSafe(
        createPartnerDto.email,
      );
      if (existingUser) {
        throw new ConflictException("Email already in use");
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // If not found, that's fine
    }

    // Create user account
    const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);
    const newUser = await this.userService.create({
      email: createPartnerDto.email,
      password: hashedPassword,
      role: UserRole.BUSINESS,
      firstName: createPartnerDto.businessName.split(" ")[0], // Use first part of business name as firstName
      lastName: createPartnerDto.businessName.split(" ").slice(1).join(" "), // Use rest as lastName
      phoneNumber: createPartnerDto.phoneNumber,
    });

    // Create partner profile
    const newPartner = new this.partnerModel({
      user: newUser._id,
      businessName: createPartnerDto.businessName,
      description: createPartnerDto.description,
      cuisineTypes: createPartnerDto.cuisineTypes,
      address: createPartnerDto.address,
      businessHours: createPartnerDto.businessHours,
      logoUrl: createPartnerDto.logoUrl,
      bannerUrl: createPartnerDto.bannerUrl,
      isAcceptingOrders:
        createPartnerDto.isAcceptingOrders !== undefined
          ? createPartnerDto.isAcceptingOrders
          : true,
      isFeatured:
        createPartnerDto.isFeatured !== undefined
          ? createPartnerDto.isFeatured
          : false,
      status: PartnerStatus.PENDING,
    });

    const savedPartner = await newPartner.save();
    return this.mapToResponseDto(savedPartner);
  }

  /**
   * Get all partners with pagination
   */
  async findAll(
    page = 1,
    limit = 10,
    status?: string,
  ): Promise<PartnerListResponseDto> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [partners, total] = await Promise.all([
      this.partnerModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate("user", "email phoneNumber")
        .exec(),
      this.partnerModel.countDocuments(query).exec(),
    ]);

    return {
      partners: partners.map((partner) => this.mapToResponseDto(partner)),
      total,
      page,
      limit,
    };
  }

  /**
   * Get partner by ID
   */
  async findById(id: string): Promise<PartnerResponseDto> {
    const partner = await this.partnerModel
      .findById(id)
      .populate("user", "email phoneNumber")
      .exec();

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return this.mapToResponseDto(partner);
  }

  /**
   * Get partner by User ID
   */
  async findByUserId(userId: string): Promise<PartnerResponseDto> {
    const partner = await this.partnerModel
      .findOne({ user: userId })
      .populate("user", "email phoneNumber")
      .exec();

    if (!partner) {
      throw new NotFoundException(`Partner with User ID ${userId} not found`);
    }

    return this.mapToResponseDto(partner);
  }

  /**
   * Update partner
   */
  async update(
    id: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerResponseDto> {
    // Check if partner exists
    const partner = await this.partnerModel
      .findById(id)
      .populate("user")
      .exec();
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Type assertion to handle user as a populated document
    const userDoc = partner.user as any;

    // Check if email is being updated and if it's already in use
    if (updatePartnerDto.email && updatePartnerDto.email !== userDoc.email) {
      try {
        const existingUser = await this.userService.findByEmailSafe(
          updatePartnerDto.email,
        );
        if (
          existingUser &&
          existingUser._id.toString() !== userDoc._id.toString()
        ) {
          throw new ConflictException("Email already in use");
        }
      } catch (error) {
        if (error instanceof ConflictException) {
          throw error;
        }
        // If not found, that's fine
      }

      // Update user email
      await this.userService.update(userDoc._id.toString(), {
        email: updatePartnerDto.email,
      });
    }

    // Update basic user info if provided
    if (updatePartnerDto.phoneNumber) {
      await this.userService.update(userDoc._id.toString(), {
        phoneNumber: updatePartnerDto.phoneNumber,
      });
    }

    // Update partner fields
    const updatedPartner = await this.partnerModel
      .findByIdAndUpdate(
        id,
        {
          businessName: updatePartnerDto.businessName,
          description: updatePartnerDto.description,
          cuisineTypes: updatePartnerDto.cuisineTypes,
          address: updatePartnerDto.address,
          businessHours: updatePartnerDto.businessHours,
          logoUrl: updatePartnerDto.logoUrl,
          bannerUrl: updatePartnerDto.bannerUrl,
          isAcceptingOrders: updatePartnerDto.isAcceptingOrders,
          isFeatured: updatePartnerDto.isFeatured,
        },
        { new: true },
      )
      .populate("user", "email phoneNumber")
      .exec();

    return this.mapToResponseDto(updatedPartner);
  }

  /**
   * Update partner status
   */
  async updateStatus(
    id: string,
    statusUpdateDto: PartnerStatusUpdateDto,
  ): Promise<PartnerResponseDto> {
    const validStatuses = Object.values(PartnerStatus);
    if (!validStatuses.includes(statusUpdateDto.status as PartnerStatus)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const partner = await this.partnerModel
      .findById(id)
      .populate("user")
      .exec();
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Type assertion to handle user as a populated document
    const userDoc = partner.user as any;

    const updatedPartner = await this.partnerModel
      .findByIdAndUpdate(id, { status: statusUpdateDto.status }, { new: true })
      .populate("user", "email phoneNumber")
      .exec();

    return this.mapToResponseDto(updatedPartner);
  }

  /**
   * Delete partner
   */
  async remove(id: string): Promise<void> {
    const partner = await this.partnerModel
      .findById(id)
      .populate("user")
      .exec();

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Type assertion to handle user as a populated document
    const userDoc = partner.user as any;

    // Delete user account if it exists
    if (userDoc && userDoc._id) {
      try {
        await this.userService.remove(userDoc._id.toString());
      } catch (error) {
        // Log the error but continue with partner deletion
        console.error(
          `Failed to delete user for partner ${id}: ${error.message}`,
        );
      }
    }

    // Delete partner profile
    await this.partnerModel.findByIdAndDelete(id).exec();
  }

  /**
   * Get partner's orders
   */
  async getPartnerOrders(
    id: string,
    page = 1,
    limit = 10,
    status?: string,
  ): Promise<any> {
    const partner = await this.partnerModel
      .findById(id)
      .populate("user")
      .exec();

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // This would typically call a method on the order service
    // For now, return a mock response
    return {
      orders: [],
      total: 0,
      page,
      limit,
    };
  }

  /**
   * Get partner's menu
   */
  async getPartnerMenu(id: string): Promise<any> {
    const partner = await this.partnerModel
      .findById(id)
      .populate("user")
      .exec();

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // This would typically call a method on the menu service
    // For now, return a mock response
    return {
      menuItems: [],
      total: 0,
    };
  }

  /**
   * Get partner reviews
   */
  async getPartnerReviews(id: string, page = 1, limit = 10): Promise<any> {
    const partner = await this.partnerModel
      .findById(id)
      .populate("user")
      .exec();

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // For now, we're returning a mock response
    // In a real implementation, you would retrieve reviews from orders or a dedicated reviews collection
    return {
      reviews: [
        {
          id: "60d21b4667d0d8992e610c86",
          rating: 4.5,
          comment: "Great food and service!",
          customer: "John Doe",
          date: new Date(),
        },
      ],
      total: 1,
      page,
      limit,
    };
  }

  /**
   * Get partner statistics
   */
  async getPartnerStats(id: string): Promise<any> {
    const partner = await this.partnerModel
      .findById(id)
      .populate("user")
      .exec();

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Type assertion to handle user as a populated document
    const userDoc = partner.user as any;

    // For now, we're returning a simple statistics object
    // In a real implementation, you would compute more detailed statistics
    return {
      totalOrders: 0,
      totalMenuItems: 0,
      averageRating: partner.averageRating || 0,
      totalReviews: partner.totalReviews || 0,
      status: partner.status,
    };
  }

  /**
   * Map partner document to response DTO
   */
  private mapToResponseDto(partner: any): PartnerResponseDto {
    // Type assertion to handle user as a populated document
    const userDoc = partner.user as any;

    return {
      id: partner._id.toString(),
      businessName: partner.businessName,
      email: userDoc?.email || "",
      phoneNumber: userDoc?.phoneNumber || "",
      description: partner.description,
      cuisineTypes: partner.cuisineTypes,
      address: partner.address,
      businessHours: partner.businessHours,
      logoUrl: partner.logoUrl,
      bannerUrl: partner.bannerUrl,
      isAcceptingOrders: partner.isAcceptingOrders,
      isFeatured: partner.isFeatured,
      isActive: true, // Always active for now since we removed isActive field
      averageRating: partner.averageRating,
      totalReviews: partner.totalReviews,
      status: partner.status,
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
    };
  }
}
