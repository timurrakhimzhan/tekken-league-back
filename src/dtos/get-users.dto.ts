import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class GetUsersItemDto {
  @ApiProperty()
  username: string;
  steamUrl: string;
  character: string;
  rating: number;
  rank: number;
}

export class GetUsersResDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true })
  items: Array<GetUsersItemDto>;
}

export class GetUsersQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: "INVALID_USERNAME" })
  username?: string;

  @IsOptional()
  @IsString({ message: "INVALID_CHARACTER" })
  character?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "INVALID_PAGE" })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "INVALID_PER_PAGE" })
  perPage?: number;
}
