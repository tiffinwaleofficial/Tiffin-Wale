import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RedisService } from "../redis/redis.service";
import { UserRole } from "../../common/interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly redisService: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // Hash password only if provided
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create new user
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role, // Explicitly set role to prevent default
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    try {
      // Check Redis cache first
      const cachedUser = await this.redisService.getUserProfile(id);
      if (cachedUser) {
        return cachedUser;
      }

      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Cache user profile in Redis
      await this.redisService.cacheUserProfile(id, user.toObject());

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // First check if user exists
      await this.findById(id);

      // If email is being updated, check if it's already in use by another user
      if (updateUserDto.email) {
        const existingUser = await this.userModel
          .findOne({
            email: updateUserDto.email,
            _id: { $ne: id }, // Exclude current user from check
          })
          .exec();

        if (existingUser) {
          throw new ConflictException(
            `Email ${updateUserDto.email} is already in use by another user`,
          );
        }
      }

      // If password is included, hash it
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      return updatedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      if (error.name === "MongoServerError" && error.code === 11000) {
        throw new ConflictException("Email address is already in use");
      }

      if (error.name === "CastError") {
        throw new BadRequestException(`Invalid user ID: ${id}`);
      }

      throw new InternalServerErrorException(
        "Error updating user: " + error.message,
      );
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === "CastError") {
        throw new BadRequestException(`Invalid user ID: ${id}`);
      }

      throw new InternalServerErrorException(
        "Error removing user: " + error.message,
      );
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  /**
   * Count users by role
   */
  async countByRole(role: string): Promise<number> {
    return this.userModel.countDocuments({ role }).exec();
  }

  /**
   * Find user by phone number
   */
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  /**
   * Update Firebase UID for a user
   */
  async updateFirebaseUid(userId: string, firebaseUid: string): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { firebaseUid }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }

  /**
   * Update phone verification status for a user
   */
  async updatePhoneVerification(
    userId: string,
    phoneVerified: boolean,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { phoneVerified }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }

  /**
   * Find user by email (safe method that doesn't throw if not found)
   */
  async findByEmailSafe(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Find user by username (firstName + lastName) and role
   */
  async findByUsername(
    firstName: string,
    lastName: string,
    role: UserRole,
  ): Promise<User | null> {
    return this.userModel
      .findOne({
        firstName: { $regex: new RegExp(`^${firstName}$`, "i") },
        lastName: { $regex: new RegExp(`^${lastName}$`, "i") },
        role,
      })
      .exec();
  }

  /**
   * Find user by password reset token
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    const users = await this.userModel
      .find({
        passwordResetToken: { $exists: true },
        passwordResetExpires: { $gt: new Date() },
      })
      .exec();

    // Check each user's hashed token
    for (const user of users) {
      if (
        user.passwordResetToken &&
        (await bcrypt.compare(token, user.passwordResetToken))
      ) {
        return user;
      }
    }

    return null;
  }
}
