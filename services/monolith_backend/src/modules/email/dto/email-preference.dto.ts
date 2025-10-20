import {
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateEmailPreferenceDto {
  @ApiPropertyOptional({ description: "Receive order update emails" })
  @IsOptional()
  @IsBoolean()
  orderUpdates?: boolean;

  @ApiPropertyOptional({
    description: "Receive subscription notification emails",
  })
  @IsOptional()
  @IsBoolean()
  subscriptionNotifications?: boolean;

  @ApiPropertyOptional({ description: "Receive marketing emails" })
  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;

  @ApiPropertyOptional({ description: "Receive security alert emails" })
  @IsOptional()
  @IsBoolean()
  securityAlerts?: boolean;

  @ApiPropertyOptional({ description: "Receive partner notification emails" })
  @IsOptional()
  @IsBoolean()
  partnerNotifications?: boolean;

  @ApiPropertyOptional({ description: "Receive payment notification emails" })
  @IsOptional()
  @IsBoolean()
  paymentNotifications?: boolean;

  @ApiPropertyOptional({ description: "Receive system notification emails" })
  @IsOptional()
  @IsBoolean()
  systemNotifications?: boolean;

  @ApiPropertyOptional({ description: "Preferred language for emails" })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiPropertyOptional({ description: "User timezone" })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: "Email digest frequency",
    enum: ["immediate", "daily", "weekly", "never"],
  })
  @IsOptional()
  @IsEnum(["immediate", "daily", "weekly", "never"])
  digestFrequency?: string;

  @ApiPropertyOptional({ description: "Categories to unsubscribe from" })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  unsubscribedCategories?: string[];
}

export class CreateEmailPreferenceDto {
  @ApiProperty({ description: "User ID" })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: "Receive order update emails",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  orderUpdates?: boolean;

  @ApiPropertyOptional({
    description: "Receive subscription notification emails",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  subscriptionNotifications?: boolean;

  @ApiPropertyOptional({
    description: "Receive marketing emails",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;

  @ApiPropertyOptional({
    description: "Receive security alert emails",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  securityAlerts?: boolean;

  @ApiPropertyOptional({
    description: "Preferred language for emails",
    default: "en",
  })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiPropertyOptional({ description: "User timezone", default: "UTC" })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class UnsubscribeDto {
  @ApiProperty({ description: "Unsubscribe token" })
  @IsString()
  token: string;

  @ApiPropertyOptional({
    description: "Specific categories to unsubscribe from",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: "Global unsubscribe from all emails" })
  @IsOptional()
  @IsBoolean()
  globalUnsubscribe?: boolean;
}
