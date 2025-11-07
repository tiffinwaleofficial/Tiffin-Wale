import { Injectable } from "@nestjs/common";
import { PartnerContractData } from "../interfaces/report-data.interface";
import { Partner } from "../../partner/schemas/partner.schema";
import { User } from "../../user/schemas/user.schema";

/**
 * Format-agnostic Partner Contract Data Generator
 * Prepares partner contract data that can be used by any format (PDF, Excel, CSV, etc.)
 */
@Injectable()
export class PartnerContractDataGenerator {
  /**
   * Transform Partner document to PartnerContractData interface
   */
  async preparePartnerContractData(
    partner: Partner,
    partnerUser: User,
    contractType: string = "agreement",
    customTerms?: string[],
  ): Promise<PartnerContractData> {
    const defaultClauses = [
      "The partner agrees to maintain food quality standards as per TiffinMate guidelines.",
      "The partner agrees to deliver orders within the specified time frame.",
      "The partner agrees to comply with all local health and safety regulations.",
      "TiffinMate reserves the right to terminate this agreement with 30 days notice.",
      "All disputes will be resolved through mutual discussion or legal arbitration.",
    ];

    const clauses =
      customTerms && customTerms.length > 0
        ? [...defaultClauses, ...customTerms]
        : defaultClauses;

    return {
      contractId: `CONTRACT-${Date.now()}`,
      partner: {
        id: partner._id.toString(),
        businessName: partner.businessName,
        ownerName: `${partnerUser.firstName} ${partnerUser.lastName}`,
        address: this.formatAddress(partner.address),
        gstNumber: partner.gstNumber,
        licenseNumber: partner.licenseNumber,
        contactEmail: partner.contactEmail || partnerUser.email,
        contactPhone: partner.contactPhone || partnerUser.phoneNumber,
      },
      terms: {
        commissionRate: partner.commissionRate || 20,
        paymentTerms: "Weekly payments via bank transfer",
        deliveryRadius: partner.deliveryRadius || 5,
        minimumOrderAmount: partner.minimumOrderAmount || 100,
        contractDuration: "12 months",
        renewalTerms: "Automatic renewal unless terminated by either party",
      },
      bankDetails: partner.bankAccount?.accountNumber
        ? {
            accountHolderName: partner.bankAccount.accountHolderName || "",
            accountNumber: partner.bankAccount.accountNumber,
            ifscCode: partner.bankAccount.ifscCode || "",
            bankName: partner.bankAccount.bankName || "",
          }
        : undefined,
      effectiveDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      clauses,
    };
  }

  /**
   * Format address object to string
   */
  private formatAddress(address: any): string {
    if (typeof address === "string") {
      return address;
    }
    if (address && typeof address === "object") {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.postalCode,
        address.country,
      ].filter(Boolean);
      return parts.join(", ");
    }
    return "";
  }
}
