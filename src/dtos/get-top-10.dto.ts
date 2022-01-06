import { ApiProperty } from "@nestjs/swagger";

class GetTop10ItemDto {
  username: string;
  rating: number;
  rank: number;
}

export class GetTop10ResDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true })
  items: Array<GetTop10ItemDto>;
}
