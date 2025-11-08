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
