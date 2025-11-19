import { Injectable } from "@nestjs/common";
import { CustomerFinancialReportData } from "../interfaces/report-data.interface";
import companyInfo from "../../../config/company-info.config";

/**
 * Format-agnostic Customer Financial Report Data Generator
 * Prepares customer financial report data from dummy data
 */
@Injectable()
export class CustomerFinancialReportDataGenerator {
  /**
   * Transform dummy data to CustomerFinancialReportData interface
   */
  async prepareCustomerFinancialReportData(
    dummyData: any,
    logoImageBase64: string,
  ): Promise<CustomerFinancialReportData> {
    const company = companyInfo();

    // Format dates
    const generationDate = dummyData.generationDate || new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const reportPeriod = dummyData.reportPeriod || "All Time";

    // Calculate GST (18%) for all amounts
    const calculateGST = (amount: number) => amount * 0.18;
    const calculateNet = (amount: number) => amount - calculateGST(amount);

    // Prepare summary
    const totalRevenue = dummyData.summary?.totalRevenue || 0;
    const gstCollected = calculateGST(totalRevenue);
    const netRevenue = calculateNet(totalRevenue);

    const summary = {
      totalUsers: dummyData.summary?.totalUsers || 0,
      activeSubscriptions: dummyData.summary?.activeSubscriptions || 0,
      totalRevenue,
      gstCollected,
      netRevenue,
      currentMonthRevenue: dummyData.summary?.currentMonthRevenue || 0,
    };

    // Prepare metrics
    const metrics = {
      currentMonth: {
        newSubscriptions: dummyData.metrics?.currentMonth?.newSubscriptions || 0,
        usersOnboarded: dummyData.metrics?.currentMonth?.usersOnboarded || 0,
        revenue: dummyData.metrics?.currentMonth?.revenue || 0,
        growthPercent: dummyData.metrics?.currentMonth?.growthPercent || 0,
      },
      lastMonth: {
        newSubscriptions: dummyData.metrics?.lastMonth?.newSubscriptions || 0,
        usersOnboarded: dummyData.metrics?.lastMonth?.usersOnboarded || 0,
        revenue: dummyData.metrics?.lastMonth?.revenue || 0,
        growthPercent: dummyData.metrics?.lastMonth?.growthPercent || 0,
      },
      past3Months: dummyData.metrics?.past3Months || [],
    };

    // Prepare revenue breakdown
    const revenueBreakdown = {
      totalRevenue,
      gstCollected,
      netRevenue,
      byPlanType: dummyData.revenueBreakdown?.byPlanType || [],
    };

    // Prepare users list with GST calculations
    const users = (dummyData.users || []).map((user: any) => ({
      userId: user.userId || "",
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      planName: user.planName || "",
      price: user.price || 0,
      purchaseDate: user.purchaseDate || "",
      gst: calculateGST(user.price || 0),
      totalAmount: (user.price || 0) + calculateGST(user.price || 0),
      status: user.status || "active",
      renewalDate: user.renewalDate || "",
    }));

    // Prepare charts data
    const charts = {
      subscriptionTrend: {
        labels: dummyData.charts?.subscriptionTrend?.labels || [],
        data: dummyData.charts?.subscriptionTrend?.data || [],
      },
      revenueBar: {
        labels: dummyData.charts?.revenueBar?.labels || [],
        data: dummyData.charts?.revenueBar?.data || [],
      },
      planDistribution: {
        labels: dummyData.charts?.planDistribution?.labels || [],
        data: dummyData.charts?.planDistribution?.data || [],
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
      revenueBreakdown,
      users,
      charts,
    };
  }
}

