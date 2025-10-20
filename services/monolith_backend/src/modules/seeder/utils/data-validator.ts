import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { ValidationResult } from "./relationship-manager";

export interface DataValidationRule {
  collection: string;
  field: string;
  rule: "required" | "unique" | "range" | "format" | "reference";
  params?: any;
  message?: string;
}

export interface CollectionStats {
  collection: string;
  count: number;
  sampleRecord?: any;
  issues: string[];
}

@Injectable()
export class DataValidator {
  private readonly logger = new Logger(DataValidator.name);
  private validationRules: DataValidationRule[] = [];

  constructor() {
    this.initializeValidationRules();
  }

  private initializeValidationRules(): void {
    this.validationRules = [
      // User validation rules
      {
        collection: "users",
        field: "email",
        rule: "required",
        message: "Email is required",
      },
      {
        collection: "users",
        field: "email",
        rule: "unique",
        message: "Email must be unique",
      },
      {
        collection: "users",
        field: "role",
        rule: "required",
        message: "Role is required",
      },

      // Partner validation rules
      {
        collection: "partners",
        field: "businessName",
        rule: "required",
        message: "Business name is required",
      },
      {
        collection: "partners",
        field: "user",
        rule: "reference",
        params: { collection: "users" },
        message: "Partner must reference valid user",
      },

      // Order validation rules
      {
        collection: "orders",
        field: "totalAmount",
        rule: "range",
        params: { min: 0 },
        message: "Total amount must be positive",
      },
      {
        collection: "orders",
        field: "customer",
        rule: "reference",
        params: { collection: "users" },
        message: "Order must reference valid customer",
      },
      {
        collection: "orders",
        field: "businessPartner",
        rule: "reference",
        params: { collection: "users" },
        message: "Order must reference valid business partner",
      },

      // Menu item validation rules
      {
        collection: "menuitems",
        field: "price",
        rule: "range",
        params: { min: 0 },
        message: "Price must be positive",
      },
      {
        collection: "menuitems",
        field: "businessPartner",
        rule: "reference",
        params: { collection: "users" },
        message: "Menu item must reference valid business partner",
      },
      {
        collection: "menuitems",
        field: "category",
        rule: "reference",
        params: { collection: "categories" },
        message: "Menu item must reference valid category",
      },

      // Payment validation rules
      {
        collection: "payments",
        field: "amount",
        rule: "range",
        params: { min: 0 },
        message: "Payment amount must be positive",
      },
      {
        collection: "payments",
        field: "customerId",
        rule: "reference",
        params: { collection: "users" },
        message: "Payment must reference valid customer",
      },

      // Subscription validation rules
      {
        collection: "subscriptions",
        field: "customer",
        rule: "reference",
        params: { collection: "users" },
        message: "Subscription must reference valid customer",
      },
      {
        collection: "subscriptions",
        field: "plan",
        rule: "reference",
        params: { collection: "subscriptionplans" },
        message: "Subscription must reference valid plan",
      },

      // Chat validation rules
      {
        collection: "conversations",
        field: "type",
        rule: "required",
        message: "Conversation type is required",
      },
      {
        collection: "chatmessages",
        field: "conversationId",
        rule: "reference",
        params: { collection: "conversations" },
        message: "Message must reference valid conversation",
      },
      {
        collection: "chatmessages",
        field: "senderId",
        rule: "reference",
        params: { collection: "users" },
        message: "Message must reference valid sender",
      },
    ];
  }

  async validateAllCollections(
    models: Record<string, Model<any>>,
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.logger.log("🔍 Starting comprehensive data validation...");

    try {
      // Group rules by collection
      const rulesByCollection = this.groupRulesByCollection();

      for (const [collection, rules] of rulesByCollection) {
        const model = models[collection];
        if (!model) {
          warnings.push(`Model not found for collection: ${collection}`);
          continue;
        }

        await this.validateCollection(
          model,
          collection,
          rules,
          errors,
          warnings,
        );
      }

      // Additional cross-collection validations
      await this.validateBusinessLogic(models, errors, warnings);
    } catch (error) {
      errors.push(`Validation process failed: ${error.message}`);
    }

    const result = {
      isValid: errors.length === 0,
      errors,
      warnings,
    };

    this.logValidationResults(result);
    return result;
  }

