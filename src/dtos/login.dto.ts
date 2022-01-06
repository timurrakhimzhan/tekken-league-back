import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class LoginResDto {
  @ApiProperty()
  token: string;
}

export class LoginBodyDto {
  @ApiProperty()
  @IsDefined({ message: "USERNAME_REQUIRED" })
  @IsString({ message: "INVALID_USERNAME" })
  username: string;

  @IsDefined({ message: "PASSWORD_REQUIRED" })
  @IsString({ message: "PASSWORD_INVALID" })
  password: string;
}
