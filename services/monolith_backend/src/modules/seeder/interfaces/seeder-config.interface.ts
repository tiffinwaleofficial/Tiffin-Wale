import {
  SeederConfig,
  VolumeConfig,
  ImageStrategy,
  GeographicConfig,
} from "./seeder-phase.interface";

// Re-export interfaces for external use
export { SeederConfig, VolumeConfig, ImageStrategy, GeographicConfig };

export interface SeederConfigService {
  getConfig(): SeederConfig;
  getVolumeConfig(profile: string): VolumeConfig;
  getImageStrategy(): ImageStrategy;
  getGeographicConfig(): GeographicConfig;
  updateConfig(updates: Partial<SeederConfig>): void;
}

export interface DataProfiles {
  minimal: VolumeConfig;
  standard: VolumeConfig;
  extensive: VolumeConfig;
}

export const DEFAULT_PROFILES: DataProfiles = {
  minimal: {
    users: { admin: 1, business: 5, customer: 20 },
    partners: 5,
    categoriesPerPartner: { min: 2, max: 3 },
    menuItemsPerCategory: { min: 3, max: 5 },
    orders: 30,
    subscriptions: { percentage: 40 },
    conversations: 10,
    messagesPerConversation: { min: 5, max: 15 },
    notifications: 20,
    feedback: 10,
    testimonials: 5,
  },
  standard: {
    users: { admin: 2, business: 15, customer: 50 },
    partners: 15,
    categoriesPerPartner: { min: 3, max: 4 },
    menuItemsPerCategory: { min: 5, max: 8 },
    orders: 120,
    subscriptions: { percentage: 60 },
    conversations: 25,
    messagesPerConversation: { min: 10, max: 30 },
    notifications: 50,
    feedback: 30,
    testimonials: 20,
  },
  extensive: {
    users: { admin: 3, business: 30, customer: 100 },
    partners: 30,
    categoriesPerPartner: { min: 4, max: 6 },
    menuItemsPerCategory: { min: 8, max: 12 },
    orders: 300,
    subscriptions: { percentage: 70 },
    conversations: 50,
    messagesPerConversation: { min: 20, max: 50 },
    notifications: 100,
    feedback: 60,
    testimonials: 40,
  },
};

export const DEFAULT_IMAGE_STRATEGY: ImageStrategy = {
  provider: "unsplash",
  categories: {
    food: [
      "indian-food",
      "chinese-food",
      "italian-food",
      "mexican-food",
      "thai-food",
      "continental-food",
      "fast-food",
      "healthy-food",
      "vegetarian-food",
      "vegan-food",
      "breakfast",
      "lunch",
      "dinner",
      "snacks",
      "beverages",
      "desserts",
    ],
    restaurant: [
      "restaurant-interior",
      "kitchen",
      "chef",
      "food-preparation",
      "restaurant-exterior",
      "dining-room",
    ],
    profile: ["professional-headshot", "avatar", "user-profile"],
  },
  baseUrl: "https://source.unsplash.com/800x600/?",
};

export const DEFAULT_GEOGRAPHIC_CONFIG: GeographicConfig = {
  cities: [
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
  ],
  deliveryRadius: 10,
  businessHours: {
    open: "09:00",
    close: "22:00",
  },
};
