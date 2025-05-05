import { Injectable, ConflictException, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Referral, ReferralDocument, ReferralStatus, CorporateQuote, CorporateQuoteDocument } from "./schemas";
import { CreateReferralDto, ReferralResponseDto, CreateTestimonialDto, TestimonialResponseDto, CreateCorporateQuoteDto, GetTestimonialsQueryDto, GetTestimonialsResponseDto } from "./dto";
import { Testimonial } from "./schemas";

@Injectable()
export class MarketingService {
  private readonly logger = new Logger(MarketingService.name);

  constructor(
    @InjectModel(Referral.name) private referralModel: Model<ReferralDocument>,
    @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>,
    @InjectModel(CorporateQuote.name) private corporateQuoteRepository: Model<CorporateQuoteDocument>
  ) {}

  /**
   * Create a new referral
   */
  async createReferral(createReferralDto: CreateReferralDto, userId?: string): Promise<ReferralResponseDto> {
    // Check if the referred email has already been referred
    const existingReferral = await this.referralModel.findOne({
      referredEmail: createReferralDto.referredEmail,
      status: { $ne: ReferralStatus.EXPIRED },
    });

    if (existingReferral) {
      throw new ConflictException("This email has already been referred");
    }

    // Create the referral
    const referral = new this.referralModel({
      ...createReferralDto,
      referrer: userId,
    });
    
    await referral.save();

    return {
      id: referral._id,
      referrerEmail: referral.referrerEmail,
      referrer: referral.referrer,
      referredEmail: referral.referredEmail,
      referredUser: referral.referredUser,
      code: referral.code,
      status: referral.status,
      conversionDate: referral.conversionDate,
      rewards: referral.rewards,
      utmSource: referral.utmSource,
      utmMedium: referral.utmMedium,
      utmCampaign: referral.utmCampaign,
      utmContent: referral.utmContent,
      utmTerm: referral.utmTerm,
      createdAt: referral.createdAt,
      expiresAt: referral.expiresAt,
      updatedAt: referral.updatedAt,
    };
  }

