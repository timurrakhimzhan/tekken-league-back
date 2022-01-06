import { Controller, Get } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { GetTop10ResDto } from "../../dtos/get-top-10.dto";

@Controller("leaderboard")
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}
  @Get("top-10")
  getTop10(): Promise<GetTop10ResDto> {
    return this.leaderboardService.getTop10();
  }
}
