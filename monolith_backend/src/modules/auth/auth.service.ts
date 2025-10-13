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
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UserRole } from "../../common/interfaces/user.interface";
import { SubscriptionService } from "../subscription/subscription.service";
import { CustomerProfileService } from "../customer-profile/customer-profile.service";
import { MealService } from "../meal/meal.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly subscriptionService: SubscriptionService,
    private readonly customerProfileService: CustomerProfileService,
    private readonly mealService: MealService,
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
      const user = await this.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException("Invalid email or password");
      }

      if (!user.isActive) {
        throw new UnauthorizedException(
          "Your account has been deactivated. Please contact support.",
        );
      }

      return this.generateToken(user);
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

  async resetPassword(token: string, newPassword: string) {
    try {
      // In a real implementation, you would:
      // 1. Validate the reset token
      // 2. Check if it's expired
      // 3. Update the user's password
      // 4. Invalidate the token
      // 5. Log the password change

      // Validate token format (basic check)
      if (!token || token.length < 8) {
        throw new BadRequestException("Invalid reset token");
      }

      // Validate new password (basic check)
      if (!newPassword || newPassword.length < 6) {
        throw new BadRequestException(
          "New password must be at least 6 characters long",
        );
      }

      // Log the password reset attempt for security monitoring
      console.log(
        `Password reset attempted with token: ${token.substring(0, 8)}... at ${new Date().toISOString()}`,
      );

      // For now, return a mock response
      return {
        success: true,
        message:
          "Password has been reset successfully. You can now login with your new password.",
      };
    } catch (error) {
      throw new BadRequestException("Failed to reset password");
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
}
