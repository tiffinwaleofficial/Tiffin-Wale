import { Injectable } from "@nestjs/common";
import { PartnerFinancialReportData } from "../interfaces/report-data.interface";
import companyInfo from "../../../config/company-info.config";

/**
 * Format-agnostic Partner Financial Report Data Generator
 * Prepares partner financial report data from dummy data
 */
@Injectable()
export class PartnerFinancialReportDataGenerator {
  /**
   * Transform dummy data to PartnerFinancialReportData interface
   */
  async preparePartnerFinancialReportData(
    dummyData: any,
    logoImageBase64: string,
  ): Promise<PartnerFinancialReportData> {
    const company = companyInfo();

    // Format dates
    const generationDate =
      dummyData.generationDate ||
      new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const reportPeriod = dummyData.reportPeriod || "All Time";

    // Calculate GST (18%) for all amounts
    const calculateGST = (amount: number) => amount * 0.18;

    // Prepare summary
    const totalCompanyRevenue = dummyData.summary?.totalCompanyRevenue || 0;
    const totalPartnerPayouts = dummyData.summary?.totalPartnerPayouts || 0;
    const netProfit =
      totalCompanyRevenue -
      totalPartnerPayouts -
      (dummyData.financialMetrics?.operatingCosts || 0);
    const profitMargin =
      totalCompanyRevenue > 0 ? (netProfit / totalCompanyRevenue) * 100 : 0;

    const summary = {
      totalPartners: dummyData.summary?.totalPartners || 0,
      activePartners: dummyData.summary?.activePartners || 0,
      totalCompanyRevenue,
      totalPartnerPayouts,
      netProfit,
      profitMargin: Math.round(profitMargin * 100) / 100,
    };

    // Prepare metrics
    const metrics = {
      currentMonth: {
        newPartners: dummyData.metrics?.currentMonth?.newPartners || 0,
        totalRevenue: dummyData.metrics?.currentMonth?.totalRevenue || 0,
        totalOrders: dummyData.metrics?.currentMonth?.totalOrders || 0,
        growthPercent: dummyData.metrics?.currentMonth?.growthPercent || 0,
      },
      lastMonth: {
        newPartners: dummyData.metrics?.lastMonth?.newPartners || 0,
        totalRevenue: dummyData.metrics?.lastMonth?.totalRevenue || 0,
        totalOrders: dummyData.metrics?.lastMonth?.totalOrders || 0,
        growthPercent: dummyData.metrics?.lastMonth?.growthPercent || 0,
      },
      past3Months: dummyData.metrics?.past3Months || [],
    };

    // Prepare financial metrics
    const gstCollected = calculateGST(totalCompanyRevenue);
    const otherTaxes = dummyData.financialMetrics?.otherTaxes || 0;
    const netRevenue = totalCompanyRevenue - gstCollected - otherTaxes;
    const operatingCosts = dummyData.financialMetrics?.operatingCosts || 0;
    const calculatedNetProfit =
      netRevenue - totalPartnerPayouts - operatingCosts;
    const calculatedProfitMargin =
      netRevenue > 0 ? (calculatedNetProfit / netRevenue) * 100 : 0;

    const financialMetrics = {
      totalCompanyRevenue,
      totalPartnerPayouts,
      gstCollected,
      otherTaxes,
      netRevenue,
      operatingCosts,
      netProfit: calculatedNetProfit,
      profitMargin: Math.round(calculatedProfitMargin * 100) / 100,
    };

    // Prepare cost analysis
    const costAnalysis = {
      cac: dummyData.costAnalysis?.cac || 0,
      cacPercent:
        totalCompanyRevenue > 0
          ? ((dummyData.costAnalysis?.cac || 0) / totalCompanyRevenue) * 100
          : 0,
      advertisementExpenses: dummyData.costAnalysis?.advertisementExpenses || 0,
      advertisementPercent:
        totalCompanyRevenue > 0
          ? ((dummyData.costAnalysis?.advertisementExpenses || 0) /
              totalCompanyRevenue) *
            100
          : 0,
      marketingCosts: dummyData.costAnalysis?.marketingCosts || 0,
      marketingPercent:
        totalCompanyRevenue > 0
          ? ((dummyData.costAnalysis?.marketingCosts || 0) /
              totalCompanyRevenue) *
            100
          : 0,
      operationalCosts: dummyData.costAnalysis?.operationalCosts || 0,
      operationalPercent:
        totalCompanyRevenue > 0
          ? ((dummyData.costAnalysis?.operationalCosts || 0) /
              totalCompanyRevenue) *
            100
          : 0,
      totalOperatingCosts:
        (dummyData.costAnalysis?.cac || 0) +
        (dummyData.costAnalysis?.advertisementExpenses || 0) +
        (dummyData.costAnalysis?.marketingCosts || 0) +
        (dummyData.costAnalysis?.operationalCosts || 0),
      totalPercent:
        totalCompanyRevenue > 0
          ? (((dummyData.costAnalysis?.cac || 0) +
              (dummyData.costAnalysis?.advertisementExpenses || 0) +
              (dummyData.costAnalysis?.marketingCosts || 0) +
              (dummyData.costAnalysis?.operationalCosts || 0)) /
              totalCompanyRevenue) *
            100
          : 0,
      monthlyAdvertisementBreakdown:
        dummyData.costAnalysis?.monthlyAdvertisementBreakdown || [],
    };

    // Prepare per partner breakdown
    const perPartnerBreakdown = dummyData.perPartnerBreakdown || [];

    // Prepare partners list
    const partners = (dummyData.partners || []).map((partner: any) => ({
      partnerId: partner.partnerId || "",
      businessName: partner.businessName || "",
      ownerName: partner.ownerName || "",
      address: partner.address || "",
      onboardingDate: partner.onboardingDate || "",
      status: partner.status || "active",
      totalOrders: partner.totalOrders || 0,
      totalRevenue: partner.totalRevenue || 0,
      partnerShare: partner.partnerShare || 0,
      companyShare: partner.companyShare || 0,
      gstBreakdown: calculateGST(partner.totalRevenue || 0),
    }));

    // Prepare charts data
    const charts = {
      partnerOnboarding: {
        labels: dummyData.charts?.partnerOnboarding?.labels || [],
        data: dummyData.charts?.partnerOnboarding?.data || [],
      },
      revenueTrend: {
        labels: dummyData.charts?.revenueTrend?.labels || [],
        companyData: dummyData.charts?.revenueTrend?.companyData || [],
        partnerData: dummyData.charts?.revenueTrend?.partnerData || [],
      },
      revenueDistribution: {
        labels: dummyData.charts?.revenueDistribution?.labels || [],
        data: dummyData.charts?.revenueDistribution?.data || [],
      },
      costBreakdown: {
        labels: dummyData.charts?.costBreakdown?.labels || [],
        data: dummyData.charts?.costBreakdown?.data || [],
      },
      profitMargin: {
        labels: dummyData.charts?.profitMargin?.labels || [],
        data: dummyData.charts?.profitMargin?.data || [],
      },
    };

    return {
      generationDate,
      reportPeriod,
      company: {
        name: company.name,
        shortName: company.shortName,
        website: company.website,
        email: company.email,
        phone: company.phone,
        address: company.address,
      },
      logoImage: logoImageBase64,
      summary,
      metrics,
      financialMetrics,
      costAnalysis,
      perPartnerBreakdown,
      partners,
      charts,
    };
  }
}
