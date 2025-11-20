import { Injectable } from "@nestjs/common";
import { PartnerMouData } from "../interfaces/report-data.interface";
import { Partner } from "../../partner/schemas/partner.schema";
import { User } from "../../user/schemas/user.schema";
import companyInfo from "../../../config/company-info.config";

/**
 * Format-agnostic Partner MoU Data Generator
 * Prepares partner MoU data that can be used by any format (PDF, Excel, CSV, etc.)
 */
@Injectable()
export class PartnerMouDataGenerator {
  /**
   * Transform Partner document to PartnerMouData interface
   */
  async preparePartnerMouData(
    partner: Partner,
    partnerUser: User,
    customTerms?: {
      commissionRate?: number;
      paymentTerms?: string;
      contractDuration?: string;
      terminationNotice?: string;
      minimumRating?: number;
      effectiveDate?: string;
      expiryDate?: string;
      companyGstNumber?: string;
      companyPanNumber?: string;
    },
  ): Promise<PartnerMouData> {
    const company = companyInfo();

    // Use custom dates if provided, otherwise use current date
    const effectiveDateObj = customTerms?.effectiveDate
      ? new Date(customTerms.effectiveDate)
      : new Date();
    const expiryDateObj = customTerms?.expiryDate
      ? new Date(customTerms.expiryDate)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const partnerIdStr = partner._id?.toString
      ? partner._id.toString().substring(0, 8)
      : Date.now().toString(16).substring(0, 8);
    return {
      mouId: `MOU-${Date.now()}-${partnerIdStr.toUpperCase()}`,
      effectiveDate: effectiveDateObj.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      expiryDate: expiryDateObj.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      company: {
        name: company.name,
        shortName: company.shortName,
        website: company.website,
        email: company.email,
        phone: company.phone,
        address: company.address,
        gstNumber:
          customTerms?.companyGstNumber ||
          process.env.COMPANY_GST_NUMBER ||
          undefined,
        panNumber:
          customTerms?.companyPanNumber ||
          process.env.COMPANY_PAN_NUMBER ||
          undefined,
      },
      partner: {
        businessName: partner.businessName,
        ownerName: `${partnerUser.firstName} ${partnerUser.lastName}`,
        address: this.formatAddress(partner.address),
        contactEmail: partner.contactEmail || partnerUser.email,
        contactPhone: partner.contactPhone || partnerUser.phoneNumber,
        whatsappNumber: partner.whatsappNumber,
        gstNumber: partner.gstNumber || undefined,
        licenseNumber: partner.licenseNumber || undefined,
        establishedYear: partner.establishedYear || undefined,
      },
      terms: {
        commissionRate:
          customTerms?.commissionRate || partner.commissionRate || 20,
        paymentTerms:
          customTerms?.paymentTerms || "Weekly payments via bank transfer",
        deliveryRadius: partner.deliveryRadius || 5,
        minimumOrderAmount: partner.minimumOrderAmount || 100,
        contractDuration: customTerms?.contractDuration || "12 months",
        terminationNotice: customTerms?.terminationNotice || "30 days",
        minimumRating: customTerms?.minimumRating || 4.0,
      },
      signatures: {
        signedAt: effectiveDateObj.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
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
