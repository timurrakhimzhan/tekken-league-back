import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateChallengeBodyDto } from "../../dtos/create-challenge.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ChallengeStatus, MatchStatus } from "@prisma/client";
import { GetChallengesResDto } from "../../dtos/get-challenges.dto";
import { GetChallengeResDto } from "../../dtos/get-challenge.dto";
import { ChangeChallengeStatusBodyDto } from "../../dtos/change-challenge-status.dto";

@Injectable()
export class ChallengeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createChallenge(username: string, challenge: CreateChallengeBodyDto) {
    if (username === challenge.opponentUsername) {
      throw new HttpException(
        "CAN_NOT_CHALLENGE_YOURSELF",
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentPendingChallengesCount =
      await this.prismaService.challenge.count({
        where: {
          challengerUsername: username,
          challengedUsername: challenge.opponentUsername,
          status: ChallengeStatus.PENDING,
        },
      });
    if (currentPendingChallengesCount) {
      throw new HttpException(
        "PENDING_CHALLENGE_EXISTS",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prismaService.challenge.create({
      data: {
        challengerUsername: username,
        challengedUsername: challenge.opponentUsername,
        firstTo: challenge.firstTo,
        challengeComment: challenge.comment,
        status: ChallengeStatus.PENDING,
      },
    });
  }

  async getChallenges(username: string): Promise<GetChallengesResDto> {
    const count = await this.prismaService.challenge.count({
      where: {
        OR: [
          {
            challengerUsername: username,
          },
          {
            challengedUsername: username,
          },
        ],
      },
    });
    const challenges = await this.prismaService.challenge.findMany({
      where: {
        OR: [
          {
            challengerUsername: username,
          },
          {
            challengedUsername: username,
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        UserChallenged: true,
        UserChallenger: true,
      },
    });
    const items: GetChallengesResDto["items"] = challenges.map((item) => {
      return {
        id: item.id,
        challenged: {
          username: item.challengedUsername,
          character: item.UserChallenged.character,
        },
        challenger: {
          username: item.challengerUsername,
          character: item.UserChallenger.character,
        },
        firstTo: item.firstTo,
        status: item.status,
        date: item.createdAt,
      };
    });

    return {
      count,
      items,
    };
  }

  async getChallenge(
    username: string,
    id: number,
  ): Promise<GetChallengeResDto> {
    const challenge = await this.prismaService.challenge.findFirst({
      where: {
        id,
        OR: [
          { challengerUsername: username },
          { challengedUsername: username },
        ],
      },
      include: {
        Match: true,
      },
    });
    if (!challenge) {
      throw new HttpException("CHALLENGE_NOT_FOUND", HttpStatus.FORBIDDEN);
    }
    return {
      id: challenge.id,
      challengerUsername: challenge.challengerUsername,
      challengedUsername: challenge.challengedUsername,
      firstTo: challenge.firstTo,
      challengeComment: challenge.challengeComment,
      answerComment: challenge.answerComment,
      status: challenge.status,
      matchId: challenge.Match?.id || null,
      statusChangedAt: challenge.statusChangedAt,
    };
  }

  async changeChallengeStatus(
    username: string,
    id: number,
    changeInfo: ChangeChallengeStatusBodyDto,
  ) {
    const challengeFromDb = await this.prismaService.challenge.findFirst({
      where: {
        id,
        challengedUsername: username,
      },
      select: {
        id: true,
        challengedUsername: true,
        challengerUsername: true,
      },
    });

    if (challengeFromDb === null) {
      throw new HttpException(
        "CHALLENGED_NOT_FOUND_OR_NOT_ALLOWED",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (changeInfo.confirmation === "REJECTED") {
      await this.prismaService.challenge.update({
        where: {
          id,
        },
        data: {
          status: changeInfo.confirmation,
          answerComment: changeInfo.comment,
          statusChangedAt: new Date(),
        },
      });
      return;
    }
    const currentSeason = await this.prismaService.season.findFirst({
      where: {
        isCurrent: true,
      },
      select: {
        id: true,
      },
    });
    if (!currentSeason) {
      throw new HttpException(
        "NO_SEASON_ACTIVE",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await this.prismaService.$transaction([
      this.prismaService.challenge.update({
        where: {
          id,
        },
        data: {
          status: changeInfo.confirmation,
          answerComment: changeInfo.comment,
          statusChangedAt: new Date(),
        },
      }),
      this.prismaService.match.create({
        data: {
          p1Username: challengeFromDb.challengerUsername,
          p2Username: challengeFromDb.challengedUsername,
          challengeId: challengeFromDb.id,
          status: MatchStatus.IN_PROGRESS,
          seasonId: currentSeason.id,
        },
      }),
    ]);
  }
}
