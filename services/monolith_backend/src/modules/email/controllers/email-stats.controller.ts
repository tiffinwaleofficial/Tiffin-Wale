import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../../common/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { UserRole } from "../../../common/interfaces/user.interface";
import { EmailProviderFactory } from "../providers/email-provider.factory";
import { EmailCounterService } from "../services/email-counter.service";

@ApiTags("Email Statistics")
@Controller("email/stats")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class EmailStatsController {
  constructor(
    private readonly emailProviderFactory: EmailProviderFactory,
    private readonly emailCounterService: EmailCounterService,
  ) {}

  @Get("providers")
  @ApiOperation({ summary: "Get email provider statistics" })
  @ApiResponse({
    status: 200,
    description: "Provider statistics retrieved successfully",
  })
  async getProviderStats() {
    try {
      const stats = await this.emailProviderFactory.getProviderStats();
      const totalCapacity = this.emailProviderFactory.getTotalDailyCapacity();
      const remainingCapacity =
        await this.emailProviderFactory.getRemainingCapacity();
      const counter = await this.emailCounterService.getDailyCounter();

      return {
        success: true,
        data: {
          providers: stats,
          totalCapacity,
          remainingCapacity,
          dailyCounter: counter,
          utilizationPercentage: Math.round(
            ((totalCapacity - remainingCapacity) / totalCapacity) * 100,
          ),
        },
        message: "Provider statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve provider statistics",
      };
    }
  }

  @Get("usage")
  @ApiOperation({ summary: "Get detailed email usage statistics" })
  @ApiResponse({
    status: 200,
    description: "Usage statistics retrieved successfully",
  })
  async getUsageStats() {
    try {
      const statistics = await this.emailCounterService.getStatistics();
      const hasAvailable =
        await this.emailProviderFactory.hasAvailableProvider();

      return {
        success: true,
        data: {
          ...statistics,
          hasAvailableProvider: hasAvailable,
          totalCapacity: this.emailProviderFactory.getTotalDailyCapacity(),
        },
        message: "Usage statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve usage statistics",
      };
    }
  }

  @Post("reset-counters")
  @ApiOperation({ summary: "Reset daily email counters (Admin only)" })
  @ApiResponse({ status: 200, description: "Counters reset successfully" })
  async resetCounters() {
    try {
      await this.emailCounterService.resetCounters();

      return {
        success: true,
        message: "Email counters reset successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to reset counters",
      };
    }
  }

  @Post("refresh-health")
  @ApiOperation({ summary: "Refresh provider health status" })
  @ApiResponse({
    status: 200,
    description: "Provider health refreshed successfully",
  })
  async refreshProviderHealth() {
    try {
      await this.emailProviderFactory.refreshProviderHealth();
      const stats = await this.emailProviderFactory.getProviderStats();

      return {
        success: true,
        data: { providers: stats },
        message: "Provider health status refreshed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to refresh provider health",
      };
    }
  }

  @Get("health")
  @ApiOperation({ summary: "Get overall email service health" })
  @ApiResponse({ status: 200, description: "Email service health status" })
  async getEmailServiceHealth() {
    try {
      const hasAvailable =
        await this.emailProviderFactory.hasAvailableProvider();
      const stats = await this.emailProviderFactory.getProviderStats();
      const remainingCapacity =
        await this.emailProviderFactory.getRemainingCapacity();

      const healthyProviders = stats.filter(
        (stat) => stat.isHealthy && stat.isEnabled,
      );
      const enabledProviders = stats.filter((stat) => stat.isEnabled);

      const overallHealth = {
        status: hasAvailable ? "healthy" : "unhealthy",
        hasAvailableProvider: hasAvailable,
        healthyProviders: healthyProviders.length,
        totalProviders: enabledProviders.length,
        remainingCapacity,
        issues: [] as string[],
      };

      // Check for potential issues
      if (remainingCapacity < 50) {
        overallHealth.issues.push("Low remaining email capacity");
      }

      if (healthyProviders.length === 0) {
        overallHealth.issues.push("No healthy email providers available");
      } else if (healthyProviders.length < enabledProviders.length) {
        overallHealth.issues.push("Some email providers are unhealthy");
      }

      return {
        success: true,
        data: overallHealth,
        message: "Email service health status retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve email service health",
      };
    }
  }
}

