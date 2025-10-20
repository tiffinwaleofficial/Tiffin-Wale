export interface SeederPhase {
  name: string;
  description: string;
  dependencies: string[];
  collections: string[];
  execute(config: SeederConfig): Promise<SeederPhaseResult>;
  clean(): Promise<void>;
  validate(): Promise<ValidationResult>;
}

export interface SeederPhaseResult {
  phase: string;
  success: boolean;
  collectionsSeeded: string[];
  recordCounts: Record<string, number>;
  duration: number;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SeederConfig {
  profile: "minimal" | "standard" | "extensive";
  volumes: VolumeConfig;
  imageStrategy: ImageStrategy;
  geographic: GeographicConfig;
  incremental: boolean;
  skipCleanup: boolean;
}

export interface VolumeConfig {
  users: {
    admin: number;
    business: number;
    customer: number;
  };
  partners: number;
  categoriesPerPartner: { min: number; max: number };
  menuItemsPerCategory: { min: number; max: number };
  orders: number;
  subscriptions: {
    percentage: number; // percentage of customers with subscriptions
  };
  conversations: number;
  messagesPerConversation: { min: number; max: number };
  notifications: number;
  feedback: number;
  testimonials: number;
}

export interface ImageStrategy {
  provider: "unsplash" | "picsum" | "local" | "curated";
  categories: {
    food: string[];
    restaurant: string[];
    profile: string[];
  };
  baseUrl?: string;
}

export interface GeographicConfig {
  cities: string[];
  deliveryRadius: number; // in km
  businessHours: {
    open: string;
    close: string;
  };
}

export enum SeederPhases {
  CORE = "core",
  PARTNER = "partner",
  CUSTOMER = "customer",
  TRANSACTION = "transaction",
  COMMUNICATION = "communication",
  MARKETING = "marketing",
  SUPPORT = "support",
}
