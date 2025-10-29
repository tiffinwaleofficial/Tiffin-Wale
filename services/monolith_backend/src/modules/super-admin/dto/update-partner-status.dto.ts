import { IsEnum, IsNotEmpty } from "class-validator";
import { PartnerStatus } from "../../partner/schemas/partner.schema";

export class UpdatePartnerStatusDto {
  @IsNotEmpty()
  @IsEnum(PartnerStatus)
  status: PartnerStatus;
}
