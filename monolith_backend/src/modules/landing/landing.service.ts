import { Injectable, ConflictException, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Contact, ContactDocument, Subscriber, SubscriberDocument } from "./schemas";
import { CreateContactDto, ContactResponseDto, CreateSubscriberDto, SubscriberResponseDto, GetSubscribersResponseDto } from "./dto";

@Injectable()
export class LandingService {
  private readonly logger = new Logger(LandingService.name);

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(Subscriber.name) private subscriberModel: Model<SubscriberDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  /**
   * Create a new contact form submission
   */
  async createContact(createContactDto: CreateContactDto): Promise<ContactResponseDto> {
    const contact = new this.contactModel(createContactDto);
    await contact.save();

    return {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      subject: contact.subject,
      message: contact.message,
      source: contact.source,
      status: contact.status,
      isResolved: contact.isResolved,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }

  /**
   * Create a new newsletter subscriber
   */
  async createSubscriber(createSubscriberDto: CreateSubscriberDto): Promise<SubscriberResponseDto> {
    // Check if email already exists
    const existingSubscriber = await this.subscriberModel.findOne({
      email: createSubscriberDto.email,
    });

    if (existingSubscriber) {
      // If already active, throw error
      if (existingSubscriber.isActive) {
        throw new ConflictException("Email is already subscribed");
      }
      
      // If inactive, reactivate and update
      existingSubscriber.isActive = true;
      existingSubscriber.name = createSubscriberDto.name || existingSubscriber.name;
      existingSubscriber.preferences = createSubscriberDto.preferences || existingSubscriber.preferences;
      existingSubscriber.source = createSubscriberDto.source || existingSubscriber.source;
      
      await existingSubscriber.save();
      
      return {
        id: existingSubscriber._id,
        email: existingSubscriber.email,
        name: existingSubscriber.name,
        preferences: existingSubscriber.preferences,
        isActive: existingSubscriber.isActive,
        source: existingSubscriber.source,
        createdAt: existingSubscriber.createdAt,
        updatedAt: existingSubscriber.updatedAt,
      };
    }

    // Create new subscriber
    const subscriber = new this.subscriberModel(createSubscriberDto);
    await subscriber.save();

    return {
      id: subscriber._id,
      email: subscriber.email,
      name: subscriber.name,
      preferences: subscriber.preferences,
      isActive: subscriber.isActive,
      source: subscriber.source,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    };
  }

  /**
   * Get contact submissions (admin)
   */
  async getContacts(options: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const { page, limit, status, search, sortBy = "createdAt", sortOrder = "desc" } = options;
    
    // Build filter
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }
    
    // Count total
    const total = await this.contactModel.countDocuments(filter);
    
    // Get data with pagination and sorting
    const contacts = await this.contactModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    
    return {
      contacts: contacts.map(contact => ({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        subject: contact.subject,
        message: contact.message,
        source: contact.source,
        status: contact.status,
        isResolved: contact.isResolved,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * Get newsletter subscribers (admin)
   */
  async getSubscribers(options: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<GetSubscribersResponseDto> {
    const { page, limit, isActive, search, sortBy = "createdAt", sortOrder = "desc" } = options;
    
    // Build filter
    const filter: any = {};
    
    // Only add isActive to filter if it's defined
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    
    // Count total with our filter
    const total = await this.subscriberModel.countDocuments(filter);
    
    // Get data with pagination and sorting
    const subscribers = await this.subscriberModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
    
    // Map the returned documents to the expected format
    const mappedSubscribers = subscribers.map(subscriber => ({
      id: subscriber._id.toString(),
      email: subscriber.email,
      name: subscriber.name,
      preferences: subscriber.preferences,
      isActive: subscriber.isActive,
      source: subscriber.source,
      unsubscribeToken: subscriber.unsubscribeToken,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    }));
    
    return {
      subscribers: mappedSubscribers,
      total,
      page,
      limit,
    };
  }
} 