import { ApiProperty } from "@nestjs/swagger";
import { MatchStatus } from "@prisma/client";

export class GetMatchesItemDto {
  @ApiProperty()
  id: number;

  p1: {
    username: string;
    score: number | null;
  };

  p2: {
    username: string;
    score: number | null;
  };

  firstTo: number;

  date: Date;

  @ApiProperty({ enum: MatchStatus })
  status: MatchStatus;

  delta: number | null;
}

export class GetMatchesResDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true })
  items: Array<GetMatchesItemDto>;
}
