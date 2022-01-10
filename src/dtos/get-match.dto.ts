import { ApiProperty } from "@nestjs/swagger";
import { MatchStatus } from "@prisma/client";

export class GetMatchResDto {
  @ApiProperty()
  id: number;
  p1: {
    username: string;
    score: number | null;
    delta: number | null;
  };
  p2: {
    username: string;
    score: number | null;
    delta: number | null;
  };
  firstTo: number;
  createdAt: Date;
  updatedAt: Date;
  @ApiProperty({ enum: MatchStatus })
  status: MatchStatus;
  challengeId: number | null;
  declinedBy: string | null;
  declineComment: string | null;
  submittedBy: string | null;
  resultSubmittedAt: Date | null;
}
