import { Injectable } from "@nestjs/common";
import { PartnerNdaData } from "../interfaces/report-data.interface";
import { Partner } from "../../partner/schemas/partner.schema";
import { User } from "../../user/schemas/user.schema";
import companyInfo from "../../../config/company-info.config";

/**
 * Format-agnostic Partner NDA Data Generator
 * Prepares partner NDA data that can be used by any format (PDF, Excel, CSV, etc.)
 */
@Injectable()
export class PartnerNdaDataGenerator {
  /**
   * Transform Partner document to PartnerNdaData interface
   */
  async preparePartnerNdaData(
    partner: Partner,
    partnerUser: User,
    customTerms?: {
      purpose?: string;
      term?: string;
      survivalPeriod?: string;
    },
  ): Promise<PartnerNdaData> {
    const company = companyInfo();

    return {
      ndaId: `NDA-${Date.now()}-${partner._id.toString().substring(0, 8).toUpperCase()}`,
      effectiveDate: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      expiryDate: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      purpose:
        customTerms?.purpose ||
        "partnering with Tiffin Wale to offer food services through the Tiffin Wale platform",
      term: customTerms?.term || "2 years",
      survivalPeriod: customTerms?.survivalPeriod || "3",
      company: {
        name: company.name,
        shortName: company.shortName,
        website: company.website,
        email: company.email,
        phone: company.phone,
        address: company.address,
        gstNumber: process.env.COMPANY_GST_NUMBER || undefined,
      },
      partner: {
        businessName: partner.businessName,
        ownerName: `${partnerUser.firstName} ${partnerUser.lastName}`,
        address: this.formatAddress(partner.address),
        contactEmail: partner.contactEmail || partnerUser.email,
        contactPhone: partner.contactPhone || partnerUser.phoneNumber,
        gstNumber: partner.gstNumber || undefined,
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



