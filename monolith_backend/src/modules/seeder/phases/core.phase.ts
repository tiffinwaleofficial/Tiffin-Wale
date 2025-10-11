import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { BaseSeederPhase } from "./base.phase";
import { SeederConfig } from "../interfaces/seeder-phase.interface";
import { PerformanceMonitor } from "../utils/performance-monitor";
import { ImageUrlGenerator } from "../config/image-sources";

// Import schemas
import { User } from "../../user/schemas/user.schema";
import { UserRole } from "../../../common/interfaces/user.interface";

@Injectable()
export class CorePhase extends BaseSeederPhase {
  name = "core";
  description = "Users, authentication, and basic system setup";
  dependencies: string[] = [];
  collections = ["users"];

  private users: User[] = [];

  constructor(
    models: Record<string, Model<any>>,
    performanceMonitor: PerformanceMonitor,
    imageGenerator: ImageUrlGenerator,
  ) {
    super(models, performanceMonitor, imageGenerator);
  }

  protected async seedData(
    config: SeederConfig,
  ): Promise<Record<string, number>> {
    const volumes = config.volumes;

    // Seed users
    await this.seedUsers(volumes.users);

    return {
      users: this.users.length,
    };
  }

  private async seedUsers(userVolumes: {
    admin: number;
    business: number;
    customer: number;
  }): Promise<void> {
    this.logger.log("👥 Seeding users...");

    const usersToCreate = [];
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash("password", salt);

    // Create admin users
    for (let i = 0; i < userVolumes.admin; i++) {
      const isSuper = i === 0; // First admin is super admin
      usersToCreate.push({
        email: isSuper
          ? "superadmin@tiffin-wale.com"
          : `admin${i}@tiffin-wale.com`,
        password: hashedPassword,
        role: isSuper ? UserRole.SUPER_ADMIN : UserRole.ADMIN,
        firstName: isSuper ? "Super" : "Admin",
        lastName: isSuper ? "Admin" : `User ${i}`,
        phoneNumber: this.generatePhoneNumber(),
        isActive: true,
        profileImage: this.imageGenerator.generateProfileImage(`Admin ${i}`),
        createdAt: this.generateRealisticDate({ past: true, days: 365 }),
        updatedAt: new Date(),
      });
    }

    // Create business users (restaurant partners)
    for (let i = 0; i < userVolumes.business; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      usersToCreate.push({
        email: faker.internet.email({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
        }),
        password: hashedPassword,
        role: UserRole.BUSINESS,
        firstName,
        lastName,
        phoneNumber: this.generatePhoneNumber(),
        isActive: faker.datatype.boolean(0.9), // 90% active business users
        profileImage: this.imageGenerator.generateProfileImage(
          `${firstName} ${lastName}`,
        ),
        createdAt: this.generateRealisticDate({ past: true, days: 180 }),
        updatedAt: this.generateRealisticDate({ past: true, days: 30 }),
        // Business-specific fields
        businessEmail: faker.internet.email({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          provider: "business.com",
        }),
        businessPhone: this.generatePhoneNumber(),
      });
    }

    // Create customer users
    const indianFirstNames = [
      "Aarav",
      "Vivaan",
      "Aditya",
      "Vihaan",
      "Arjun",
      "Sai",
      "Reyansh",
      "Ayaan",
      "Krishna",
      "Ishaan",
      "Shaurya",
      "Atharv",
      "Advik",
      "Pranav",
      "Vedant",
      "Aadhya",
      "Ananya",
      "Diya",
      "Kavya",
      "Anika",
      "Saanvi",
      "Ira",
      "Myra",
      "Tara",
      "Sara",
      "Riya",
      "Navya",
      "Kiara",
      "Aditi",
      "Arya",
    ];

    for (let i = 0; i < userVolumes.customer; i++) {
      const firstName = this.getRandomElement(indianFirstNames);
      const lastName = faker.person.lastName();

      usersToCreate.push({
        email: faker.internet.email({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
        }),
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        firstName,
        lastName,
        phoneNumber: this.generatePhoneNumber(),
        isActive: faker.datatype.boolean(0.95), // 95% active customers
        profileImage: this.imageGenerator.generateProfileImage(
          `${firstName} ${lastName}`,
        ),
        createdAt: this.generateRealisticDate({ past: true, days: 365 }),
        updatedAt: this.generateRealisticDate({ past: true, days: 7 }),
        // Customer-specific fields
        dateOfBirth: faker.date.birthdate({ min: 18, max: 30, mode: "age" }),
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        // Email verification status
        emailVerified: faker.datatype.boolean(0.8),
        emailVerifiedAt: faker.helpers.maybe(
          () => this.generateRealisticDate({ past: true, days: 30 }),
          { probability: 0.8 },
        ),
        // Phone verification status
        phoneVerified: faker.datatype.boolean(0.7),
        phoneVerifiedAt: faker.helpers.maybe(
          () => this.generateRealisticDate({ past: true, days: 30 }),
          { probability: 0.7 },
        ),
      });

      // Log progress
      this.logProgress(i + 1, userVolumes.customer, "Customer users");
    }

    // Insert all users
    this.users = (await this.insertMany(
      this.models.users,
      usersToCreate,
      "users",
    )) as User[];

    // Log user distribution
    this.logUserDistribution();
  }

