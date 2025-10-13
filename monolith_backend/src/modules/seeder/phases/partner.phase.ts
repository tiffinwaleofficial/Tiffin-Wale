import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { faker } from "@faker-js/faker";
import { BaseSeederPhase } from "./base.phase";
import { SeederConfig } from "../interfaces/seeder-phase.interface";
import { PerformanceMonitor } from "../utils/performance-monitor";
import { ImageUrlGenerator } from "../config/image-sources";

// Import schemas
import { Partner, PartnerStatus } from "../../partner/schemas/partner.schema";
import { Category } from "../../menu/schemas/category.schema";
import { MenuItem } from "../../menu/schemas/menu-item.schema";
import { UserRole } from "../../../common/interfaces/user.interface";

@Injectable()
export class PartnerPhase extends BaseSeederPhase {
  name = "partner";
  description = "Restaurants, menus, categories with realistic images";
  dependencies = ["core"];
  collections = ["partners", "categories", "menuitems"];

  private partners: Partner[] = [];
  private categories: Category[] = [];
  private menuItems: MenuItem[] = [];

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

    // Get business users from core phase
    const businessUsers = await this.models.users.find({
      role: UserRole.BUSINESS,
    });

    if (businessUsers.length === 0) {
      throw new Error("No business users found. Core phase must be run first.");
    }

    // Seed partners
    await this.seedPartners(businessUsers, volumes.partners, config);

    // Seed categories and menu items
    await this.seedCategoriesAndMenuItems(volumes, config);

