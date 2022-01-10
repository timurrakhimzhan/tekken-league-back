import { IsDefined, IsString, MaxLength, MinLength } from "class-validator";
import { Match } from "../decorators/match.decorator";

export class ChangePasswordBodyDto {
  @IsDefined({ message: "OLD_PASSWORD_REQUIRED" })
  @IsString({ message: "OLD_PASSWORD_INVALID" })
  oldPassword: string;

  @IsDefined({ message: "NEW_PASSWORD_REQUIRED" })
  @IsString({ message: "NEW_PASSWORD_INVALID" })
  @MinLength(6, { message: "PASSWORD_TOO_SHORT" })
  @MaxLength(30, { message: "PASSWORD_TOO_LONG" })
  newPassword: string;

  @IsDefined({ message: "CONFIRM_NEW_PASSWORD_REQUIRED" })
  @IsString({ message: "CONFIRM_NEW_PASSWORD_INVALID" })
  @Match(ChangePasswordBodyDto, (dto) => dto.newPassword, {
    message: "PASSWORDS_DONT_MATCH",
  })
  confirmNewPassword: string;
}
