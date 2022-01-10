import {
  Contains,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EditProfileBodyDto {
  @ApiProperty()
  @IsDefined({ message: "STEAM_URL_REQUIRED" })
  @IsString({ message: "STEAM_INVALID" })
  @MinLength(28, { message: "STEAM_INVALID" })
  @Contains("https://steamcommunity.com/", { message: "STEAM_INVALID" })
  @MaxLength(100, { message: "STEAM_INVALID" })
  steamUrl: string;

  @IsDefined({ message: "CHARACTER_REQUIRED" })
  @IsString({ message: "INVALID_CHARACTER" })
  character: string;

  @IsOptional()
  @IsString({ message: "INVALID_OTHER_INFO" })
  otherInfo?: string;
}
