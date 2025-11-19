/**
 * Order receipt data structure
 */
export interface OrderReceiptData {
  orderId: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  partner: {
    id: string;
    businessName: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    specialInstructions?: string;
  }>;
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: string;
  orderDate: Date;
  deliveryDate?: Date;
  deliveryAddress: string;
  deliveryInstructions?: string;
}

/**
 * Subscription report data structure
 */
export interface SubscriptionReportData {
  subscriptionId: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
  };
  status: string;
  startDate: Date;
  endDate: Date;
  paymentFrequency: string;
  totalAmount: number;
  discountAmount?: number;
  meals: Array<{
    date: Date;
    mealType: string;
    items: string[];
    status: string;
  }>;
  paymentHistory: Array<{
    date: Date;
    amount: number;
    status: string;
    paymentMethod: string;
  }>;
}

/**
 * Partner contract data structure
 */
export interface PartnerContractData {
  contractId: string;
  partner: {
    id: string;
    businessName: string;
    ownerName: string;
    address: string;
    gstNumber?: string;
    licenseNumber?: string;
    contactEmail: string;
    contactPhone: string;
  };
  terms: {
    commissionRate: number;
    paymentTerms: string;
    deliveryRadius: number;
    minimumOrderAmount: number;
    contractDuration: string;
    renewalTerms: string;
  };
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  effectiveDate: Date;
  expiryDate?: Date;
  clauses: string[];
  signatures?: {
    partnerSignature?: string;
    companySignature?: string;
    signedAt?: Date;
  };
}

/**
 * Invoice data structure
 */
export interface InvoiceData {
  invoiceId: string;
  invoiceNumber: string;
  type: "order" | "subscription" | "other";
  customer: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  dueDate: Date;
  issueDate: Date;
  status: string;
  paymentMethod?: string;
  referenceId?: string;
}

/**
 * Legal document data structure
 */
export interface LegalDocumentData {
  documentId: string;
  documentType: string;
  title: string;
  parties: Array<{
    name: string;
    role: string;
    address: string;
    contactInfo: string;
  }>;
  effectiveDate: Date;
  expiryDate?: Date;
  terms: Array<{
    section: string;
    clauses: string[];
  }>;
  signatures?: Array<{
    party: string;
    signature?: string;
    signedAt?: Date;
  }>;
  attachments?: string[];
}

/**
 * Partner MoU (Memorandum of Understanding) data structure
 */
export interface PartnerMouData {
  mouId: string;
  effectiveDate: string;
  expiryDate?: string;
  company: {
    name: string;
    shortName: string;
    website: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
    gstNumber?: string;
    panNumber?: string;
  };
  partner: {
    businessName: string;
    ownerName: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    whatsappNumber?: string;
    gstNumber?: string;
    licenseNumber?: string;
    establishedYear?: number;
  };
  terms: {
    commissionRate: number;
    paymentTerms: string;
    deliveryRadius: number;
    minimumOrderAmount: number;
    contractDuration: string;
    terminationNotice: string;
    minimumRating?: number;
  };
  signatures?: {
    partnerSignature?: string;
    companySignature?: string;
    signedAt?: string;
  };
}

/**
 * Service Agreement data structure
 */
export interface ServiceAgreementData {
  agreementId: string;
  effectiveDate: string;
  expiryDate?: string;
  company: {
    name: string;
    shortName: string;
    website: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
    gstNumber?: string;
    panNumber?: string;
  };
  partner: {
    businessName: string;
    ownerName: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    whatsappNumber?: string;
    gstNumber?: string;
    licenseNumber?: string;
    establishedYear?: number;
  };
  terms: {
    commissionRate: number;
    paymentTerms: string;
    deliveryRadius: number;
    minimumOrderAmount: number;
    estimatedDeliveryTime: number;
    contractDuration: string;
    terminationNotice: string;
    minimumRating: number;
    minimumAcceptanceRate: number;
    orderAcceptanceTime: number;
    cancellationPolicy: string;
    commissionChangeNotice: string;
    paymentProcessingDays: number;
    minimumPayoutAmount: number;
  };
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch?: string;
  };
  signatures?: {
    partnerSignature?: string;
    companySignature?: string;
    signedAt?: string;
  };
}

/**
 * NDA (Non-Disclosure Agreement) data structure
 */
