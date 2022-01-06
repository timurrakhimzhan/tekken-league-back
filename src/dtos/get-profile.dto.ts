import { ApiProperty } from "@nestjs/swagger";

export class GetProfileResDto {
  @ApiProperty()
  character: string;
  username: string;
  rank: number;
  rating: number;
  wins: number;
  loses: number;
  steamUrl: string;
  otherInfo: string | null;
}
