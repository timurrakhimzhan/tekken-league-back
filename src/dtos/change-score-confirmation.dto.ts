import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum } from "class-validator";

export class ChangeScoreConfirmationBodyDto {
  @ApiProperty({ enum: { CONFIRMED: "CONFIRMED", REJECTED: "REJECTED" } })
  @IsDefined()
  @IsEnum(
    { CONFIRMED: "CONFIRMED", REJECTED: "REJECTED" },
    { message: "INVALID_CONFIRMATION" },
  )
  confirmation: "CONFIRMED" | "REJECTED";
}
