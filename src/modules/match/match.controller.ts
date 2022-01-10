import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Patch,
  Body,
} from "@nestjs/common";
import { JwtGuard } from "../../guards/jwt.guard";
import { FastifyUserRequest } from "../../types/fastify-user-request";
import { GetMatchesResDto } from "../../dtos/get-matches.dto";
import { MatchService } from "./match.service";
import { GetMatchResDto } from "../../dtos/get-match.dto";
import { DeclineMatchBodyDto } from "../../dtos/decline-match.dto";
import { SubmitScoreBodyDto } from "../../dtos/submit-score.dto";
import { ChangeScoreConfirmationBodyDto } from "../../dtos/change-score-confirmation.dto";

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

  @Get("/:id")
  @UseGuards(JwtGuard)
  async getMatch(
    @Request() req: FastifyUserRequest,
    @Param("id") id: number,
  ): Promise<GetMatchResDto> {
    return this.matchService.getMatch(req.user.username, id);
  }

  @Patch("/:id/decline")
  @UseGuards(JwtGuard)
  async declineMatch(
    @Request() req: FastifyUserRequest,
    @Param("id") id: number,
    @Body() info: DeclineMatchBodyDto,
  ) {
    return this.matchService.declineMatch(req.user.username, id, info);
  }

  @Patch("/:id/submit-score")
  @UseGuards(JwtGuard)
  async submitScore(
    @Request() req: FastifyUserRequest,
    @Param("id") id: number,
    @Body() info: SubmitScoreBodyDto,
  ) {
    return this.matchService.submitScore(req.user.username, id, info);
  }

  @Patch("/:id/change-score-confirmation")
  @UseGuards(JwtGuard)
  async changeScoreConfirmation(
    @Request() req: FastifyUserRequest,
    @Param("id") id: number,
    @Body() info: ChangeScoreConfirmationBodyDto,
  ) {
    return this.matchService.changeScoreConfirmation(
      req.user.username,
      id,
      info,
    );
  }
}