  /**
   * Get referrals list for admin
   */
  async getReferrals(options: {
    page: number;
    limit: number;
    status?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const { 
      page, 
      limit, 
      status, 
      utmSource,
      utmMedium,
      utmCampaign,
      startDate,
      endDate,
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = options;
    
    // Build filter
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (utmSource) {
      filter.utmSource = utmSource;
    }
    
    if (utmMedium) {
      filter.utmMedium = utmMedium;
    }
    
    if (utmCampaign) {
      filter.utmCampaign = utmCampaign;
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
    const total = await this.referralModel.countDocuments(filter);
    
    // Get data with pagination and sorting
    const referrals = await this.referralModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("referrer", "email firstName lastName")
      .populate("referredUser", "email firstName lastName")
      .exec();
    
    // Calculate statistics
    const statistics = {
      totalReferrals: total,
      convertedReferrals: await this.referralModel.countDocuments({ status: ReferralStatus.CONVERTED }),
      pendingReferrals: await this.referralModel.countDocuments({ status: ReferralStatus.PENDING }),
      expiredReferrals: await this.referralModel.countDocuments({ status: ReferralStatus.EXPIRED }),
      conversionRate: await this.calculateConversionRate(),
    };
    
    return {
      referrals: referrals.map(referral => ({
        id: referral._id,
        referrerEmail: referral.referrerEmail,
        referrer: referral.referrer,
        referredEmail: referral.referredEmail,
        referredUser: referral.referredUser,
        code: referral.code,
        status: referral.status,
        conversionDate: referral.conversionDate,
        rewards: referral.rewards,
        utmSource: referral.utmSource,
        utmMedium: referral.utmMedium,
        utmCampaign: referral.utmCampaign,
        utmContent: referral.utmContent,
        utmTerm: referral.utmTerm,
        createdAt: referral.createdAt,
        expiresAt: referral.expiresAt,
        updatedAt: referral.updatedAt,
      })),
      statistics,
      total,
      page,
      limit,
    };
  }

  /**
   * Calculate conversion rate
   */
  private async calculateConversionRate(): Promise<number> {
    const totalReferrals = await this.referralModel.countDocuments();
    
    if (totalReferrals === 0) {
      return 0;
    }
    
    const convertedReferrals = await this.referralModel.countDocuments({ 
      status: ReferralStatus.CONVERTED 
    });
    
    const conversionRate = (convertedReferrals / totalReferrals) * 100;
    return parseFloat(conversionRate.toFixed(1));
  }

  /**
   * Create a new testimonial
   */
  async createTestimonial(
    createTestimonialDto: CreateTestimonialDto,
    userId?: string
  ): Promise<TestimonialResponseDto> {
    try {
      const newTestimonial = new this.testimonialModel({
        ...createTestimonialDto,
        user: userId,
        source: 'web',
        isApproved: false,
        isFeatured: false,
      });

      const savedTestimonial = await newTestimonial.save();

      return {
        id: savedTestimonial._id.toString(),
        name: savedTestimonial.name,
        email: savedTestimonial.email,
        profession: savedTestimonial.profession,
        rating: savedTestimonial.rating,
        testimonial: savedTestimonial.testimonial,
        imageUrl: savedTestimonial.imageUrl,
        isApproved: savedTestimonial.isApproved,
        isFeatured: savedTestimonial.isFeatured,
        createdAt: savedTestimonial.createdAt,
        updatedAt: savedTestimonial.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create testimonial: ${error.message}`
      );
    }
  }

  /**
   * Get public testimonials (approved ones only)
   */
  async getPublicTestimonials(options: {
    limit?: number;
    featured?: boolean;
  }) {
    const { limit = 10, featured = false } = options;
    
    const query = { isApproved: true };
    if (featured) {
      query['isFeatured'] = true;
    }
    
    const testimonials = await this.testimonialModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    
    return testimonials.map(testimonial => ({
      id: testimonial._id.toString(),
      name: testimonial.name,
      email: testimonial.email,
      profession: testimonial.profession,
      rating: testimonial.rating,
      testimonial: testimonial.testimonial,
      imageUrl: testimonial.imageUrl,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
    }));
  }

  /**
   * Get testimonials for admin (with filtering options)
   */
  async getTestimonials(query: GetTestimonialsQueryDto): Promise<GetTestimonialsResponseDto> {
    const { page = 1, limit = 10, isApproved, isFeatured } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (isApproved !== undefined) filter.isApproved = isApproved;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured;

    const [testimonials, total] = await Promise.all([
      this.testimonialModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.testimonialModel.countDocuments(filter)
    ]);

    return {
      items: testimonials.map(testimonial => ({
        id: testimonial._id,
        name: testimonial.name,
        email: testimonial.email,
        profession: testimonial.profession,
        rating: testimonial.rating,
        testimonial: testimonial.testimonial,
        imageUrl: testimonial.imageUrl,
        isApproved: testimonial.isApproved,
        isFeatured: testimonial.isFeatured,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt
      })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Update testimonial status (approve, feature, etc.)
   */
  async updateTestimonialStatus(
    id: string,
    updates: {
      isApproved?: boolean;
      isFeatured?: boolean;
    }
  ): Promise<TestimonialResponseDto> {
    const testimonial = await this.testimonialModel.findById(id);
    
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }
    
    // Apply updates
    if (updates.isApproved !== undefined) {
      testimonial.isApproved = updates.isApproved;
    }
    
    if (updates.isFeatured !== undefined) {
      testimonial.isFeatured = updates.isFeatured;
    }
    
    // Save updates
    const updatedTestimonial = await testimonial.save();
    
    return {
      id: updatedTestimonial._id.toString(),
      name: updatedTestimonial.name,
      email: updatedTestimonial.email,
      profession: updatedTestimonial.profession,
      rating: updatedTestimonial.rating,
      testimonial: updatedTestimonial.testimonial,
      imageUrl: updatedTestimonial.imageUrl,
      isApproved: updatedTestimonial.isApproved,
      isFeatured: updatedTestimonial.isFeatured,
      createdAt: updatedTestimonial.createdAt,
      updatedAt: updatedTestimonial.updatedAt,
    };
  }

  // Create a corporate quote request
  async createCorporateQuote(createQuoteDto: CreateCorporateQuoteDto): Promise<any> {
    try {
      // Store the corporate quote request in the database
      const corporateQuote = await this.corporateQuoteRepository.create({
        ...createQuoteDto,
        status: 'new',
      });
      
      // Log the successful creation instead of sending notification/email
      this.logger.log(`Corporate quote request created: ${corporateQuote.id} from ${createQuoteDto.companyName}`);

      return {
        success: true,
        message: 'Corporate quote request submitted successfully',
        id: corporateQuote.id,
      };
    } catch (error) {
      this.logger.error(`Failed to create corporate quote: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create corporate quote: ${error.message}`);
    }
  }

  // Get all corporate quote requests (admin)
  async getCorporateQuotes(options: any): Promise<any> {
    try {
      const { page, limit, status, search, sortBy, sortOrder } = options;
      
      // Build the query
      const query: any = {};
      
      if (status) {
        query.status = status;
      }
      
      if (search) {
        query.$or = [
          { companyName: { $regex: search, $options: 'i' } },
          { contactPerson: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Build sort options
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      
      // Execute the query
      const [quotes, totalCount] = await Promise.all([
        this.corporateQuoteRepository
          .find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.corporateQuoteRepository.countDocuments(query),
      ]);
      
      return {
        quotes,
        pagination: {
          totalQuotes: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          perPage: limit,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch corporate quotes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTestimonialById(id: string): Promise<TestimonialResponseDto> {
    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    return {
      id: testimonial._id,
      name: testimonial.name,
      email: testimonial.email,
      profession: testimonial.profession,
      rating: testimonial.rating,
      testimonial: testimonial.testimonial,
      imageUrl: testimonial.imageUrl,
      isApproved: testimonial.isApproved,
      isFeatured: testimonial.isFeatured,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt
    };
  }
} 