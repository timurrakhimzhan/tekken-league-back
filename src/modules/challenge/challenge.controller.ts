import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
  Patch,
} from "@nestjs/common";
import { CreateChallengeBodyDto } from "../../dtos/create-challenge.dto";
import { ChallengeService } from "./challenge.service";
import { JwtGuard } from "../../guards/jwt.guard";
import { FastifyUserRequest } from "../../types/fastify-user-request";
import { GetChallengesResDto } from "../../dtos/get-challenges.dto";
import { ChangeChallengeStatusBodyDto } from "../../dtos/change-challenge-status.dto";
import bcrypt from "bcryptjs";

@Controller("challenges")
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createChallenge(
    @Request() req: FastifyUserRequest,
    @Body() challenge: CreateChallengeBodyDto,
  ): Promise<void> {
    return this.challengeService.createChallenge(req.user.username, challenge);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getChallenges(
    @Request() req: FastifyUserRequest,
  ): Promise<GetChallengesResDto> {
    return this.challengeService.getChallenges(req.user.username);
  }

  @Get("/:id")
  @UseGuards(JwtGuard)
  async getChallenge(
    @Request() req: FastifyUserRequest,
    @Param("id") id: number,
  ) {
    return this.challengeService.getChallenge(req.user.username, id);
  }

  @Patch("/:id")
  @UseGuards(JwtGuard)
  async changeChallengeStatus(
    @Request() req: FastifyUserRequest,
    @Param("id") id: number,
    @Body() changeInfo: ChangeChallengeStatusBodyDto,
  ): Promise<void> {
    return this.challengeService.changeChallengeStatus(
      req.user.username,
      id,
      changeInfo,
    );
  }
}
