import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CustomerProfileService } from "./customer-profile.service";
import { CustomerProfile } from "./schemas/customer-profile.schema";

@Controller("customer-profile")
@UseGuards(JwtAuthGuard)
export class CustomerProfileController {
  constructor(
    private readonly customerProfileService: CustomerProfileService,
  ) {}

  @Get(":userId")
  async findByUserId(
    @Param("userId") userId: string,
  ): Promise<CustomerProfile | null> {
    return this.customerProfileService.findByUserId(userId);
  }

  @Post()
  async create(
    @Body() data: Partial<CustomerProfile>,
  ): Promise<CustomerProfile> {
    return this.customerProfileService.create(data);
  }

  @Put(":userId")
  async update(
    @Param("userId") userId: string,
    @Body() data: Partial<CustomerProfile>,
  ): Promise<CustomerProfile | null> {
    return this.customerProfileService.update(userId, data);
  }

  @Delete(":userId")
  async delete(@Param("userId") userId: string): Promise<boolean> {
    return this.customerProfileService.delete(userId);
  }
}
