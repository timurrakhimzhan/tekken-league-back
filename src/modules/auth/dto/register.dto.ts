import {
  Contains,
  IsDefined,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Match } from "../../../decorators/match.decorator";

const usernameRegEx = /^[a-z0-9_.]{3,}$/;

export class RegisterDto {
  @IsDefined({ message: "USERNAME_REQUIRED" })
  @IsString({ message: "INVALID_USERNAME" })
  @MinLength(3, { message: "USERNAME_TOO_SHORT" })
  @MaxLength(20, { message: "USERNAME_TOO_LONG" })
  @Matches(usernameRegEx, { message: "INVALID_USERNAME" })
  username: string;

  @IsDefined({ message: "EMAIL_REQUIRED" })
  @IsString({ message: "INVALID_EMAIL" })
  @IsEmail({}, { message: "INVALID_EMAIL" })
  email: string;

  @IsDefined({ message: "STEAM_URL_REQUIRED" })
  @IsString({ message: "STEAM_INVALID" })
  @MinLength(28, { message: "STEAM_INVALID" })
  @Contains("https://steamcommunity.com/", { message: "STEAM_INVALID" })
  @MaxLength(100, { message: "STEAM_INVALID" })
  steamUrl: string;

  @IsDefined({ message: "CHARACTER_REQUIRED" })
  @IsString({ message: "INVALID_CHARACTER" })
  character: string;

  @IsDefined({ message: "PASSWORD_REQUIRED" })
  @IsString({ message: "PASSWORD_INVALID" })
  @MinLength(6, { message: "PASSWORD_TOO_SHORT" })
  @MaxLength(30, { message: "PASSWORD_TOO_LONG" })
  password: string;

  @IsDefined({ message: "CONFIRM_PASSWORD_REQUIRED" })
  @IsString({ message: "CONFIRM_PASSWORD_INVALID" })
  @Match(RegisterDto, (dto) => dto.password, { message: "PASSWORD_DONT_MATCH" })
  confirmPassword: string;
}