    return {
      partners: this.partners.length,
      categories: this.categories.length,
      menuitems: this.menuItems.length,
    };
  }

  private async seedPartners(
    businessUsers: any[],
    partnerCount: number,
    config: SeederConfig,
  ): Promise<void> {
    this.logger.log("🏪 Seeding partners...");

    const partnersToCreate = [];
    const cities = config.geographic.cities;

    const cuisineTypes = [
      "North Indian",
      "South Indian",
      "Chinese",
      "Italian",
      "Mexican",
      "Thai",
      "Continental",
      "Fast Food",
      "Healthy",
      "Vegan",
      "Bengali",
      "Punjabi",
      "Gujarati",
      "Rajasthani",
      "Kerala",
      "Hyderabadi",
      "Street Food",
      "Desserts",
      "Beverages",
    ];

    const businessNameSuffixes = [
      "Restaurant",
      "Cafe",
      "Kitchen",
      "Dhaba",
      "Palace",
      "Corner",
      "Express",
      "Delight",
      "Spice",
      "Flavors",
      "Bites",
      "Hub",
      "Junction",
      "Paradise",
      "Garden",
      "House",
    ];

    // Use available business users, cycling if needed
    for (let i = 0; i < Math.min(partnerCount, businessUsers.length); i++) {
      const user = businessUsers[i];
      const city = this.getRandomElement(cities);
      const selectedCuisines = this.getRandomElements(
        cuisineTypes,
        faker.number.int({ min: 1, max: 3 }),
      );

      // Generate realistic business name
      const nameBase =
        faker.helpers.maybe(() => faker.person.firstName(), {
          probability: 0.3,
        }) ||
        faker.helpers.maybe(() => city, { probability: 0.2 }) ||
        this.getRandomElement([
          "Royal",
          "Golden",
          "Spicy",
          "Fresh",
          "Tasty",
          "Delicious",
        ]);
      const businessName = `${nameBase} ${this.getRandomElement(businessNameSuffixes)}`;

      partnersToCreate.push({
        user: user._id,
        businessName,
        description: this.generateBusinessDescription(selectedCuisines),
        cuisineTypes: selectedCuisines,
        address: this.generateIndianAddress(city),
        businessHours: this.generateBusinessHours(),
        status: faker.helpers.weightedArrayElement([
          { weight: 8, value: PartnerStatus.APPROVED },
          { weight: 1, value: PartnerStatus.PENDING },
          { weight: 1, value: PartnerStatus.REJECTED },
        ]),
        isAcceptingOrders: faker.datatype.boolean(0.85), // 85% accepting orders
        isFeatured: faker.datatype.boolean(0.2), // 20% featured
        averageRating: this.generateRating(3.2, 4.9),
        totalReviews: faker.number.int({ min: 5, max: 500 }),

        // Enhanced fields with images
        logoUrl: this.imageGenerator.generateRestaurantImage(businessName),
        bannerUrl: this.imageGenerator.generateRestaurantImage(),

        // Business details
        establishedYear: faker.number.int({ min: 2015, max: 2023 }),
        licenseNumber: `LIC${faker.string.alphanumeric(8).toUpperCase()}`,
        gstNumber: `${faker.string.alphanumeric(2).toUpperCase()}${faker.string.numeric(13)}`,

        // Delivery information
        deliveryRadius: faker.number.int({ min: 3, max: 15 }), // km
        minimumOrderAmount: faker.number.int({ min: 100, max: 300 }),
        deliveryFee: faker.number.int({ min: 0, max: 50 }),
        estimatedDeliveryTime: faker.number.int({ min: 20, max: 60 }), // minutes

        // Financial information
        commissionRate: faker.number.float({
          min: 15,
          max: 25,
          fractionDigits: 1,
        }), // percentage

        // Contact information
        contactEmail: faker.internet.email(),
        contactPhone: this.generatePhoneNumber(),
        whatsappNumber: this.generatePhoneNumber(),

        // Social media
        socialMedia: {
          instagram: faker.helpers.maybe(
            () => `@${businessName.toLowerCase().replace(/\s+/g, "")}`,
          ),
          facebook: faker.helpers.maybe(() => businessName),
          twitter: faker.helpers.maybe(
            () => `@${businessName.toLowerCase().replace(/\s+/g, "")}`,
          ),
        },

        // Operational details
        isVegetarian: faker.datatype.boolean(0.3),
        hasDelivery: faker.datatype.boolean(0.9),
        hasPickup: faker.datatype.boolean(0.7),
        acceptsCash: faker.datatype.boolean(0.95),
        acceptsCard: faker.datatype.boolean(0.8),
        acceptsUPI: faker.datatype.boolean(0.9),

        createdAt: this.generateRealisticDate({ past: true, days: 180 }),
        updatedAt: this.generateRealisticDate({ past: true, days: 7 }),
      });

      this.logProgress(
        i + 1,
        Math.min(partnerCount, businessUsers.length),
        "Partners",
      );
    }

    this.partners = (await this.insertMany(
      this.models.partners,
      partnersToCreate,
      "partners",
    )) as Partner[];

    this.logPartnerDistribution();
  }

  private generateBusinessDescription(cuisineTypes: string[]): string {
    const templates = [
      `Authentic ${cuisineTypes[0]} restaurant serving traditional flavors with modern presentation.`,
      `Experience the best of ${cuisineTypes.join(" and ")} cuisine in a warm, welcoming atmosphere.`,
      `Family-owned restaurant specializing in ${cuisineTypes[0]} dishes made with fresh, local ingredients.`,
      `Modern ${cuisineTypes[0]} kitchen offering both classic favorites and innovative fusion dishes.`,
      `Cozy dining spot famous for our ${cuisineTypes[0]} specialties and exceptional service.`,
    ];

    return this.getRandomElement(templates);
  }

  private async seedCategoriesAndMenuItems(
    volumes: any,
    config: SeederConfig,
  ): Promise<void> {
    this.logger.log("🍽️ Seeding categories and menu items...");

    const categoriesToCreate = [];
    const menuItemsToCreate = [];

    const categoryNames = [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snacks",
      "Beverages",
      "Desserts",
      "Starters",
      "Main Course",
      "Rice & Biryani",
      "Bread & Roti",
      "Dal & Curry",
      "Chinese",
      "South Indian",
      "Street Food",
      "Healthy Options",
      "Kids Menu",
      "Combo Meals",
    ];

    // Create categories for each partner
    for (const partner of this.partners) {
      const categoryCount = faker.number.int(volumes.categoriesPerPartner);
      const selectedCategories = this.getRandomElements(
        categoryNames,
        categoryCount,
      );

      for (const categoryName of selectedCategories) {
        const category = {
          name: categoryName,
          description: this.generateCategoryDescription(categoryName),
          businessPartner: partner._id, // Use partner._id instead of partner.user
          isActive: faker.datatype.boolean(0.95),
          displayOrder: faker.number.int({ min: 1, max: 10 }),
          image: this.imageGenerator.generateFoodImage(
            categoryName.toLowerCase(),
          ),
          createdAt: this.generateRealisticDate({ past: true, days: 90 }),
          updatedAt: this.generateRealisticDate({ past: true, days: 7 }),
        };

        categoriesToCreate.push(category);
      }
    }

    this.categories = (await this.insertMany(
      this.models.categories,
      categoriesToCreate,
      "categories",
    )) as Category[];

    // Create menu items for each category
    let itemCount = 0;
    for (const category of this.categories) {
      const partner = this.partners.find(
        (p) => p._id.toString() === category.businessPartner.toString(),
      );
      if (!partner) continue;

      const itemsPerCategory = faker.number.int(volumes.menuItemsPerCategory);

      for (let i = 0; i < itemsPerCategory; i++) {
        const menuItem = this.generateMenuItem(category, partner);
        menuItemsToCreate.push(menuItem);
        itemCount++;

        if (itemCount % 50 === 0) {
          this.logProgress(itemCount, this.categories.length * 6, "Menu items");
        }
      }
    }

    this.menuItems = (await this.insertMany(
      this.models.menuitems,
      menuItemsToCreate,
      "menu items",
    )) as MenuItem[];
  }

  private generateCategoryDescription(categoryName: string): string {
    const descriptions: Record<string, string> = {
      Breakfast:
        "Start your day with our nutritious and delicious breakfast options",
      Lunch: "Satisfying lunch dishes to fuel your afternoon",
      Dinner: "Perfect dinner selections for a memorable evening meal",
      Snacks: "Light bites and snacks for any time of day",
      Beverages: "Refreshing drinks to complement your meal",
      Desserts: "Sweet treats to end your meal on a perfect note",
      Starters: "Appetizing starters to kick off your dining experience",
      "Main Course": "Hearty main dishes that satisfy your hunger",
      "Rice & Biryani": "Aromatic rice dishes and flavorful biryanis",
      "Street Food": "Authentic street food favorites",
    };

    return (
      descriptions[categoryName] ||
      `Delicious ${categoryName.toLowerCase()} options`
    );
  }

  private generateMenuItem(category: Category, partner: Partner): any {
    const categoryBasedItems = this.getCategoryBasedItems(category.name);
    const itemName = this.getRandomElement(categoryBasedItems);

    // Price based on category and restaurant type
    const priceRange = this.getPriceRange(category.name, partner.cuisineTypes);

    return {
      name: itemName,
      description: this.generateItemDescription(itemName, category.name),
      price: faker.number.int(priceRange),
      businessPartner: partner._id, // Use partner._id instead of partner.user
      category: category._id,
      isAvailable: faker.datatype.boolean(0.9),
      isVegetarian: faker.datatype.boolean(0.6),
      isVegan: faker.datatype.boolean(0.2),
      isGlutenFree: faker.datatype.boolean(0.1),

      // Enhanced fields
      imageUrl: this.imageGenerator.generateFoodImage(
        category.name.toLowerCase(),
        itemName,
      ),
      images: this.imageGenerator.generateImageGallery('food', category.name.toLowerCase(), 3),
      averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
      totalReviews: faker.number.int({ min: 0, max: 150 }),

      tags: this.generateItemTags(itemName, category.name),
      allergens: this.generateAllergens(),
      spiceLevel: this.generateSpiceLevel(),

      nutritionalInfo: {
        calories: faker.number.int({ min: 150, max: 800 }),
        protein: faker.number.int({ min: 5, max: 50 }),
        carbs: faker.number.int({ min: 10, max: 100 }),
        fat: faker.number.int({ min: 2, max: 40 }),
        fiber: faker.number.int({ min: 1, max: 15 }),
      },

      preparationTime: faker.number.int({ min: 10, max: 45 }), // minutes
      servingSize: faker.helpers.arrayElement([
        "1 person",
        "1-2 people",
        "2-3 people",
      ]),

      // Customization options
      customizations: this.generateCustomizations(category.name),

      // Ratings and reviews (already set above)
      totalRatings: faker.number.int({ min: 0, max: 100 }),

      // Availability
      availableDays: faker.helpers.arrayElements(
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        { min: 5, max: 7 },
      ),
      availableHours: {
        start: "09:00",
        end: "22:00",
      },

      createdAt: this.generateRealisticDate({ past: true, days: 60 }),
      updatedAt: this.generateRealisticDate({ past: true, days: 3 }),
    };
  }

  private getCategoryBasedItems(categoryName: string): string[] {
    const itemsByCategory: Record<string, string[]> = {
      Breakfast: [
        "Masala Dosa",
        "Idli Sambar",
        "Upma",
        "Poha",
        "Paratha",
        "Aloo Puri",
        "Chole Bhature",
        "Uttapam",
        "Medu Vada",
        "Rava Dosa",
        "Pancakes",
        "French Toast",
      ],
      Lunch: [
        "Dal Rice",
        "Rajma Rice",
        "Curd Rice",
        "Sambar Rice",
        "Chicken Curry",
        "Mutton Curry",
        "Fish Curry",
        "Paneer Butter Masala",
        "Aloo Gobi",
        "Mixed Veg",
      ],
      Dinner: [
        "Butter Chicken",
        "Biryani",
        "Pulao",
        "Naan",
        "Roti",
        "Tandoori Chicken",
        "Palak Paneer",
        "Dal Makhani",
        "Jeera Rice",
        "Fried Rice",
      ],
      Snacks: [
        "Samosa",
        "Pakora",
        "Bhel Puri",
        "Pani Puri",
        "Dhokla",
        "Kachori",
        "Vada Pav",
        "Pav Bhaji",
        "Chaat",
        "Spring Roll",
        "Momos",
        "Sandwich",
      ],
      Beverages: [
        "Masala Chai",
        "Filter Coffee",
        "Lassi",
        "Fresh Lime",
        "Buttermilk",
        "Mango Shake",
        "Cold Coffee",
        "Green Tea",
        "Coconut Water",
        "Fresh Juice",
      ],
      Desserts: [
        "Gulab Jamun",
        "Rasgulla",
        "Kheer",
        "Halwa",
        "Kulfi",
        "Ice Cream",
        "Jalebi",
        "Rabri",
        "Ras Malai",
        "Gajar Halwa",
        "Chocolate Cake",
      ],
    };

    return (
      itemsByCategory[categoryName] || [
        "Special Dish",
        "Chef Special",
        "House Special",
      ]
    );
  }

  private getPriceRange(
    categoryName: string,
    cuisineTypes: string[],
  ): { min: number; max: number } {
    const baseRanges: Record<string, { min: number; max: number }> = {
      Breakfast: { min: 60, max: 150 },
      Lunch: { min: 120, max: 300 },
      Dinner: { min: 150, max: 400 },
      Snacks: { min: 40, max: 120 },
      Beverages: { min: 30, max: 100 },
      Desserts: { min: 50, max: 150 },
    };

    const range = baseRanges[categoryName] || { min: 80, max: 200 };

    // Adjust for cuisine type
    if (
      cuisineTypes.includes("Continental") ||
      cuisineTypes.includes("Italian")
    ) {
      range.min += 30;
      range.max += 50;
    }

    return range;
  }

  private generateItemDescription(
    itemName: string,
    categoryName: string,
  ): string {
    const adjectives = [
      "delicious",
      "authentic",
      "fresh",
      "homemade",
      "traditional",
      "special",
    ];
    const cookingMethods = [
      "perfectly cooked",
      "slow-cooked",
      "freshly prepared",
      "expertly crafted",
    ];

    const adjective = this.getRandomElement(adjectives);
    const method = this.getRandomElement(cookingMethods);

    return `${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${itemName.toLowerCase()} ${method} with authentic spices and fresh ingredients.`;
  }

  private generateItemTags(itemName: string, categoryName: string): string[] {
    const commonTags = ["Popular", "Chef Special", "Recommended"];
    const spiceTags = ["Spicy", "Mild", "Medium Spicy"];
    const dietTags = ["Vegetarian", "Vegan", "Healthy"];

    const tags = [];
    tags.push(this.getRandomElement(commonTags));

    if (faker.datatype.boolean(0.3)) {
      tags.push(this.getRandomElement(spiceTags));
    }

    if (faker.datatype.boolean(0.4)) {
      tags.push(this.getRandomElement(dietTags));
    }

    return tags;
  }

  private generateAllergens(): string[] {
    const allergens = ["Nuts", "Dairy", "Gluten", "Soy", "Eggs"];
    return faker.helpers.arrayElements(allergens, { min: 0, max: 2 });
  }

  private generateSpiceLevel(): string {
    return faker.helpers.arrayElement([
      "Mild",
      "Medium",
      "Spicy",
      "Very Spicy",
    ]);
  }

  private generateCustomizations(categoryName: string): string[] {
    const commonCustomizations = [
      "Extra Spicy",
      "Less Spicy",
      "No Onion",
      "Extra Cheese",
    ];
    const beverageCustomizations = ["Less Sugar", "Extra Sugar", "Hot", "Cold"];

    if (categoryName === "Beverages") {
      return faker.helpers.arrayElements(
        [...commonCustomizations, ...beverageCustomizations],
        { min: 1, max: 3 },
      );
    }

    return faker.helpers.arrayElements(commonCustomizations, {
      min: 1,
      max: 2,
    });
  }

  private logPartnerDistribution(): void {
    const statusDistribution = this.partners.reduce(
      (acc, partner) => {
        acc[partner.status] = (acc[partner.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const cuisineDistribution = this.partners.reduce(
      (acc, partner) => {
        partner.cuisineTypes.forEach((cuisine) => {
          acc[cuisine] = (acc[cuisine] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    this.logger.log("📊 Partner distribution:");
    this.logger.log("   Status:", statusDistribution);
    this.logger.log(
      "   Top cuisines:",
      Object.entries(cuisineDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([cuisine, count]) => `${cuisine}: ${count}`)
        .join(", "),
    );
  }

  protected async validatePhaseData(
    errors: string[],
    warnings: string[],
  ): Promise<void> {
    // Validate partners
    const partnerCount = await this.models.partners.countDocuments();
    if (partnerCount === 0) {
      errors.push("No partners created");
      return;
    }

    // Check partner-user relationships
    const partnersWithoutUsers = await this.models.partners.countDocuments({
      user: { $exists: false },
    });
    if (partnersWithoutUsers > 0) {
      errors.push(`${partnersWithoutUsers} partners without user references`);
    }

    // Validate categories
    const categoryCount = await this.models.categories.countDocuments();
    if (categoryCount === 0) {
      warnings.push("No categories created");
    }

    // Validate menu items
    const menuItemCount = await this.models.menuitems.countDocuments();
    if (menuItemCount === 0) {
      warnings.push("No menu items created");
    }

    // Check menu item prices
    const expensiveItems = await this.models.menuitems.countDocuments({
      price: { $gt: 1000 },
    });
    if (expensiveItems > 0) {
      warnings.push(`${expensiveItems} menu items with unusually high prices`);
    }
  }

  // Getter methods for other phases
  getPartners(): Partner[] {
    return [...this.partners];
  }

  getCategories(): Category[] {
    return [...this.categories];
  }

  getMenuItems(): MenuItem[] {
    return [...this.menuItems];
  }

  getPartnersByCity(city: string): Partner[] {
    return this.partners.filter((partner) => partner.address?.city === city);
  }

  getMenuItemsByPartner(partnerId: string): MenuItem[] {
    return this.menuItems.filter(
      (item) => item.businessPartner.toString() === partnerId,
    );
  }
}
