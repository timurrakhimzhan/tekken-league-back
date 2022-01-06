import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeChallengeStatusDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: "INVALID_COMMENT" })
  comment?: string;

  @IsDefined()
  @IsEnum(
    { ACCEPTED: "ACCEPTED", REJECTED: "REJECTED" },
    { message: "INVALID_CONFIRMATION" },
  )
  confirmation: "ACCEPTED" | "REJECTED";
}
