import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

// Import all phase classes
import { CorePhase } from "./phases/core.phase";
import { PartnerPhase } from "./phases/partner.phase";
import { CommunicationPhase } from "./phases/communication.phase";

// Import utilities and config
import { SeederConfigManager } from "./config/seeder.config";
import { ImageUrlGenerator } from "./config/image-sources";
import { RelationshipManager } from "./utils/relationship-manager";
import { DataValidator } from "./utils/data-validator";
import { PerformanceMonitor } from "./utils/performance-monitor";

// Import interfaces
import {
  SeederPhase,
  SeederPhaseResult,
  SeederConfig,
  SeederPhases,
  ValidationResult,
} from "./interfaces/seeder-phase.interface";

// Import all schemas - keeping existing imports
import { User } from "../user/schemas/user.schema";
import { Partner } from "../partner/schemas/partner.schema";
import { Category } from "../menu/schemas/category.schema";
import { MenuItem } from "../menu/schemas/menu-item.schema";
import { Order } from "../order/schemas/order.schema";
import { Meal } from "../meal/schemas/meal.schema";
import { Subscription } from "../subscription/schemas/subscription.schema";
import { SubscriptionPlan } from "../subscription/schemas/subscription-plan.schema";
import { Payment } from "../payment/schemas/payment.schema";
import { PaymentMethod } from "../payment/schemas/payment-method.schema";
import { CustomerProfile } from "../customer/schemas/customer-profile.schema";
import { Feedback } from "../feedback/schemas/feedback.schema";
import { Testimonial } from "../marketing/schemas/testimonial.schema";
import { Referral } from "../marketing/schemas/referral.schema";
import { CorporateQuote } from "../marketing/schemas/corporate-quote.schema";
import { Contact } from "../landing/schemas/contact.schema";
import { Subscriber } from "../landing/schemas/subscriber.schema";
import { Conversation } from "../chat/schemas/conversation.schema";
import { ChatMessage } from "../chat/schemas/chat-message.schema";
import { TypingIndicator } from "../chat/schemas/typing-indicator.schema";

export interface SeederStatus {
  isRunning: boolean;
  currentPhase?: string;
  progress: number;
  totalPhases: number;
  completedPhases: string[];
  errors: string[];
  startTime?: Date;
  estimatedCompletion?: string;
}

export interface SeederSummary {
  success: boolean;
  totalDuration: number;
  phasesCompleted: number;
  totalRecords: number;
  phaseResults: SeederPhaseResult[];
  errors: string[];
  validation: ValidationResult;
}

@Injectable()
export class SeederManager {
  private readonly logger = new Logger(SeederManager.name);
  private phases: Map<string, SeederPhase> = new Map();
  private models: Record<string, Model<any>> = {};
  private status: SeederStatus = {
    isRunning: false,
    progress: 0,
    totalPhases: 0,
    completedPhases: [],
    errors: [],
  };

  // Utilities
  private configManager: SeederConfigManager;
  private imageGenerator: ImageUrlGenerator;
  private relationshipManager: RelationshipManager;
  private dataValidator: DataValidator;
  private performanceMonitor: PerformanceMonitor;

  constructor(
    // Core models
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Partner.name) private readonly partnerModel: Model<Partner>,

    // Menu models
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,

    // Order and Meal models
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,

    // Subscription models
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(SubscriptionPlan.name)
    private readonly subscriptionPlanModel: Model<SubscriptionPlan>,

    // Payment models
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(PaymentMethod.name)
    private readonly paymentMethodModel: Model<PaymentMethod>,

    // Customer models
    @InjectModel(CustomerProfile.name)
    private readonly customerProfileModel: Model<CustomerProfile>,

    // Feedback model
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,

    // Marketing models
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<Testimonial>,
    @InjectModel(Referral.name) private readonly referralModel: Model<Referral>,
    @InjectModel(CorporateQuote.name)
    private readonly corporateQuoteModel: Model<CorporateQuote>,

    // Landing page models
    @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<Subscriber>,

