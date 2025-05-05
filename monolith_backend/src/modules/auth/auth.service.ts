import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { User } from "../user/schemas/user.schema";
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
        const { password, ...result } = user.toObject();
        return result;
      }

      return null;
    } catch (error) {
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
      const { password, ...result } = user.toObject();
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
      const { password, ...result } = user.toObject();
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

  private async generateToken(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    
    // Get active subscription details
    const activeSubscription = await this.subscriptionService.findByCustomer(user._id)
      .then(subscriptions => subscriptions.find(sub => sub.status === 'active'));

    // Get customer profile
    const customerProfile = await this.customerProfileService.findByUserId(user._id);

    // Calculate subscription metrics
    const subscriptionMetrics = activeSubscription ? {
      daysLeft: Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
      mealsLeft: activeSubscription.plan.mealsPerDay * Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
      rating: customerProfile?.rating || 0,
      savings: customerProfile?.totalSavings || 0
    } : null;

    // Get current plan details
    const currentPlan = activeSubscription ? {
      name: activeSubscription.plan.name,
      description: activeSubscription.plan.description,
      mealsPerDay: activeSubscription.plan.mealsPerDay,
      validUntil: activeSubscription.endDate,
      imageUrl: activeSubscription.plan.imageUrl
    } : null;

    // Get today's meals
    const todaysMeals = await this.mealService.findTodayMeals(user._id);

    return {
      access_token: this.jwtService.sign(payload),
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
          deliveryAddresses: customerProfile?.deliveryAddresses || []
        },
        subscription: {
          isActive: !!activeSubscription,
          metrics: subscriptionMetrics,
          currentPlan: currentPlan
        },
        meals: {
          today: todaysMeals.map(meal => ({
            id: meal.id,
            type: meal.type,
            status: meal.status,
            menuItems: meal.menuItems,
            rating: meal.rating,
            businessPartnerName: meal.businessPartnerName,
            scheduledDate: meal.scheduledDate
          }))
        }
      }
    };
  }
}
