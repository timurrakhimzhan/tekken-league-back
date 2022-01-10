import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeChallengeStatusBodyDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: "INVALID_COMMENT" })
  comment?: string;

  @ApiProperty({ enum: { ACCEPTED: "ACCEPTED", REJECTED: "REJECTED" } })
  @IsDefined()
  @IsEnum(
    { ACCEPTED: "ACCEPTED", REJECTED: "REJECTED" },
    { message: "INVALID_CONFIRMATION" },
  )
  confirmation: "ACCEPTED" | "REJECTED";
}