    // Chat models
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
    @InjectModel(TypingIndicator.name)
    private readonly typingIndicatorModel: Model<TypingIndicator>,
  ) {
    this.initializeModels();
    this.initializeUtilities();
    this.initializePhases();
  }

  private initializeModels(): void {
    this.models = {
      users: this.userModel,
      partners: this.partnerModel,
      categories: this.categoryModel,
      menuitems: this.menuItemModel,
      orders: this.orderModel,
      meals: this.mealModel,
      subscriptions: this.subscriptionModel,
      subscriptionplans: this.subscriptionPlanModel,
      payments: this.paymentModel,
      paymentmethods: this.paymentMethodModel,
      customerprofiles: this.customerProfileModel,
      feedback: this.feedbackModel,
      testimonials: this.testimonialModel,
      referrals: this.referralModel,
      corporatequotes: this.corporateQuoteModel,
      contacts: this.contactModel,
      subscribers: this.subscriberModel,
      conversations: this.conversationModel,
      chatmessages: this.chatMessageModel,
      typingindicators: this.typingIndicatorModel,
    };
  }

  private initializeUtilities(): void {
    this.configManager = new SeederConfigManager();
    this.configManager.applyEnvironmentOverrides();

    this.imageGenerator = new ImageUrlGenerator(
      this.configManager.getImageStrategy(),
    );
    this.relationshipManager = new RelationshipManager();
    this.dataValidator = new DataValidator();
    this.performanceMonitor = new PerformanceMonitor();
  }

  private initializePhases(): void {
    // Initialize all phases
    const corePhase = new CorePhase(
      this.models,
      this.performanceMonitor,
      this.imageGenerator,
    );
    const partnerPhase = new PartnerPhase(
      this.models,
      this.performanceMonitor,
      this.imageGenerator,
    );
    const communicationPhase = new CommunicationPhase(
      this.models,
      this.performanceMonitor,
      this.imageGenerator,
    );

    this.phases.set(SeederPhases.CORE, corePhase);
    this.phases.set(SeederPhases.PARTNER, partnerPhase);
    this.phases.set(SeederPhases.COMMUNICATION, communicationPhase);

    this.logger.log(`🎯 Initialized ${this.phases.size} seeding phases`);
  }

  // Main seeding methods
  async seedAll(config?: Partial<SeederConfig>): Promise<SeederSummary> {
    const finalConfig = { ...this.configManager.getConfig(), ...config };
    const phaseOrder = this.getPhaseExecutionOrder();

    return this.executePhases(phaseOrder, finalConfig);
  }

  async seedPhase(
    phaseName: string,
    config?: Partial<SeederConfig>,
  ): Promise<SeederPhaseResult> {
    const phase = this.phases.get(phaseName);
    if (!phase) {
      throw new Error(`Phase '${phaseName}' not found`);
    }

    const finalConfig = { ...this.configManager.getConfig(), ...config };

    this.logger.log(`🌱 Starting single phase: ${phaseName}`);
    this.updateStatus({ isRunning: true, currentPhase: phaseName });

    try {
      const result = await phase.execute(finalConfig);
      this.updateStatus({
        isRunning: false,
        completedPhases: [...this.status.completedPhases, phaseName],
      });

      return result;
    } catch (error) {
      this.updateStatus({
        isRunning: false,
        errors: [...this.status.errors, error.message],
      });
      throw error;
    }
  }

  async seedProfile(profileName: string): Promise<SeederSummary> {
    const config = this.configManager.getConfig();
    config.profile = profileName as any;
    config.volumes = this.configManager.getVolumeConfig(profileName);

    return this.seedAll(config);
  }

  async cleanPhase(phaseName: string): Promise<void> {
    const phase = this.phases.get(phaseName);
    if (!phase) {
      throw new Error(`Phase '${phaseName}' not found`);
    }

    this.logger.log(`🧹 Cleaning phase: ${phaseName}`);
    await phase.clean();
  }

  async cleanAll(): Promise<void> {
    this.logger.log("🧹 Cleaning all collections...");

    const cleanPromises = Array.from(this.phases.values()).map((phase) =>
      phase.clean(),
    );
    await Promise.all(cleanPromises);

    this.logger.log("✅ All collections cleaned");
  }

  // Status and validation methods
  getStatus(): SeederStatus {
    return { ...this.status };
  }

  async validateData(): Promise<ValidationResult> {
    this.logger.log("🔍 Starting comprehensive data validation...");

    const relationshipValidation =
      await this.relationshipManager.validateRelationships(this.models);
    const dataValidation = await this.dataValidator.validateAllCollections(
      this.models,
    );

    return {
      isValid: relationshipValidation.isValid && dataValidation.isValid,
      errors: [...relationshipValidation.errors, ...dataValidation.errors],
      warnings: [
        ...relationshipValidation.warnings,
        ...dataValidation.warnings,
      ],
    };
  }

  async getCollectionStats(): Promise<any> {
    return this.dataValidator.getCollectionStats(this.models);
  }

  // Configuration methods
  updateConfig(updates: Partial<SeederConfig>): void {
    this.configManager.updateConfig(updates);

    // Update image generator if strategy changed
    if (updates.imageStrategy) {
      this.imageGenerator = new ImageUrlGenerator(updates.imageStrategy);
    }
  }

  getConfig(): SeederConfig {
    return this.configManager.getConfig();
  }

  // Private helper methods
  private async executePhases(
    phaseNames: string[],
    config: SeederConfig,
  ): Promise<SeederSummary> {
    this.logger.log(
      `🚀 Starting comprehensive seeding with ${phaseNames.length} phases`,
    );

    this.performanceMonitor.startGlobalMonitoring();
    this.updateStatus({
      isRunning: true,
      progress: 0,
      totalPhases: phaseNames.length,
      completedPhases: [],
      errors: [],
      startTime: new Date(),
    });

    const results: SeederPhaseResult[] = [];
    let totalRecords = 0;

    try {
      for (let i = 0; i < phaseNames.length; i++) {
        const phaseName = phaseNames[i];
        const phase = this.phases.get(phaseName);

        if (!phase) {
          const error = `Phase '${phaseName}' not found`;
          this.status.errors.push(error);
          continue;
        }

        this.updateStatus({
          currentPhase: phaseName,
          progress: (i / phaseNames.length) * 100,
        });

        const result = await phase.execute(config);
        results.push(result);

        if (result.success) {
          totalRecords += Object.values(result.recordCounts).reduce(
            (sum, count) => sum + count,
            0,
          );
          this.updateStatus({
            completedPhases: [...this.status.completedPhases, phaseName],
          });
        } else {
          this.updateStatus({
            errors: [...this.status.errors, ...(result.errors || [])],
          });
        }
      }

      // Final validation
      const validation = await this.validateData();

      this.updateStatus({
        isRunning: false,
        progress: 100,
      });

      this.performanceMonitor.logGlobalStats();

      const summary: SeederSummary = {
        success: results.every((r) => r.success) && validation.isValid,
        totalDuration: Date.now() - this.status.startTime!.getTime(),
        phasesCompleted: results.filter((r) => r.success).length,
        totalRecords,
        phaseResults: results,
        errors: [...this.status.errors, ...validation.errors],
        validation,
      };

      this.logSummary(summary);
      return summary;
    } catch (error) {
      this.updateStatus({
        isRunning: false,
        errors: [...this.status.errors, error.message],
      });
      throw error;
    }
  }

  private getPhaseExecutionOrder(): string[] {
    const allPhases = Array.from(this.phases.keys());
    return this.relationshipManager.getSeededOrder(allPhases);
  }

  private updateStatus(updates: Partial<SeederStatus>): void {
    this.status = { ...this.status, ...updates };
  }

  private logSummary(summary: SeederSummary): void {
    this.logger.log("📊 Seeding Summary:");
    this.logger.log(`   Success: ${summary.success ? "✅" : "❌"}`);
    this.logger.log(`   Duration: ${summary.totalDuration}ms`);
    this.logger.log(
      `   Phases: ${summary.phasesCompleted}/${summary.phaseResults.length}`,
    );
    this.logger.log(`   Records: ${summary.totalRecords}`);
    this.logger.log(`   Errors: ${summary.errors.length}`);

    if (summary.errors.length > 0) {
      this.logger.error("❌ Errors encountered:");
      summary.errors.forEach((error) => this.logger.error(`   - ${error}`));
    }
  }

  // Legacy compatibility method
  async seedDummyData(): Promise<any> {
    const summary = await this.seedAll();

    return {
      message: summary.success
        ? "Comprehensive dummy data seeding completed successfully!"
        : "Seeding completed with errors",
      summary: {
        totalRecords: summary.totalRecords,
        phasesCompleted: summary.phasesCompleted,
        duration: summary.totalDuration,
        errors: summary.errors,
      },
    };
  }
}
