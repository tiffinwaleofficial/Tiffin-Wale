import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsObject,
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendEmailDto {
  @ApiProperty({ description: "Recipient email address" })
  @IsEmail()
  to: string;

  @ApiProperty({ description: "Email subject" })
  @IsString()
  subject: string;

  @ApiProperty({ description: "Template name to use" })
  @IsString()
  template: string;

  @ApiProperty({ description: "Template data for variable substitution" })
  @IsObject()
  data: Record<string, any>;

  @ApiPropertyOptional({ description: "Sender email address" })
  @IsOptional()
  @IsEmail()
  from?: string;

  @ApiPropertyOptional({ description: "Reply-to email address" })
  @IsOptional()
  @IsEmail()
  replyTo?: string;

  @ApiPropertyOptional({ description: "CC recipients" })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @ApiPropertyOptional({ description: "BCC recipients" })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];
}

export class BulkEmailDto {
  @ApiProperty({ description: "Template name to use" })
  @IsString()
  template: string;

  @ApiProperty({ description: "Email subject" })
  @IsString()
  subject: string;

  @ApiProperty({
    description: "Recipients with individual data",
    type: "array",
    items: {
      type: "object",
      properties: {
        email: { type: "string", format: "email" },
        data: { type: "object" },
      },
    },
  })
  @IsArray()
  recipients: Array<{
    email: string;
    data: Record<string, any>;
  }>;

  @ApiPropertyOptional({ description: "Sender email address" })
  @IsOptional()
  @IsEmail()
  from?: string;
}

export class EmailPreviewDto {
  @ApiProperty({ description: "Template name to preview" })
  @IsString()
  template: string;

  @ApiProperty({ description: "Template data for preview" })
  @IsObject()
  data: Record<string, any>;
}

export class ResendFailedEmailsDto {
  @ApiPropertyOptional({ description: "Maximum number of emails to resend" })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: "Maximum retry count for emails" })
  @IsOptional()
  maxRetries?: number;
}
