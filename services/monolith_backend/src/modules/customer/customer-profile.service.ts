import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CustomerProfile } from "./schemas/customer-profile.schema";
import {
  CreateCustomerProfileDto,
  UpdateCustomerProfileDto,
  CustomerProfileResponseDto,
  CustomerListResponseDto,
  CustomerStatisticsDto,
} from "./dto/customer-profile.dto";
import { UserService } from "../user/user.service";
import { UserRole } from "../../common/interfaces/user.interface";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class CustomerProfileService {
  constructor(
    @InjectModel(CustomerProfile.name)
    private readonly customerProfileModel: Model<CustomerProfile>,
    private readonly userService: UserService,
  ) {}

  /**
   * Create a new customer profile
   */
  async create(
    userId: string,
    createProfileDto: CreateCustomerProfileDto,
  ): Promise<CustomerProfileResponseDto> {
    // Check if user exists and is a customer
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Allow both customers and administrators to create profiles
    if (
      user.role !== UserRole.CUSTOMER &&
      user.role !== UserRole.SUPER_ADMIN &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        "Only customers and administrators can create customer profiles",
      );
    }

    // Check if profile already exists
    const existingProfile = await this.customerProfileModel
      .findOne({ user: userId })
      .exec();
    if (existingProfile) {
      throw new BadRequestException("Customer profile already exists");
    }

    // Process addresses if provided
    const deliveryAddresses =
      createProfileDto.deliveryAddresses?.map((address) => ({
        ...address,
        id: uuidv4(), // Generate unique ID for each address
      })) || [];

    // Ensure only one address is set as default if any are provided
    if (deliveryAddresses.length > 0) {
      const defaultCount = deliveryAddresses.filter(
        (addr) => addr.isDefault,
      ).length;

      if (defaultCount === 0) {
        // If no default is set, make the first one default
        deliveryAddresses[0].isDefault = true;
      } else if (defaultCount > 1) {
        // If multiple defaults are set, keep only the first one as default
        let defaultFound = false;
        deliveryAddresses.forEach((addr) => {
          if (addr.isDefault) {
            if (defaultFound) {
              addr.isDefault = false;
            }
            defaultFound = true;
          }
        });
      }
    }

    // Create new profile
    const newProfile = new this.customerProfileModel({
      user: userId,
      city: createProfileDto.city,
      college: createProfileDto.college,
      branch: createProfileDto.branch,
      graduationYear: createProfileDto.graduationYear,
      dietaryPreferences: createProfileDto.dietaryPreferences || [],
      favoriteCuisines: createProfileDto.favoriteCuisines || [],
      preferredPaymentMethods: createProfileDto.preferredPaymentMethods || [],
      deliveryAddresses: deliveryAddresses,
    });

    const savedProfile = await newProfile.save();
    return this.mapToResponseDto(savedProfile);
  }

  /**
   * Get customer profile by user ID
   */
  async findByUserId(userId: string): Promise<CustomerProfileResponseDto> {
    const profile = await this.customerProfileModel
      .findOne({ user: userId })
      .exec();

    if (!profile) {
      throw new NotFoundException(
        `Profile for user with ID ${userId} not found`,
      );
    }

    return this.mapToResponseDto(profile);
  }

  /**
   * Update customer profile
   */
  async update(
    userId: string,
    updateProfileDto: UpdateCustomerProfileDto,
  ): Promise<CustomerProfileResponseDto> {
    // First check if the user exists and has appropriate permissions
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const profile = await this.customerProfileModel
      .findOne({ user: userId })
      .exec();

    if (!profile) {
      throw new NotFoundException(
        `Profile for user with ID ${userId} not found`,
      );
    }

    // Handle address updates if provided
    if (updateProfileDto.deliveryAddresses) {
      // Preserve existing address IDs when they match by position
      // and generate new IDs for new addresses
      const updatedAddresses = updateProfileDto.deliveryAddresses.map(
        (address, index) => {
          const existingAddress =
            profile.deliveryAddresses && profile.deliveryAddresses[index];
          return {
            ...address,
            id: existingAddress?.id || uuidv4(),
          };
        },
      );

      // Ensure only one address is set as default
      const defaultCount = updatedAddresses.filter(
        (addr) => addr.isDefault,
      ).length;

      if (defaultCount === 0 && updatedAddresses.length > 0) {
        // If no default is set, make the first one default
        updatedAddresses[0].isDefault = true;
      } else if (defaultCount > 1) {
        // If multiple defaults are set, keep only the first one as default
        let defaultFound = false;
        updatedAddresses.forEach((addr) => {
          if (addr.isDefault) {
            if (defaultFound) {
              addr.isDefault = false;
            }
            defaultFound = true;
          }
        });
      }

      // Update the DTO with processed addresses
      updateProfileDto.deliveryAddresses = updatedAddresses;
    }

    // Update profile fields
    const updatedProfile = await this.customerProfileModel
      .findOneAndUpdate(
        { user: userId },
        {
          ...updateProfileDto,
        },
        { new: true },
      )
      .exec();

    return this.mapToResponseDto(updatedProfile);
  }

  /**
   * Get customers by city with pagination
   */
  async findByCity(
    city: string,
    page = 1,
    limit = 10,
  ): Promise<CustomerListResponseDto> {
    const skip = (page - 1) * limit;
    const [profiles, total] = await Promise.all([
      this.customerProfileModel
        .find({ city: { $regex: new RegExp(city, "i") } })
        .skip(skip)
        .limit(limit)
        .populate("user", "email firstName lastName phoneNumber")
        .exec(),
      this.customerProfileModel
        .countDocuments({ city: { $regex: new RegExp(city, "i") } })
        .exec(),
    ]);

    return {
      customers: profiles.map((profile) => this.mapToResponseDto(profile)),
      total,
      page,
      limit,
    };
  }

  /**
   * Get customer statistics for admin dashboard
   */
  async getStatistics(): Promise<CustomerStatisticsDto> {
    const totalCustomers = await this.userService.countByRole(
      UserRole.CUSTOMER,
    );
    const profilesWithCities = await this.customerProfileModel.find().exec();

    // Count profiles with data in the last 30 days to estimate "active" users
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeCustomers = await this.customerProfileModel
      .countDocuments({
        updatedAt: { $gte: thirtyDaysAgo },
      })
      .exec();

    // Group customers by city
    const customersByCity = this.groupByField(profilesWithCities, "city");

    // Group customers by college
    const customersByCollege = this.groupByField(
      profilesWithCities,
      "college",
      "Other",
    );

    // Group customers by graduation year
    const customersByGraduationYear = this.groupByField(
      profilesWithCities,
      "graduationYear",
      "Other",
    );

    // Aggregate dietary preferences
    const dietaryPreferences = this.aggregateArrayField(
      profilesWithCities,
      "dietaryPreferences",
    );

    // Aggregate favorite cuisines
    const favoriteCuisines = this.aggregateArrayField(
      profilesWithCities,
      "favoriteCuisines",
    );

    return {
      totalCustomers,
      activeCustomers,
      customersByCity,
      customersByCollege,
      customersByGraduationYear,
      dietaryPreferences,
      favoriteCuisines,
    };
  }

  /**
   * Map profile document to response DTO
   */
  private mapToResponseDto(profile: any): CustomerProfileResponseDto {
    return {
      id: profile._id.toString(),
      user: profile.user._id
        ? profile.user._id.toString()
        : profile.user.toString(),
      city: profile.city,
      college: profile.college,
      branch: profile.branch,
      graduationYear: profile.graduationYear,
      dietaryPreferences: profile.dietaryPreferences,
      favoriteCuisines: profile.favoriteCuisines,
      preferredPaymentMethods: profile.preferredPaymentMethods,
      deliveryAddresses: profile.deliveryAddresses,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  /**
   * Group profiles by a specific field
   */
  private groupByField(
    profiles: any[],
    field: string,
    otherLabel = "Other",
  ): Record<string, number> {
    const groupedData: Record<string, number> = {};

    profiles.forEach((profile) => {
      const value = profile[field] ? profile[field].toString() : otherLabel;
      if (groupedData[value]) {
        groupedData[value]++;
      } else {
        groupedData[value] = 1;
      }
    });

    return groupedData;
  }

  /**
   * Aggregate array fields across profiles
   */
  private aggregateArrayField(
    profiles: any[],
    field: string,
  ): Record<string, number> {
    const aggregatedData: Record<string, number> = {};

    profiles.forEach((profile) => {
      if (profile[field] && Array.isArray(profile[field])) {
        profile[field].forEach((item: string) => {
          if (aggregatedData[item]) {
            aggregatedData[item]++;
          } else {
            aggregatedData[item] = 1;
          }
        });
      }
    });

    return aggregatedData;
  }
}