  private groupRulesByCollection(): Map<string, DataValidationRule[]> {
    const grouped = new Map<string, DataValidationRule[]>();

    this.validationRules.forEach((rule) => {
      if (!grouped.has(rule.collection)) {
        grouped.set(rule.collection, []);
      }
      grouped.get(rule.collection)!.push(rule);
    });

    return grouped;
  }

  private async validateCollection(
    model: Model<any>,
    collection: string,
    rules: DataValidationRule[],
    errors: string[],
    warnings: string[],
  ): Promise<void> {
    this.logger.log(`🔍 Validating ${collection}...`);

    const totalCount = await model.countDocuments();
    if (totalCount === 0) {
      warnings.push(`Collection ${collection} is empty`);
      return;
    }

    // Sample some records for validation
    const sampleSize = Math.min(100, totalCount);
    const records = await model.find().limit(sampleSize);

    for (const rule of rules) {
      await this.validateRule(
        model,
        collection,
        rule,
        records,
        errors,
        warnings,
      );
    }
  }

  private async validateRule(
    model: Model<any>,
    collection: string,
    rule: DataValidationRule,
    records: any[],
    errors: string[],
    warnings: string[],
  ): Promise<void> {
    switch (rule.rule) {
      case "required":
        await this.validateRequired(collection, rule, records, errors);
        break;
      case "unique":
        await this.validateUnique(model, collection, rule, errors);
        break;
      case "range":
        await this.validateRange(collection, rule, records, warnings);
        break;
      case "reference":
        await this.validateReference(collection, rule, records, errors);
        break;
      case "format":
        await this.validateFormat(collection, rule, records, warnings);
        break;
    }
  }

  private async validateRequired(
    collection: string,
    rule: DataValidationRule,
    records: any[],
    errors: string[],
  ): Promise<void> {
    const missingCount = records.filter(
      (record) =>
        !record[rule.field] ||
        record[rule.field] === null ||
        record[rule.field] === "",
    ).length;

    if (missingCount > 0) {
      errors.push(
        `${collection}: ${missingCount} records missing required field '${rule.field}'`,
      );
    }
  }

  private async validateUnique(
    model: Model<any>,
    collection: string,
    rule: DataValidationRule,
    errors: string[],
  ): Promise<void> {
    const pipeline = [
      { $group: { _id: `$${rule.field}`, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ];

    const duplicates = await model.aggregate(pipeline);
    if (duplicates.length > 0) {
      errors.push(
        `${collection}: ${duplicates.length} duplicate values found in field '${rule.field}'`,
      );
    }
  }

  private async validateRange(
    collection: string,
    rule: DataValidationRule,
    records: any[],
    warnings: string[],
  ): Promise<void> {
    const { min, max } = rule.params || {};
    let outOfRangeCount = 0;

    records.forEach((record) => {
      const value = record[rule.field];
      if (typeof value === "number") {
        if (
          (min !== undefined && value < min) ||
          (max !== undefined && value > max)
        ) {
          outOfRangeCount++;
        }
      }
    });

    if (outOfRangeCount > 0) {
      warnings.push(
        `${collection}: ${outOfRangeCount} records with '${rule.field}' out of range`,
      );
    }
  }

  private async validateReference(
    collection: string,
    rule: DataValidationRule,
    records: any[],
    errors: string[],
  ): Promise<void> {
    // This is a simplified reference validation
    // In a real implementation, you'd check against the referenced collection
    const missingRefs = records.filter((record) => !record[rule.field]).length;

    if (missingRefs > 0) {
      errors.push(
        `${collection}: ${missingRefs} records with missing reference '${rule.field}'`,
      );
    }
  }

  private async validateFormat(
    collection: string,
    rule: DataValidationRule,
    records: any[],
    warnings: string[],
  ): Promise<void> {
    // Add format validation logic here (email format, phone format, etc.)
    // This is a placeholder for format-specific validations
  }

  private async validateBusinessLogic(
    models: Record<string, Model<any>>,
    errors: string[],
    warnings: string[],
  ): Promise<void> {
    // Business logic validations
    await this.validateOrderTotals(models, errors, warnings);
    await this.validateSubscriptionDates(models, warnings);
    await this.validatePartnerStatus(models, warnings);
  }

  private async validateOrderTotals(
    models: Record<string, Model<any>>,
    errors: string[],
    warnings: string[],
  ): Promise<void> {
    const orderModel = models["orders"];
    if (!orderModel) return;

    const orders = await orderModel.find().limit(50);
    let mismatchCount = 0;

    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        const calculatedTotal = order.items.reduce(
          (sum: number, item: any) => sum + (item.price || 0),
          0,
        );
        if (Math.abs(calculatedTotal - order.totalAmount) > 0.01) {
          mismatchCount++;
        }
      }
    });

