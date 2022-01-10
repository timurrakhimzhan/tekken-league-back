import { ApiProperty } from "@nestjs/swagger";
import { ChallengeStatus } from "@prisma/client";

class GetChallengesItemDto {
  id: number;
  challenger: {
    username: string;
    character: string;
  };
  challenged: {
    username: string;
    character: string;
  };
  firstTo: number;
  @ApiProperty({ enum: ChallengeStatus })
  status: ChallengeStatus;
  date: Date;
}

export class GetChallengesResDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true })
  items: Array<GetChallengesItemDto>;
}
