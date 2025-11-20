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
      effectiveDate?: string;
      expiryDate?: string;
      companyGstNumber?: string;
      companyPanNumber?: string;
    },
  ): Promise<PartnerNdaData> {
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
      ndaId: `NDA-${Date.now()}-${partnerIdStr.toUpperCase()}`,
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
        gstNumber: partner.gstNumber || undefined,
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
