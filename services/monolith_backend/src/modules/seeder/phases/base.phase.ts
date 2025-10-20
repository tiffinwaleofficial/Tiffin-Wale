import { Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { faker } from "@faker-js/faker";
import {
  SeederPhase,
  SeederPhaseResult,
  SeederConfig,
  ValidationResult,
} from "../interfaces/seeder-phase.interface";
import { PerformanceMonitor } from "../utils/performance-monitor";
import { ImageUrlGenerator } from "../config/image-sources";

export abstract class BaseSeederPhase implements SeederPhase {
  protected readonly logger = new Logger(this.constructor.name);
  protected performanceMonitor: PerformanceMonitor;
  protected imageGenerator: ImageUrlGenerator;

  abstract name: string;
  abstract description: string;
  abstract dependencies: string[];
  abstract collections: string[];

  constructor(
    protected models: Record<string, Model<any>>,
    performanceMonitor: PerformanceMonitor,
    imageGenerator: ImageUrlGenerator,
  ) {
    this.performanceMonitor = performanceMonitor;
    this.imageGenerator = imageGenerator;
  }

  async execute(config: SeederConfig): Promise<SeederPhaseResult> {
    const startTime = Date.now();
    this.performanceMonitor.startPhase(this.name);

    this.logger.log(`🌱 Starting ${this.name} phase...`);

    const result: SeederPhaseResult = {
      phase: this.name,
      success: false,
      collectionsSeeded: [],
      recordCounts: {},
      duration: 0,
      errors: [],
    };

    try {
      // Clean collections if not incremental
      if (!config.incremental) {
        await this.cleanCollections();
      }

      // Execute phase-specific seeding
      const recordCounts = await this.seedData(config);

      result.recordCounts = recordCounts;
      result.collectionsSeeded = Object.keys(recordCounts);
      result.success = true;

      const totalRecords = Object.values(recordCounts).reduce(
        (sum, count) => sum + count,
        0,
      );
      this.performanceMonitor.updatePhaseProgress(this.name, totalRecords);
    } catch (error) {
      this.logger.error(`❌ Error in ${this.name} phase:`, error);
      result.errors = [error.message];
      result.success = false;
    }

    result.duration = Date.now() - startTime;
    this.performanceMonitor.endPhase(this.name);

    this.logger.log(
      `${result.success ? "✅" : "❌"} ${this.name} phase completed in ${result.duration}ms`,
    );

    return result;
  }

  async clean(): Promise<void> {
    this.logger.log(`🧹 Cleaning ${this.name} phase collections...`);
    await this.cleanCollections();
  }

  async validate(): Promise<ValidationResult> {
    this.logger.log(`🔍 Validating ${this.name} phase data...`);

    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Basic collection existence check
      for (const collection of this.collections) {
        const model = this.models[collection];
        if (!model) {
          errors.push(`Model not found for collection: ${collection}`);
          continue;
        }

        const count = await model.countDocuments();
        if (count === 0) {
          warnings.push(`Collection ${collection} is empty`);
        }
      }

      // Phase-specific validation
      await this.validatePhaseData(errors, warnings);
    } catch (error) {
      errors.push(`Validation failed: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Abstract methods to be implemented by each phase
  protected abstract seedData(
    config: SeederConfig,
  ): Promise<Record<string, number>>;
  protected abstract validatePhaseData(
    errors: string[],
    warnings: string[],
  ): Promise<void>;

  // Common utility methods
  protected async cleanCollections(): Promise<void> {
    const cleanPromises = this.collections.map(async (collection) => {
      const model = this.models[collection];
      if (model) {
        await model.deleteMany({});
        this.logger.log(`   Cleaned ${collection}`);
      }
    });

    await Promise.all(cleanPromises);
  }

  protected async insertMany<T>(
    model: Model<T>,
    documents: any[],
    collectionName: string,
  ): Promise<T[]> {
    if (documents.length === 0) return [];

    try {
      const result = (await model.insertMany(documents)) as T[];
      this.logger.log(`   ✅ Created ${result.length} ${collectionName}`);
      return result;
    } catch (error) {
      this.logger.error(`   ❌ Error creating ${collectionName}:`, error);
      throw error;
    }
  }

  protected getRandomElements<T>(array: T[], count: number): T[] {
    return faker.helpers.arrayElements(array, count);
  }

  protected getRandomElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  protected generateRealisticDate(
    options: {
      past?: boolean;
      future?: boolean;
      days?: number;
      months?: number;
    } = {},
  ): Date {
    if (options.future) {
      return faker.date.future({
        years: options.months ? options.months / 12 : undefined,
        refDate: new Date(),
      });
    } else if (options.past) {
      return faker.date.past({
        years: options.months ? options.months / 12 : undefined,
        refDate: new Date(),
      });
    } else {
      return faker.date.recent({ days: options.days || 30 });
    }
  }

  protected generateBusinessHours(): {
    open: string;
    close: string;
    days: string[];
  } {
    const openHour = faker.number.int({ min: 7, max: 10 });
    const closeHour = faker.number.int({ min: 20, max: 23 });

    return {
      open: `${openHour.toString().padStart(2, "0")}:00`,
      close: `${closeHour.toString().padStart(2, "0")}:00`,
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    };
  }

  protected generateIndianAddress(city?: string): any {
    const cities = [
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Kolkata",
      "Ahmedabad",
      "Jaipur",
      "Lucknow",
    ];

    const selectedCity = city || faker.helpers.arrayElement(cities);

    return {
      street: faker.location.streetAddress(),
      city: selectedCity,
      state: this.getCityState(selectedCity),
      postalCode: faker.location.zipCode("######"),
      country: "India",
      landmark: faker.helpers.maybe(() => faker.location.secondaryAddress(), {
        probability: 0.6,
      }),
    };
  }

  private getCityState(city: string): string {
    const cityStateMap: Record<string, string> = {
      Mumbai: "Maharashtra",
      Delhi: "Delhi",
      Bangalore: "Karnataka",
      Chennai: "Tamil Nadu",
      Hyderabad: "Telangana",
      Pune: "Maharashtra",
      Kolkata: "West Bengal",
      Ahmedabad: "Gujarat",
      Jaipur: "Rajasthan",
      Lucknow: "Uttar Pradesh",
    };

    return cityStateMap[city] || "Maharashtra";
  }

  protected generatePhoneNumber(): string {
    return `+91-${faker.string.numeric(10)}`;
  }

  protected generatePrice(min: number = 50, max: number = 500): number {
    return faker.number.int({ min, max });
  }

  protected generateRating(min: number = 3.0, max: number = 5.0): number {
    return faker.number.float({ min, max, fractionDigits: 1 });
  }

  protected logProgress(current: number, total: number, item: string): void {
    if (current % Math.max(1, Math.floor(total / 10)) === 0) {
      const percentage = ((current / total) * 100).toFixed(1);
      this.logger.log(
        `   📈 ${item} progress: ${current}/${total} (${percentage}%)`,
      );
    }
  }
}
