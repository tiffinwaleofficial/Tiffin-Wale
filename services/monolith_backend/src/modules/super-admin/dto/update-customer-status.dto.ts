import { IsEnum, IsNotEmpty } from "class-validator";

export enum CustomerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export class UpdateCustomerStatusDto {
  @IsNotEmpty()
  @IsEnum(CustomerStatus)
  status: CustomerStatus;
}
