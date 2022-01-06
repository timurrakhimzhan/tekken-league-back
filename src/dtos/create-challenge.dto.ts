import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateChallengeBodyDto {
  @ApiProperty()
  @IsDefined({ message: "OPPONENT_USERNAME_REQUIRED" })
  @IsString({ message: "INVALID_OPPONENT_USERNAME" })
  opponentUsername: string;

  @IsDefined({ message: "FIRST_TO_REQUIRED" })
  @Type(() => Number)
  @IsNumber({}, { message: "INVALID_FIRST_TO" })
  @Min(1, { message: "INVALID_FIRST_TO" })
  @Max(29, { message: "INVALID_FIRST_TO" })
  firstTo: number;

  @IsOptional()
  @IsString({ message: "INVALID_COMMENT" })
  comment?: string;
}
