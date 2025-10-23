import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { RegisterPartnerDto } from "./dto/register-partner.dto";
import { RegisterCustomerDto } from "./dto/register-customer.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RequestPasswordResetDto } from "./dto/request-password-reset.dto";
import { VerifyPasswordResetDto } from "./dto/verify-password-reset.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { CheckPhoneDto } from "./dto/check-phone.dto";
import { LoginPhoneDto } from "./dto/login-phone.dto";
import { LinkPhoneDto } from "./dto/link-phone.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User has been registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("register-partner")
  @ApiOperation({ summary: "Register a new partner (business user)" })
  @ApiResponse({ status: 201, description: "Partner has been registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  registerPartner(@Body() registerPartnerDto: RegisterPartnerDto) {
    return this.authService.registerPartner(registerPartnerDto);
  }

  @Post("register-customer")
  @ApiOperation({ summary: "Register a new customer with onboarding data" })
  @ApiResponse({ status: 201, description: "Customer has been registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email or phone already exists" })
  registerCustomer(@Body() registerCustomerDto: RegisterCustomerDto) {
    return this.authService.registerCustomer(registerCustomerDto);
  }

  @Post("super-admin/register")
  @ApiOperation({ summary: "Register a super admin user (development only)" })
  @ApiResponse({ status: 201, description: "Super admin has been registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  registerSuperAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.registerSuperAdmin(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "User login successful" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Change user password" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user._id, changePasswordDto);
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh JWT token" })
  @ApiResponse({ status: 200, description: "Token refreshed successfully" })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "User logout" })
  @ApiResponse({ status: 200, description: "User logged out successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  logout(@Request() req) {
    return this.authService.logout(req.user._id);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "User not found" })
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post("check-phone")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Check if user exists by phone number with optional role filter",
  })
  @ApiResponse({ status: 200, description: "Phone check completed" })
  @ApiResponse({ status: 400, description: "Bad request" })
  checkPhone(@Body() checkPhoneDto: CheckPhoneDto) {
    return this.authService.checkPhoneExists(
      checkPhoneDto.phoneNumber,
      checkPhoneDto.role,
    );
  }

  @Post("login-phone")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Login with phone number and Firebase UID with optional role filter",
  })
  @ApiResponse({ status: 200, description: "Phone login successful" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  loginPhone(@Body() loginPhoneDto: LoginPhoneDto) {
    return this.authService.loginWithPhone(
      loginPhoneDto.phoneNumber,
      loginPhoneDto.firebaseUid,
      loginPhoneDto.role,
    );
  }

  @Post("link-phone")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Link phone number to existing email account" })
  @ApiResponse({ status: 200, description: "Phone number linked successfully" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiResponse({ status: 409, description: "Phone number already in use" })
  linkPhone(@Body() linkPhoneDto: LinkPhoneDto) {
    return this.authService.linkPhoneToAccount(linkPhoneDto);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Request password reset with rate limiting",
    description: `
    Initiates a password reset process for a user account. Supports multiple identifier types:
    - Email address (e.g., user@example.com)
    - Phone number (e.g., +1234567890)
    - Username (firstName lastName, e.g., John Doe)
    
    Features:
    - Rate limiting: Max 3 attempts per hour per user
    - Role-based frontend URL routing (customer → Student App, partner → Partner App)
    - Secure token generation with 1-hour expiry
    - Email masking for privacy
    - No account disclosure (same response whether account exists or not)
    
    The system will send a password reset email to the user's registered email address
    with a secure token that expires in 1 hour.
    `,
  })
  @ApiResponse({
    status: 200,
    description: "Password reset request processed successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example:
            "If your account exists, a password reset link will be sent to jo***n@example.com",
        },
        rateLimit: {
          type: "object",
          properties: {
            attemptsRemaining: { type: "number", example: 2 },
            maxAttempts: { type: "number", example: 3 },
            resetWindowMinutes: { type: "number", example: 60 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Rate limit exceeded - too many reset attempts",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: {
          type: "string",
          example: "Too many password reset attempts. Please try again later.",
        },
        rateLimit: {
          type: "object",
          properties: {
            attemptsRemaining: { type: "number", example: 0 },
            maxAttempts: { type: "number", example: 3 },
            nextResetAvailableIn: { type: "number", example: 1800000 },
            nextResetAvailableAt: {
              type: "string",
              example: "2025-01-22T15:30:00.000Z",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: "Validation error - invalid input data",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 422 },
        message: {
          type: "array",
          items: { type: "string" },
          example: [
            "identifier should not be empty",
            "role must be one of the following values: customer, business_partner",
          ],
        },
        error: { type: "string", example: "Unprocessable Entity" },
      },
    },
  })
  requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post("verify-reset")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Verify reset token and change password",
    description: `
    Completes the password reset process by verifying the reset token and updating the user's password.
    
    Security Features:
    - Token verification with bcrypt comparison
    - Token expiry validation (1-hour limit)
    - Password strength validation (min 8 chars, uppercase, lowercase, number, special char)
    - Password confirmation matching
    - Automatic token cleanup after successful reset
    - Password change confirmation email sent to user
    
    After successful password reset:
    - All reset tokens are cleared
    - Reset attempt counters are reset
    - User receives a security notification email
    - User can immediately login with the new password
    `,
  })
  @ApiResponse({
    status: 200,
    description: "Password reset completed successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example:
            "Password has been reset successfully. You can now login with your new password.",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired token, or validation errors",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          type: "string",
          examples: {
            invalidToken: {
              value:
                "Invalid or expired reset token. Please request a new password reset.",
            },
            expiredToken: {
              value:
                "Reset token has expired. Please request a new password reset.",
            },
            passwordMismatch: { value: "Passwords do not match." },
            weakPassword: {
              value:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
          },
        },
        error: { type: "string", example: "Bad Request" },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: "Validation error - invalid input data",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 422 },
        message: {
          type: "array",
          items: { type: "string" },
          example: [
            "token should not be empty",
            "newPassword must be longer than or equal to 8 characters",
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          ],
        },
        error: { type: "string", example: "Unprocessable Entity" },
      },
    },
  })
  verifyPasswordReset(@Body() dto: VerifyPasswordResetDto) {
    return this.authService.verifyPasswordReset(dto);
  }
}
