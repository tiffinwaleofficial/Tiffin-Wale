import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { RegisterPartnerDto } from "./dto/register-partner.dto";
import { RegisterCustomerDto } from "./dto/register-customer.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LinkPhoneDto } from "./dto/link-phone.dto";
import { UserRole } from "../../common/interfaces/user.interface";
import { SubscriptionService } from "../subscription/subscription.service";
import { CustomerProfileService } from "../customer-profile/customer-profile.service";
import { MealService } from "../meal/meal.service";
import { PartnerService } from "../partner/partner.service";
import { RedisService } from "../redis/redis.service";
import { EmailService } from "../email/email.service";
import { RequestPasswordResetDto } from "./dto/request-password-reset.dto";
import { VerifyPasswordResetDto } from "./dto/verify-password-reset.dto";
import { passwordResetConfig } from "../../config/password-reset.config";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly subscriptionService: SubscriptionService,
    private readonly customerProfileService: CustomerProfileService,
    private readonly mealService: MealService,
    private readonly partnerService: PartnerService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmailSafe(email);
      if (!user) {
        return null;
      }

      const isValidPassword = await this.userService.validatePassword(
        user,
        password,
      );

      if (isValidPassword) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...result } = user.toObject();
        return result;
      }

      return null;
    } catch (error) {
      console.error(
        `❌ AuthService.validateUser: Error during validation:`,
        error,
      );
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Check Redis cache for recent failed login attempts (rate limiting)
      const failedAttemptsKey = `failed_login:${email}`;
      const failedAttempts =
        (await this.redisService.get<number>(failedAttemptsKey)) || 0;

      if (failedAttempts >= 5) {
        throw new UnauthorizedException(
          "Too many failed login attempts. Please try again later.",
        );
      }

      const user = await this.validateUser(email, password);

      if (!user) {
        // Increment failed login attempts
        await this.redisService.set(failedAttemptsKey, failedAttempts + 1, {
          ttl: 900,
        }); // 15 minutes
        throw new UnauthorizedException("Invalid email or password");
      }

      if (!user.isActive) {
        throw new UnauthorizedException(
          "Your account has been deactivated. Please contact support.",
        );
      }

      // Clear failed login attempts on successful login
      await this.redisService.del(failedAttemptsKey);

      const tokens = await this.generateToken(user);

      // Cache user session in Redis
      const sessionData = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        loginAt: new Date().toISOString(),
        ...tokens,
      };

      await this.redisService.cacheUserSession(
        user._id.toString(),
        sessionData,
      );

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException("Login failed. Please try again.");
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // Check if user with email already exists
      const existingUser = await this.userService.findByEmailSafe(
        registerDto.email,
      );
      if (existingUser) {
        throw new ConflictException("Email already in use");
      }

      const user = await this.userService.create(registerDto);

      // Send welcome email (non-blocking)
      this.emailService
        .sendWelcomeEmail(user._id.toString(), {
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
          email: user.email,
          role: user.role,
        })
        .catch((error) => {
          console.error("Failed to send welcome email:", error);
        });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user.toObject();
      return this.generateToken(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Prevent leaking database errors as "user not found" messages
      if (error.message && error.message.includes("not found")) {
        throw new BadRequestException(
          "Registration failed: Invalid data provided",
        );
      }

      throw new BadRequestException(
        error.response?.message ||
          "Registration failed. Please check your information and try again.",
      );
    }
  }

  async registerPartner(registerPartnerDto: RegisterPartnerDto) {
    try {
      // Check if user with email already exists
      const existingUser = await this.userService.findByEmailSafe(
        registerPartnerDto.email,
      );
      if (existingUser) {
        throw new ConflictException("Email already in use");
      }

      // Create user with partner role
      const userData = {
        email: registerPartnerDto.email,
        password: registerPartnerDto.password,
        role: UserRole.PARTNER,
        firstName: registerPartnerDto.firstName,
        lastName: registerPartnerDto.lastName,
        phoneNumber: registerPartnerDto.phoneNumber,
        phoneVerified: false, // Will be set to true after phone verification
      };

      const user = await this.userService.create(userData);

      // Create partner profile with all business data
      const partnerData = {
        businessName: registerPartnerDto.businessName,
        businessType: registerPartnerDto.businessType,
        description: registerPartnerDto.description,
        cuisineTypes: registerPartnerDto.cuisineTypes,
        address: registerPartnerDto.address,
        businessHours: registerPartnerDto.businessHours,
        contactEmail:
          registerPartnerDto.contactEmail || registerPartnerDto.email,
        contactPhone:
          registerPartnerDto.contactPhone || registerPartnerDto.phoneNumber,
        whatsappNumber: registerPartnerDto.whatsappNumber,
        gstNumber: registerPartnerDto.gstNumber,
        licenseNumber: registerPartnerDto.licenseNumber,
        establishedYear: registerPartnerDto.establishedYear,
        deliveryRadius: registerPartnerDto.deliveryRadius || 5,
        minimumOrderAmount: registerPartnerDto.minimumOrderAmount || 100,
        deliveryFee: registerPartnerDto.deliveryFee || 0,
        estimatedDeliveryTime: registerPartnerDto.estimatedDeliveryTime || 30,
        commissionRate: registerPartnerDto.commissionRate || 20,
        logoUrl: registerPartnerDto.logoUrl,
        bannerUrl: registerPartnerDto.bannerUrl,
        socialMedia: registerPartnerDto.socialMedia,
        isVegetarian: registerPartnerDto.isVegetarian || false,
        hasDelivery: registerPartnerDto.hasDelivery !== false, // Default true
        hasPickup: registerPartnerDto.hasPickup !== false, // Default true
        acceptsCash: registerPartnerDto.acceptsCash !== false, // Default true
        acceptsCard: registerPartnerDto.acceptsCard !== false, // Default true
        acceptsUPI: registerPartnerDto.acceptsUPI !== false, // Default true
        documents: registerPartnerDto.documents || {},
        isAcceptingOrders: true,
        isFeatured: false,
        averageRating: 0,
        totalReviews: 0,
      };

      await this.partnerService.create(partnerData);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user.toObject();
      return this.generateToken(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Prevent leaking database errors as "user not found" messages
      if (error.message && error.message.includes("not found")) {
        throw new BadRequestException(
          "Registration failed. Please check your information and try again.",
        );
      }

      console.error(
        "❌ AuthService.registerPartner: Registration error:",
        error,
      );
      throw new BadRequestException(
        error.response?.message ||
          "Partner registration failed. Please check your information and try again.",
      );
    }
  }

  async registerCustomer(registerCustomerDto: RegisterCustomerDto) {
    try {
      // Check if user with email already exists
      const existingUserByEmail = await this.userService.findByEmailSafe(
        registerCustomerDto.email,
      );
      if (existingUserByEmail) {
        throw new ConflictException("Email already in use");
      }

      // Check if user with phone number already exists
      const existingUserByPhone = await this.userService.findByPhoneNumber(
        registerCustomerDto.phoneNumber,
      );
      if (existingUserByPhone) {
        throw new ConflictException("Phone number already in use");
      }

      // Create user with customer role
      const userData = {
        email: registerCustomerDto.email,
        role: UserRole.CUSTOMER,
        firstName: registerCustomerDto.firstName,
        lastName: registerCustomerDto.lastName,
        phoneNumber: registerCustomerDto.phoneNumber,
        isActive: true,
        // Note: firebaseUid will be set during phone login
      };

      const user = await this.userService.create(userData);

      // Create customer profile with onboarding data
      const customerProfileData = {
        user: user._id,
        city: registerCustomerDto.address.city,
        college: "", // Can be added later
        branch: "", // Can be added later
        graduationYear: new Date().getFullYear() + 2, // Default to 2 years from now
        dietaryPreferences: [registerCustomerDto.dietaryType],
        favoriteCuisines: registerCustomerDto.cuisinePreferences,
        preferredPaymentMethods: [],
        deliveryAddresses: [
          {
            name: registerCustomerDto.addressType,
            street: registerCustomerDto.address.street,
            city: registerCustomerDto.address.city,
            state: "Maharashtra", // Default state, can be updated later
            postalCode: registerCustomerDto.address.pincode,
            country: "India", // Default country
            isDefault: true,
          },
        ],
      };

      await this.customerProfileService.create(customerProfileData);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user.toObject();
      return this.generateToken(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Prevent leaking database errors
      if (error.message && error.message.includes("not found")) {
        throw new BadRequestException(
          "Registration failed. Please check your information and try again.",
        );
      }

      console.error(
        "❌ AuthService.registerCustomer: Registration error:",
        error,
      );
      throw new BadRequestException(
        "Registration failed. Please try again later.",
      );
    }
  }

  private generateReferralCode(userId: string): string {
    // Generate a simple referral code based on user ID and timestamp
    const timestamp = Date.now().toString(36);
    const userIdPart = userId.slice(-4);
    return `TW${userIdPart}${timestamp}`.toUpperCase();
  }

  async registerSuperAdmin(registerDto: RegisterDto) {
    try {
      // Check if user with email already exists
      const existingUser = await this.userService.findByEmailSafe(
        registerDto.email,
      );
      if (existingUser) {
        throw new ConflictException("Email already in use");
      }

      // Force the role to be SUPER_ADMIN
      const superAdminData = {
        ...registerDto,
        role: UserRole.SUPER_ADMIN,
      };

      const user = await this.userService.create(superAdminData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user.toObject();
      return this.generateToken(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Prevent leaking database errors as "user not found" messages
      if (error.message && error.message.includes("not found")) {
        throw new BadRequestException(
          "Registration failed: Invalid data provided",
        );
      }

      throw new BadRequestException(
        error.response?.message ||
          "Super admin registration failed. Please check your information and try again.",
      );
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { oldPassword, newPassword } = changePasswordDto;

      if (oldPassword === newPassword) {
        throw new BadRequestException(
          "New password must be different from the current password",
        );
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const isValidPassword = await this.userService.validatePassword(
        user,
        oldPassword,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException("Current password is incorrect");
      }

      await this.userService.update(userId, { password: newPassword });
      return { message: "Password updated successfully" };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException("Password change failed: " + error.message);
    }
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      // Verify the old refresh token
      const payload: any = this.jwtService.verify(oldRefreshToken);

      // Retrieve the user
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // Prepare plain user object (without password)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...plainUser } = (user as any).toObject
        ? (user as any).toObject()
        : (user as any);

      // Issue new tokens
      return this.generateToken(plainUser);
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    try {
      // In a real implementation, you might:
      // 1. Add the token to a blacklist
      // 2. Log the logout event
      // 3. Clear any server-side sessions

      // Log the logout event for security monitoring
      console.log(`User ${userId} logged out at ${new Date().toISOString()}`);

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      throw new BadRequestException("Logout failed");
    }
  }

  async forgotPassword(email: string) {
    try {
      // Check if user exists
      const user = await this.userService.findByEmailSafe(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return {
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent.",
        };
      }

      // In a real implementation, you would:
      // 1. Generate a secure reset token
      // 2. Store it with expiration
      // 3. Send email with reset link
      // 4. Log the request for security monitoring

      // Log the password reset request for security monitoring
      console.log(
        `Password reset requested for email: ${email} at ${new Date().toISOString()}`,
      );

      return {
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      };
    } catch (error) {
      throw new BadRequestException("Failed to process password reset request");
    }
  }

  private async generateToken(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };

    // Get active subscription details
    const activeSubscription = await this.subscriptionService
      .findByCustomer(user._id)
      .then((subscriptions) =>
        subscriptions.find((sub) => sub.status === "active"),
      );

    // Get customer profile
    const customerProfile = await this.customerProfileService.findByUserId(
      user._id,
    );

    // Calculate subscription metrics
    const subscriptionMetrics = activeSubscription
      ? {
          daysLeft: Math.ceil(
            (new Date(activeSubscription.endDate).getTime() -
              new Date().getTime()) /
              (1000 * 3600 * 24),
          ),
          mealsLeft:
            activeSubscription.plan.mealsPerDay *
            Math.ceil(
              (new Date(activeSubscription.endDate).getTime() -
                new Date().getTime()) /
                (1000 * 3600 * 24),
            ),
          rating: customerProfile?.rating || 0,
          savings: customerProfile?.totalSavings || 0,
        }
      : null;

    // Get current plan details
    const currentPlan = activeSubscription
      ? {
          name: activeSubscription.plan.name,
          description: activeSubscription.plan.description,
          mealsPerDay: activeSubscription.plan.mealsPerDay,
          validUntil: activeSubscription.endDate,
          imageUrl: activeSubscription.plan.imageUrl,
        }
      : null;

    // Get today's meals
    const todaysMeals = await this.mealService.getTodayMeals(user._id);

    return {
      token: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: "30d" }),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profile: {
          city: customerProfile?.city,
          college: customerProfile?.college,
          branch: customerProfile?.branch,
          graduationYear: customerProfile?.graduationYear,
          dietaryPreferences: customerProfile?.dietaryPreferences || [],
          favoriteCuisines: customerProfile?.favoriteCuisines || [],
          deliveryAddresses: customerProfile?.deliveryAddresses || [],
        },
        subscription: {
          isActive: !!activeSubscription,
          metrics: subscriptionMetrics,
          currentPlan: currentPlan,
        },
        meals: {
          today: todaysMeals.map((meal) => ({
            id: meal.id,
            type: meal.type,
            status: meal.status,
            // Adapter mapping to student app contract
            menuItems: (meal as any).menu ?? [],
            rating: (meal as any).userRating ?? null,
            businessPartnerName: (meal as any).restaurantName ?? null,
            scheduledDate: (meal as any).date ?? null,
          })),
        },
      },
    };
  }

  async checkPhoneExists(
    phoneNumber: string,
    role: UserRole.CUSTOMER | UserRole.PARTNER,
  ) {
    try {
      const user = await this.userService.findByPhoneNumber(phoneNumber);

      if (!user) {
        return {
          exists: false,
          userId: null,
          role: null,
        };
      }

      // Check if user has the specified role (role is now required)
      const hasRole = user.role === role;
      return {
        exists: hasRole,
        userId: hasRole ? user._id : null,
        role: user.role,
        message: hasRole
          ? null
          : `This phone number is registered as a ${user.role}. Please use the correct app for your account type.`,
      };
    } catch (error) {
      console.error("Error checking phone existence:", error);
      return {
        exists: false,
        userId: null,
        role: null,
        error: "Failed to check phone existence",
      };
    }
  }

  async loginWithPhone(
    phoneNumber: string,
    firebaseUid: string,
    role: UserRole.CUSTOMER | UserRole.PARTNER,
  ) {
    try {
      // Find user by phone number
      const user = await this.userService.findByPhoneNumber(phoneNumber);

      if (!user) {
        throw new NotFoundException("User not found with this phone number");
      }

      // Check if user has the specified role (role is now required)
      if (user.role !== role) {
        throw new UnauthorizedException(
          `This phone number is registered as a ${user.role}. Please use the correct app for your account type.`,
        );
      }

      if (!user.isActive) {
        throw new UnauthorizedException(
          "Your account has been deactivated. Please contact support.",
        );
      }

      // Store Firebase UID and mark phone as verified
      if (!user.firebaseUid) {
        await this.userService.updateFirebaseUid(user._id, firebaseUid);
        // Mark phone as verified since Firebase has verified it
        await this.userService.updatePhoneVerification(user._id, true);
      }

      return this.generateToken(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException("Phone login failed. Please try again.");
    }
  }

  async linkPhoneToAccount(linkPhoneDto: LinkPhoneDto) {
    try {
      const { email, password, phoneNumber, firebaseUid } = linkPhoneDto;

      // Validate user credentials
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException("Invalid email or password");
      }

      // Check if phone number is already in use by another user
      const existingPhoneUser =
        await this.userService.findByPhoneNumber(phoneNumber);
      if (
        existingPhoneUser &&
        existingPhoneUser._id.toString() !== user._id.toString()
      ) {
        throw new ConflictException(
          "Phone number is already linked to another account",
        );
      }

      // Update user with phone number and Firebase UID
      const updatedUser = await this.userService.update(user._id, {
        phoneNumber,
        firebaseUid,
      });

      return {
        message: "Phone number linked successfully",
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
        },
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        "Failed to link phone number. Please try again.",
      );
    }
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    try {
      const { identifier, role } = dto;

      // Find user by email, phone, or username with matching role
      let user = null;

      // Try to find by email first
      if (identifier.includes("@")) {
        user = await this.userService.findByEmailSafe(identifier);
      } else {
        // Try phone number
        user = await this.userService.findByPhoneNumber(identifier);
      }

      // If no user found by email/phone, try username (firstName + lastName)
      if (!user) {
        const nameParts = identifier.split(" ");
        if (nameParts.length >= 2) {
          user = await this.userService.findByUsername(
            nameParts[0],
            nameParts.slice(1).join(" "),
            role as UserRole,
          );
        }
      }

      // Check if user exists and role matches
      if (user && user.role === role) {
        const now = new Date();
        const lastRequest = user.lastPasswordResetRequest;

        // Check rate limiting
        if (lastRequest) {
          const timeSinceLastRequest = now.getTime() - lastRequest.getTime();
          const isWithinWindow =
            timeSinceLastRequest < passwordResetConfig.rateLimitWindowMs;

          if (
            isWithinWindow &&
            user.passwordResetAttempts >= passwordResetConfig.maxAttemptsPerHour
          ) {
            const nextResetAvailableIn =
              passwordResetConfig.rateLimitWindowMs - timeSinceLastRequest;
            const nextResetAvailableAt = new Date(
              now.getTime() + nextResetAvailableIn,
            );

            throw new BadRequestException({
              success: false,
              message:
                "Too many password reset attempts. Please try again later.",
              rateLimit: {
                attemptsRemaining: 0,
                maxAttempts: passwordResetConfig.maxAttemptsPerHour,
                nextResetAvailableIn,
                nextResetAvailableAt: nextResetAvailableAt.toISOString(),
              },
            });
          }
        }

        // Generate secure reset token
        const resetToken = crypto
          .randomBytes(passwordResetConfig.tokenLength)
          .toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Set expiry time
        const expiresAt = new Date(
          now.getTime() + passwordResetConfig.tokenExpiryMs,
        );

        // Update user with reset token and increment attempts
        const attempts =
          lastRequest &&
          now.getTime() - lastRequest.getTime() <
            passwordResetConfig.rateLimitWindowMs
            ? (user.passwordResetAttempts || 0) + 1
            : 1;

        await this.userService.update(user._id, {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiresAt,
          passwordResetAttempts: attempts,
          lastPasswordResetRequest: now,
        });

        // Determine frontend URL based on role
        const frontendUrl =
          role === "customer"
            ? this.configService.get<string>("STUDENT_APP_URL")
            : this.configService.get<string>("PARTNER_APP_URL");

        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        // Send password reset email
        await this.emailService.sendPasswordResetEmail(user.email, {
          name: `${user.firstName} ${user.lastName}`.trim() || user.email,
          resetToken,
          role,
          resetUrl,
        });

        // Calculate remaining attempts
        const attemptsRemaining =
          passwordResetConfig.maxAttemptsPerHour - attempts;

        return {
          success: true,
          message: `If your account exists, a password reset link will be sent to ${passwordResetConfig.maskEmail(user.email)}`,
          rateLimit: {
            attemptsRemaining,
            maxAttempts: passwordResetConfig.maxAttemptsPerHour,
            resetWindowMinutes:
              passwordResetConfig.rateLimitWindowMs / (60 * 1000),
          },
        };
      }

      // If no user found, return success anyway (security: don't reveal if account exists)
      return {
        success: true,
        message: `If your account exists, a password reset link will be sent to ${passwordResetConfig.maskEmail(
          identifier.includes("@") ? identifier : "***@*****.com",
        )}`,
        rateLimit: {
          attemptsRemaining: passwordResetConfig.maxAttemptsPerHour,
          maxAttempts: passwordResetConfig.maxAttemptsPerHour,
          resetWindowMinutes:
            passwordResetConfig.rateLimitWindowMs / (60 * 1000),
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        "Failed to process password reset request. Please try again.",
      );
    }
  }

  async verifyPasswordReset(dto: VerifyPasswordResetDto) {
    try {
      const { token, newPassword, confirmPassword } = dto;

      // Validate password confirmation
      if (newPassword !== confirmPassword) {
        throw new BadRequestException("Passwords do not match.");
      }

      // Find user with valid reset token
      const user = await this.userService.findByPasswordResetToken(token);
      if (!user) {
        throw new BadRequestException(
          "Invalid or expired reset token. Please request a new password reset.",
        );
      }

      // Check if token has expired
      if (
        !user.passwordResetExpires ||
        user.passwordResetExpires < new Date()
      ) {
        throw new BadRequestException(
          "Reset token has expired. Please request a new password reset.",
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password and clear reset fields
      await this.userService.update(user._id, {
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        passwordResetAttempts: 0,
        lastPasswordResetRequest: undefined,
      });

      // Send password change confirmation email
      await this.emailService.sendPasswordChangeConfirmation(user.email, {
        name: `${user.firstName} ${user.lastName}`.trim() || user.email,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        message:
          "Password has been reset successfully. You can now login with your new password.",
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        "Failed to reset password. Please try again.",
      );
    }
  }
}
