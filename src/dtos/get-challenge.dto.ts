import { ApiProperty } from "@nestjs/swagger";
import { ChallengeStatus } from "@prisma/client";

export class GetChallengeResDto {
  @ApiProperty()
  id: number;
  challengerUsername: string;
  challengedUsername: string;
  firstTo: number;
  @ApiProperty({ enum: ChallengeStatus })
  status: ChallengeStatus;
  challengeComment: string | null;
  statusChangedAt: Date | null;
  answerComment: string | null;
  matchId: number | null;
}
