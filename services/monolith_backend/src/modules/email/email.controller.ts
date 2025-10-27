import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { EmailService } from "./email.service";
import { TemplateService } from "./template.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import {
  SendEmailDto,
  BulkEmailDto,
  EmailPreviewDto,
  ResendFailedEmailsDto,
} from "./dto/send-email.dto";
import {
  UpdateEmailPreferenceDto,
  CreateEmailPreferenceDto,
  UnsubscribeDto,
} from "./dto/email-preference.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  EmailPreference,
  EmailPreferenceDocument,
} from "./schemas/email-preference.schema";
import { EmailLog, EmailLogDocument } from "./schemas/email-log.schema";

@ApiTags("Email")
@Controller("email")
export class EmailController {
  constructor(
    private emailService: EmailService,
    private templateService: TemplateService,
    @InjectModel(EmailPreference.name)
    private emailPreferenceModel: Model<EmailPreferenceDocument>,
    @InjectModel(EmailLog.name) private emailLogModel: Model<EmailLogDocument>,
  ) {}

  @Post("send")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Send a single email (Admin only)" })
  @ApiResponse({ status: 201, description: "Email sent successfully" })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    try {
      const result = await this.emailService["sendTemplateEmail"](sendEmailDto);
      return {
        success: true,
        data: result,
        message: "Email sent successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to send email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("bulk")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Send bulk emails (Admin only)" })
  @ApiResponse({ status: 201, description: "Bulk emails sent" })
  async sendBulkEmails(@Body() bulkEmailDto: BulkEmailDto) {
    try {
      const results = await this.emailService.sendBulkEmails(bulkEmailDto);
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      return {
        success: true,
        data: {
          total: results.length,
          successful: successCount,
          failed: failureCount,
          results,
        },
        message: `Bulk email completed: ${successCount} sent, ${failureCount} failed`,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to send bulk emails: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("preview")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Preview email template" })
  @ApiResponse({ status: 200, description: "Email preview generated" })
  async previewEmail(@Body() previewDto: EmailPreviewDto) {
    try {
      const preview = await this.templateService.previewTemplate(
        previewDto.template,
        previewDto.data,
      );

      return {
        success: true,
        data: preview,
        message: "Email preview generated successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to generate preview: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post("retry-failed")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Retry failed emails (Admin only)" })
  @ApiResponse({ status: 200, description: "Failed emails retried" })
  async retryFailedEmails(@Body() retryDto: ResendFailedEmailsDto) {
    try {
      const retriedCount = await this.emailService.retryFailedEmails(
        retryDto.limit,
        retryDto.maxRetries,
      );

      return {
        success: true,
        data: { retriedCount },
        message: `${retriedCount} failed emails retried`,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retry emails: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("templates")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get available email templates" })
  @ApiResponse({ status: 200, description: "List of available templates" })
  async getTemplates() {
    try {
      const templates = await this.templateService.getAvailableTemplates();

      return {
        success: true,
        data: templates,
        message: "Templates retrieved successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get templates: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get email statistics (Admin only)" })
  @ApiResponse({ status: 200, description: "Email statistics" })
  async getEmailStats(
    @Query("days") days?: number,
    @Query("userId") userId?: string,
  ) {
    try {
      const stats = await this.emailService.getEmailStats(userId, days);

      return {
        success: true,
        data: stats,
        message: "Email statistics retrieved successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get email stats: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("logs")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get email logs (Admin only)" })
  @ApiResponse({ status: 200, description: "Email logs" })
  async getEmailLogs(
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("status") status?: string,
    @Query("template") template?: string,
    @Query("userId") userId?: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {};

      if (status) filter.status = status;
      if (template) filter.template = template;
      if (userId) filter.userId = userId;

      const [logs, total] = await Promise.all([
        this.emailLogModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("userId", "name email")
          .exec(),
        this.emailLogModel.countDocuments(filter),
      ]);

      return {
        success: true,
        data: {
          logs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        message: "Email logs retrieved successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get email logs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Email Preferences Management

  @Get("preferences")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user email preferences" })
  @ApiResponse({ status: 200, description: "User email preferences" })
  async getEmailPreferences(@Request() req) {
    try {
      const userId = req.user.id;
      let preferences = await this.emailPreferenceModel.findOne({ userId });

      if (!preferences) {
        // Create default preferences
        preferences = new this.emailPreferenceModel({
          userId,
          orderUpdates: true,
          subscriptionNotifications: true,
          marketingEmails: false,
          securityAlerts: true,
          partnerNotifications: true,
          paymentNotifications: true,
          systemNotifications: true,
        });
        await preferences.save();
      }

      return {
        success: true,
        data: preferences,
        message: "Email preferences retrieved successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get email preferences: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put("preferences")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user email preferences" })
  @ApiResponse({ status: 200, description: "Email preferences updated" })
  async updateEmailPreferences(
    @Request() req,
    @Body() updateDto: UpdateEmailPreferenceDto,
  ) {
    try {
      const userId = req.user.id;

      const preferences = await this.emailPreferenceModel.findOneAndUpdate(
        { userId },
        updateDto,
        { new: true, upsert: true },
      );

      return {
        success: true,
        data: preferences,
        message: "Email preferences updated successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update email preferences: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("preferences")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create email preferences for user (Admin only)" })
  @ApiResponse({ status: 201, description: "Email preferences created" })
  async createEmailPreferences(@Body() createDto: CreateEmailPreferenceDto) {
    try {
      const preferences = new this.emailPreferenceModel(createDto);
      await preferences.save();

      return {
        success: true,
        data: preferences,
        message: "Email preferences created successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create email preferences: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("unsubscribe")
  @ApiOperation({ summary: "Unsubscribe from emails using token" })
  @ApiResponse({ status: 200, description: "Successfully unsubscribed" })
  async unsubscribe(@Body() unsubscribeDto: UnsubscribeDto) {
    try {
      const preferences = await this.emailPreferenceModel.findOne({
        unsubscribeToken: unsubscribeDto.token,
      });

      if (!preferences) {
        throw new HttpException(
          "Invalid unsubscribe token",
          HttpStatus.BAD_REQUEST,
        );
      }

      const updateData: any = {};

      if (unsubscribeDto.globalUnsubscribe) {
        updateData.globalUnsubscribe = true;
      }

      if (unsubscribeDto.categories && unsubscribeDto.categories.length > 0) {
        updateData.unsubscribedCategories = [
          ...preferences.unsubscribedCategories,
          ...unsubscribeDto.categories,
        ];
      }

      await this.emailPreferenceModel.findByIdAndUpdate(
        preferences._id,
        updateData,
      );

      return {
        success: true,
        message: "Successfully unsubscribed from emails",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to unsubscribe: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("unsubscribe/:token")
  @ApiOperation({ summary: "Unsubscribe page (GET method for email links)" })
  @ApiResponse({ status: 200, description: "Unsubscribe page" })
  async unsubscribePage(@Param("token") token: string) {
    try {
      const preferences = await this.emailPreferenceModel.findOne({
        unsubscribeToken: token,
      });

      if (!preferences) {
        return {
          success: false,
          message: "Invalid or expired unsubscribe link",
        };
      }

      // Update to global unsubscribe
      await this.emailPreferenceModel.findByIdAndUpdate(preferences._id, {
        globalUnsubscribe: true,
      });

      return {
        success: true,
        message: "You have been successfully unsubscribed from all emails",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to process unsubscribe: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("clear-cache")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Clear template cache (Admin only)" })
  @ApiResponse({ status: 200, description: "Template cache cleared" })
  async clearTemplateCache() {
    try {
      this.templateService.clearCache();

      return {
        success: true,
        message: "Template cache cleared successfully",
      };
    } catch (error) {
      throw new HttpException(
        `Failed to clear cache: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