  private logUserDistribution(): void {
    const distribution = this.users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    this.logger.log("📊 User distribution:");
    Object.entries(distribution).forEach(([role, count]) => {
      this.logger.log(`   ${role}: ${count} users`);
    });
  }

  protected async validatePhaseData(
    errors: string[],
    warnings: string[],
  ): Promise<void> {
    const userModel = this.models.users;
    if (!userModel) {
      errors.push("User model not found");
      return;
    }

    // Check for required admin users
    const adminCount = await userModel.countDocuments({ role: UserRole.ADMIN });
    const superAdminCount = await userModel.countDocuments({
      role: UserRole.SUPER_ADMIN,
    });

    if (superAdminCount === 0) {
      errors.push("No super admin user found");
    }

    if (adminCount === 0) {
      warnings.push("No admin users found");
    }

    // Check for duplicate emails
    const duplicateEmails = await userModel.aggregate([
      { $group: { _id: "$email", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (duplicateEmails.length > 0) {
      errors.push(`${duplicateEmails.length} duplicate email addresses found`);
    }

    // Check password hashing
    const sampleUser = await userModel.findOne({ role: UserRole.CUSTOMER });
    if (sampleUser && sampleUser.password === "password") {
      errors.push("Passwords are not properly hashed");
    }

    // Check user role distribution
    const totalUsers = await userModel.countDocuments();
    const customerCount = await userModel.countDocuments({
      role: UserRole.CUSTOMER,
    });
    const businessCount = await userModel.countDocuments({
      role: UserRole.BUSINESS,
    });

    if (customerCount < businessCount) {
      warnings.push(
        "More business users than customers - unusual distribution",
      );
    }

    if (totalUsers < 10) {
      warnings.push(
        "Very few users created - might not be sufficient for testing",
      );
    }
  }

  // Getter methods for other phases to access seeded data
  getUsers(): User[] {
    return [...this.users];
  }

  getUsersByRole(role: UserRole): User[] {
    return this.users.filter((user) => user.role === role);
  }

  getRandomUser(role?: UserRole): User {
    const filteredUsers = role ? this.getUsersByRole(role) : this.users;
    return this.getRandomElement(filteredUsers);
  }

  getRandomUsers(count: number, role?: UserRole): User[] {
    const filteredUsers = role ? this.getUsersByRole(role) : this.users;
    return this.getRandomElements(
      filteredUsers,
      Math.min(count, filteredUsers.length),
    );
  }
}
