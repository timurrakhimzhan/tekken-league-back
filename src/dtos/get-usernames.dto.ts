import { ApiProperty } from "@nestjs/swagger";

export class GetUsernamesResDto {
  @ApiProperty()
  count: number;
  items: Array<string>;
}
