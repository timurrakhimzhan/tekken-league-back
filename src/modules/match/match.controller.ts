import { Controller, Get, UseGuards, Request, Param } from "@nestjs/common";
import { JwtGuard } from "../../guards/jwt.guard";
import { FastifyUserRequest } from "../../types/fastify-user-request";
import { GetMatchesResDto } from "../../dtos/get-matches.dto";
import { MatchService } from "./match.service";

@Controller("matches")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get("")
  @UseGuards(JwtGuard)
  async getOwnMatches(
    @Request() req: FastifyUserRequest,
  ): Promise<GetMatchesResDto> {
    return this.matchService.getMatchesByUsername(req.user.username);
  }

  @Get("by-username/:username")
  @UseGuards(JwtGuard)
  async getMatchesByUsername(
    @Param("username") username: string,
  ): Promise<GetMatchesResDto> {
    return this.matchService.getMatchesByUsername(username);
  }
}
