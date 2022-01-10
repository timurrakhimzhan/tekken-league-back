import { ApiProperty } from "@nestjs/swagger";
import { MatchStatus } from "@prisma/client";
import { MatchController } from "../modules/match/match.controller";

export const MatchCategory = {
  WIN: "WIN",
  LOSE: "LOSE",
};

export type MatchCategoryType = keyof typeof MatchCategory;

export class GetMatchesItemDto {
  @ApiProperty()
  id: number;
  p1: {
    username: string;
    score: number | null;
    character: string;
    delta: number | null;
  };
  p2: {
    username: string;
    score: number | null;
    character: string;
    delta: number | null;
  };
  firstTo: number;
  createdAt: Date;
  @ApiProperty({ enum: MatchStatus })
  status: MatchStatus;
  @ApiProperty({ enum: MatchCategory })
  category: MatchCategoryType | null;
}

export class GetMatchesResDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true })
  items: Array<GetMatchesItemDto>;
}
