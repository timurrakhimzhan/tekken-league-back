import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeclineMatchBodyDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: "INVALID_COMMENT" })
  comment?: string;
}
