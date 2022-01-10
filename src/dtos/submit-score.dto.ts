import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class SubmitScoreBodyDto {
  @ApiProperty()
  @IsNumber()
  @Min(0, { message: "INVALID_SCORE" })
  p1Score: number;

  @IsNumber()
  @Min(0, { message: "INVALID_SCORE" })
  p2Score: number;
}