export interface PartnerNdaData {
  ndaId: string;
  effectiveDate: string;
  expiryDate?: string;
  purpose: string;
  term: string;
  survivalPeriod: string;
  company: {
    name: string;
    shortName: string;
    website: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
    gstNumber?: string;
    panNumber?: string;
  };
  partner: {
    businessName: string;
    ownerName: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    gstNumber?: string;
  };
  signatures?: {
    partnerSignature?: string;
    companySignature?: string;
    signedAt?: string;
  };
}

/**
 * Customer Financial Report data structure
 */
export interface CustomerFinancialReportData {
  generationDate: string;
  reportPeriod: string;
  company: {
    name: string;
    shortName: string;
    website: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  logoImage: string;
  summary: {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    gstCollected: number;
    netRevenue: number;
    currentMonthRevenue: number;
  };
  metrics: {
    currentMonth: {
      newSubscriptions: number;
      usersOnboarded: number;
      revenue: number;
      growthPercent: number;
    };
    lastMonth: {
      newSubscriptions: number;
      usersOnboarded: number;
      revenue: number;
      growthPercent: number;
    };
    past3Months: Array<{
      month: string;
      newSubscriptions: number;
      usersOnboarded: number;
      revenue: number;
      growthPercent: number;
    }>;
  };
  revenueBreakdown: {
    totalRevenue: number;
    gstCollected: number;
    netRevenue: number;
    byPlanType: Array<{
      planName: string;
      subscribers: number;
      monthlyRevenue: number;
      totalRevenue: number;
      percentage: number;
    }>;
  };
  users: Array<{
    userId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    planName: string;
    price: number;
    purchaseDate: string;
    gst: number;
    totalAmount: number;
    status: string;
    renewalDate: string;
  }>;
  charts: {
    subscriptionTrend: {
      labels: string[];
      data: number[];
    };
    revenueBar: {
      labels: string[];
      data: number[];
    };
    planDistribution: {
      labels: string[];
      data: number[];
    };
  };
}

/**
 * Partner Financial Report data structure
 */
export interface PartnerFinancialReportData {
  generationDate: string;
  reportPeriod: string;
  company: {
    name: string;
    shortName: string;
    website: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  logoImage: string;
  summary: {
    totalPartners: number;
    activePartners: number;
    totalCompanyRevenue: number;
    totalPartnerPayouts: number;
    netProfit: number;
    profitMargin: number;
  };
  metrics: {
    currentMonth: {
      newPartners: number;
      totalRevenue: number;
      totalOrders: number;
      growthPercent: number;
    };
    lastMonth: {
      newPartners: number;
      totalRevenue: number;
      totalOrders: number;
      growthPercent: number;
    };
    past3Months: Array<{
      month: string;
      newPartners: number;
      totalRevenue: number;
      totalOrders: number;
      growthPercent: number;
    }>;
  };
  financialMetrics: {
    totalCompanyRevenue: number;
    totalPartnerPayouts: number;
    gstCollected: number;
    otherTaxes: number;
    netRevenue: number;
    operatingCosts: number;
    netProfit: number;
    profitMargin: number;
  };
  costAnalysis: {
    cac: number;
    cacPercent: number;
    advertisementExpenses: number;
    advertisementPercent: number;
    marketingCosts: number;
    marketingPercent: number;
    operationalCosts: number;
    operationalPercent: number;
    totalOperatingCosts: number;
    totalPercent: number;
    monthlyAdvertisementBreakdown: Array<{
      month: string;
      advertisementSpend: number;
      newCustomers: number;
      cac: number;
    }>;
  };
  perPartnerBreakdown: Array<{
    partnerId: string;
    businessName: string;
    cashBurnPerMonth: number;
    avgOrderValue: number;
    totalOrders: number;
    totalRevenue: number;
    partnerShare: number;
    companyShare: number;
    commissionEarned: number;
  }>;
  partners: Array<{
    partnerId: string;
    businessName: string;
    ownerName: string;
    address: string;
    onboardingDate: string;
    status: string;
    totalOrders: number;
    totalRevenue: number;
    partnerShare: number;
    companyShare: number;
    gstBreakdown: number;
  }>;
  charts: {
    partnerOnboarding: {
      labels: string[];
      data: number[];
    };
    revenueTrend: {
      labels: string[];
      companyData: number[];
      partnerData: number[];
    };
    revenueDistribution: {
      labels: string[];
      data: number[];
    };
    costBreakdown: {
      labels: string[];
      data: number[];
    };
    profitMargin: {
      labels: string[];
      data: number[];
    };
  };
}