    if (mismatchCount > 0) {
      warnings.push(
        `Orders: ${mismatchCount} orders with total amount mismatch`,
      );
    }
  }

  private async validateSubscriptionDates(
    models: Record<string, Model<any>>,
    warnings: string[],
  ): Promise<void> {
    const subscriptionModel = models["subscriptions"];
    if (!subscriptionModel) return;

    const invalidDates = await subscriptionModel.countDocuments({
      $expr: { $gte: ["$startDate", "$endDate"] },
    });

    if (invalidDates > 0) {
      warnings.push(
        `Subscriptions: ${invalidDates} subscriptions with invalid date ranges`,
      );
    }
  }

  private async validatePartnerStatus(
    models: Record<string, Model<any>>,
    warnings: string[],
  ): Promise<void> {
    const partnerModel = models["partners"];
    const orderModel = models["orders"];
    if (!partnerModel || !orderModel) return;

    // Check for orders from inactive partners
    const inactivePartnerOrders = await orderModel.countDocuments({
      // This would need proper join logic in a real implementation
    });

    if (inactivePartnerOrders > 0) {
      warnings.push(
        `Orders: ${inactivePartnerOrders} orders from inactive partners`,
      );
    }
  }

  async getCollectionStats(
    models: Record<string, Model<any>>,
  ): Promise<CollectionStats[]> {
    const stats: CollectionStats[] = [];

    for (const [collectionName, model] of Object.entries(models)) {
      try {
        const count = await model.countDocuments();
        const sampleRecord = count > 0 ? await model.findOne() : null;
        const issues: string[] = [];

        // Basic health checks
        if (count === 0) {
          issues.push("Collection is empty");
        }

        stats.push({
          collection: collectionName,
          count,
          sampleRecord: sampleRecord ? this.sanitizeRecord(sampleRecord) : null,
          issues,
        });
      } catch (error) {
        stats.push({
          collection: collectionName,
          count: -1,
          issues: [`Error accessing collection: ${error.message}`],
        });
      }
    }

    return stats.sort((a, b) => b.count - a.count);
  }

  private sanitizeRecord(record: any): any {
    const sanitized = { ...record.toObject() };

    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.__v;

    // Truncate long strings
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "string" && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100) + "...";
      }
    });

    return sanitized;
  }

  private logValidationResults(result: ValidationResult): void {
    if (result.isValid) {
      this.logger.log("✅ Data validation completed successfully");
    } else {
      this.logger.error(
        `❌ Data validation failed with ${result.errors.length} errors`,
      );
      result.errors.forEach((error) => this.logger.error(`   - ${error}`));
    }

    if (result.warnings.length > 0) {
      this.logger.warn(`⚠️ ${result.warnings.length} warnings found:`);
      result.warnings.forEach((warning) => this.logger.warn(`   - ${warning}`));
    }
  }
}
