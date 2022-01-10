import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class RefreshTokenBodyDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResDto {
  @ApiProperty()
  accessToken: string;
}
