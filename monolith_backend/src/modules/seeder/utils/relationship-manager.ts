import { Injectable, Logger } from "@nestjs/common";
import { Model, Document } from "mongoose";

export interface RelationshipRule {
  parentCollection: string;
  childCollection: string;
  foreignKey: string;
  required: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

@Injectable()
export class RelationshipManager {
  private readonly logger = new Logger(RelationshipManager.name);
  private relationships: Map<string, RelationshipRule[]> = new Map();

  constructor() {
    this.initializeRelationships();
  }

  private initializeRelationships() {
    // Define all collection relationships
    const rules: RelationshipRule[] = [
      // User relationships
      {
        parentCollection: "users",
        childCollection: "partners",
        foreignKey: "user",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "customerprofiles",
        foreignKey: "user",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "orders",
        foreignKey: "customer",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "orders",
        foreignKey: "businessPartner",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "subscriptions",
        foreignKey: "customer",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "payments",
        foreignKey: "customerId",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "paymentmethods",
        foreignKey: "customerId",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "feedback",
        foreignKey: "user",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "testimonials",
        foreignKey: "user",
        required: false,
      },
      {
        parentCollection: "users",
        childCollection: "referrals",
        foreignKey: "referrer",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "conversations",
        foreignKey: "participants.userId",
        required: true,
      },
      {
        parentCollection: "users",
        childCollection: "chatmessages",
        foreignKey: "senderId",
        required: true,
      },

      // Partner relationships
      {
        parentCollection: "partners",
        childCollection: "categories",
        foreignKey: "businessPartner",
        required: true,
      },
      {
        parentCollection: "partners",
        childCollection: "menuitems",
        foreignKey: "businessPartner",
        required: true,
      },
      {
        parentCollection: "partners",
        childCollection: "meals",
        foreignKey: "businessPartner",
        required: true,
      },

      // Category relationships
      {
        parentCollection: "categories",
        childCollection: "menuitems",
        foreignKey: "category",
        required: true,
      },

      // Subscription Plan relationships
      {
        parentCollection: "subscriptionplans",
        childCollection: "subscriptions",
        foreignKey: "plan",
        required: true,
      },

      // Order relationships
      {
        parentCollection: "orders",
        childCollection: "payments",
        foreignKey: "referenceId",
        required: false,
      },

      // Subscription relationships
      {
        parentCollection: "subscriptions",
        childCollection: "payments",
        foreignKey: "referenceId",
        required: false,
      },
      {
        parentCollection: "subscriptions",
        childCollection: "meals",
        foreignKey: "subscription",
        required: false,
      },

      // Conversation relationships
      {
        parentCollection: "conversations",
        childCollection: "chatmessages",
        foreignKey: "conversationId",
        required: true,
      },
      {
        parentCollection: "conversations",
        childCollection: "typingindicators",
        foreignKey: "conversationId",
        required: true,
      },
    ];

    // Group by parent collection
    rules.forEach((rule) => {
      if (!this.relationships.has(rule.parentCollection)) {
        this.relationships.set(rule.parentCollection, []);
      }
      this.relationships.get(rule.parentCollection)!.push(rule);
    });
  }

  // Get all child collections for a parent
  getChildCollections(parentCollection: string): string[] {
    const rules = this.relationships.get(parentCollection) || [];
    return rules.map((rule) => rule.childCollection);
  }

  // Get all parent collections for a child
  getParentCollections(childCollection: string): string[] {
    const parents: string[] = [];
    this.relationships.forEach((rules, parent) => {
      if (rules.some((rule) => rule.childCollection === childCollection)) {
        parents.push(parent);
      }
    });
    return parents;
  }

  // Get seeding order based on dependencies
  getSeededOrder(collections: string[]): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const result: string[] = [];

    const visit = (collection: string) => {
      if (visiting.has(collection)) {
        throw new Error(`Circular dependency detected involving ${collection}`);
      }
      if (visited.has(collection)) {
        return;
      }

      visiting.add(collection);

      // Visit all parents first
      const parents = this.getParentCollections(collection);
      parents.forEach((parent) => {
        if (collections.includes(parent)) {
          visit(parent);
        }
      });

      visiting.delete(collection);
      visited.add(collection);
      result.push(collection);
    };

    collections.forEach((collection) => {
      if (!visited.has(collection)) {
        visit(collection);
      }
    });

    return result;
  }

  // Validate relationships in data
  async validateRelationships(
    models: Record<string, Model<any>>,
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      for (const [parentCollection, rules] of this.relationships) {
        const parentModel = models[parentCollection];
        if (!parentModel) continue;

        for (const rule of rules) {
          const childModel = models[rule.childCollection];
          if (!childModel) continue;

          await this.validateRelationship(
            parentModel,
            childModel,
            rule,
            errors,
            warnings,
          );
        }
      }
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private async validateRelationship(
    parentModel: Model<any>,
    childModel: Model<any>,
    rule: RelationshipRule,
    errors: string[],
    warnings: string[],
  ) {
    try {
      // Check for orphaned child records
      const orphanedQuery: any = {};

      if (rule.foreignKey.includes(".")) {
        // Handle nested fields like 'participants.userId'
        const [field, subfield] = rule.foreignKey.split(".");
        orphanedQuery[`${field}.${subfield}`] = { $exists: true };
      } else {
        orphanedQuery[rule.foreignKey] = { $exists: true, $ne: null };
      }

      const childRecords = await childModel.find(orphanedQuery).limit(100);

      for (const child of childRecords) {
        let foreignKeyValue;

        if (rule.foreignKey.includes(".")) {
          const [field, subfield] = rule.foreignKey.split(".");
          foreignKeyValue = child[field]?.[subfield];
        } else {
          foreignKeyValue = child[rule.foreignKey];
        }

        if (foreignKeyValue) {
          const parentExists = await parentModel.findById(foreignKeyValue);
          if (!parentExists) {
            const message = `Orphaned ${rule.childCollection} record with ${rule.foreignKey}: ${foreignKeyValue}`;
            if (rule.required) {
              errors.push(message);
            } else {
              warnings.push(message);
            }
          }
        }
      }
    } catch (error) {
      warnings.push(
        `Could not validate relationship ${rule.parentCollection} -> ${rule.childCollection}: ${error.message}`,
      );
    }
  }

  // Get collections that should be cleaned when a parent is cleaned
  getCascadeCollections(parentCollection: string): string[] {
    return this.getChildCollections(parentCollection);
  }

  // Check if a collection can be safely deleted
  async canDelete(
    collection: string,
    models: Record<string, Model<any>>,
    recordId?: string,
  ): Promise<{ canDelete: boolean; blockers: string[] }> {
    const blockers: string[] = [];
    const childCollections = this.getChildCollections(collection);

    for (const childCollection of childCollections) {
      const childModel = models[childCollection];
      if (!childModel) continue;

      const rules = this.relationships.get(collection) || [];
      const rule = rules.find((r) => r.childCollection === childCollection);
      if (!rule || !rule.required) continue;

      const query = recordId ? { [rule.foreignKey]: recordId } : {};
      const count = await childModel.countDocuments(query);

      if (count > 0) {
        blockers.push(
          `${count} ${childCollection} records depend on this ${collection}`,
        );
      }
    }

    return {
      canDelete: blockers.length === 0,
      blockers,
    };
  }
}
