import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  GetMatchesResDto,
  MatchCategory,
  MatchCategoryType,
} from "../../dtos/get-matches.dto";
import { PrismaService } from "../prisma/prisma.service";
import { GetMatchResDto } from "../../dtos/get-match.dto";
import { DeclineMatchBodyDto } from "../../dtos/decline-match.dto";
import { Match, MatchStatus } from "@prisma/client";
import { SubmitScoreBodyDto } from "../../dtos/submit-score.dto";
import { ChangeScoreConfirmationBodyDto } from "../../dtos/change-score-confirmation.dto";

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}

  determineCategory(match: Match, username: string): MatchCategoryType | null {
    if (match.status !== MatchStatus.FINISHED) {
      return null;
    }
    let winner: string | null = null;
    if (match.p1Score && match.p2Score) {
      winner =
        match.p1Score > match.p2Score ? match.p1Username : match.p2Username;
    }
    if (winner !== null && winner === username) {
      return "WIN";
    }
    if (winner !== null) {
      return "LOSE";
    }
    return null;
  }

  async getMatchesByUsername(username: string): Promise<GetMatchesResDto> {
    const count = await this.prismaService.match.count({
      where: {
        OR: [{ p1Username: username }, { p2Username: username }],
        Season: {
          isCurrent: true,
        },
      },
    });
    const matches = await this.prismaService.match.findMany({
      where: {
        OR: [{ p1Username: username }, { p2Username: username }],
        Season: {
          isCurrent: true,
        },
      },
      include: {
        Challenge: true,
        UserP1: true,
        UserP2: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const items: GetMatchesResDto["items"] = matches.map((match) => {
      return {
        id: match.id,
        createdAt: match.createdAt,
        p1: {
          username: match.p1Username,
          score: match.p1Score,
          character: match.UserP1.character,
          delta: match.p1Delta,
        },
        p2: {
          username: match.p2Username,
          score: match.p2Score,
          character: match.UserP2.character,
          delta: match.p2Delta,
        },
        firstTo: match.Challenge.firstTo,
        status: match.status,
        category: this.determineCategory(match, username),
      };
    });
    return {
      count,
      items,
    };
  }

  async getMatch(username: string, id: number): Promise<GetMatchResDto> {
    const match = await this.prismaService.match.findUnique({
      where: {
        id,
      },
      include: {
        Challenge: true,
      },
    });
    if (!match) {
      throw new HttpException("MATCH_NOT_FOUND", HttpStatus.BAD_REQUEST);
    }
    const isUserParticipant =
      username === match.p1Username || username === match.p2Username;
    return {
      id: match.id,
      p1: {
        username: match.p1Username,
        score: match.p1Score,
        delta: match.p1Delta,
      },
      p2: {
        username: match.p2Username,
        score: match.p2Score,
        delta: match.p2Delta,
      },
      firstTo: match.Challenge.firstTo,
      status: match.status,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      challengeId: isUserParticipant ? match.challengeId : null,
      declineComment: isUserParticipant ? match.declineComment : null,
      declinedBy: isUserParticipant ? match.declinedBy : null,
      submittedBy: isUserParticipant ? match.submittedBy : null,
      resultSubmittedAt: isUserParticipant ? match.resultSubmittedAt : null,
    };
  }

  async declineMatch(username: string, id: number, info: DeclineMatchBodyDto) {
    const count = await this.prismaService.match.count({
      where: {
        id,
        OR: [{ p1Username: username }, { p2Username: username }],
      },
    });
    if (count < 1) {
      throw new HttpException("MATCH_NOT_FOUND", HttpStatus.BAD_REQUEST);
    }
    await this.prismaService.match.update({
      where: {
        id,
      },
      data: {
        declineComment: info.comment,
        declinedBy: username,
        status: MatchStatus.DECLINED,
      },
    });
  }
  async submitScore(username: string, id: number, info: SubmitScoreBodyDto) {
    const match = await this.prismaService.match.findFirst({
      where: {
        id,
        OR: [{ p1Username: username }, { p2Username: username }],
      },
      include: {
        Challenge: true,
      },
    });
    if (match === null) {
      throw new HttpException("MATCH_NOT_FOUND", HttpStatus.BAD_REQUEST);
    }
    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new HttpException(
        "MATCH_STATUS_NOT_IN_PROGRESS",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      info.p1Score > match.Challenge.firstTo ||
      info.p2Score > match.Challenge.firstTo
    ) {
      throw new HttpException("INVALID_SCORE", HttpStatus.BAD_REQUEST);
    }
    const isP1Winner = info.p1Score === match.Challenge.firstTo;
    const isP2Winner = info.p2Score === match.Challenge.firstTo;
    if ((!isP1Winner && !isP2Winner) || (isP1Winner && isP2Winner)) {
      throw new HttpException("INVALID_SCORE", HttpStatus.BAD_REQUEST);
    }
    await this.prismaService.match.update({
      where: {
        id,
      },
      data: {
        p1Score: info.p1Score,
        p2Score: info.p2Score,
        submittedBy: username,
        resultSubmittedAt: new Date(),
        status: MatchStatus.CONFIRMING_SCORE,
      },
    });
  }

  async changeScoreConfirmation(
    username: string,
    id: number,
    confirmationInfo: ChangeScoreConfirmationBodyDto,
  ) {
    const match = await this.prismaService.match.findFirst({
      where: {
        id,
        OR: [{ p1Username: username }, { p2Username: username }],
      },
      include: {
        Challenge: true,
      },
    });
    if (match === null) {
      throw new HttpException("MATCH_NOT_FOUND", HttpStatus.BAD_REQUEST);
    }
    if (!match.p1Score || !match.p2Score) {
      throw new HttpException("WRONG_MATCH_SCORE_INFO", HttpStatus.BAD_REQUEST);
    }
    if (match.submittedBy === username) {
      throw new HttpException(
        "SUBMITTER_CAN_NOT_CONFIRM_SCORE",
        HttpStatus.BAD_REQUEST,
      );
    }
    const isP1Winner = match.p1Score > match.p2Score;
    const deltaP1 = 10;
    const deltaP2 = 10;
    if (confirmationInfo.confirmation === "CONFIRMED") {
      const currentSeason = await this.prismaService.season.findFirst({
        where: {
          isCurrent: true,
        },
      });
      if (!currentSeason) {
        throw new HttpException("NO_ACTIVE_SEASON", HttpStatus.BAD_REQUEST);
      }
      const [p1UserSeason, p2UserSeason] = await Promise.all([
        this.prismaService.userSeason.findFirst({
          where: {
            seasonId: currentSeason.id,
            username: match.p1Username,
          },
        }),
        this.prismaService.userSeason.findFirst({
          where: {
            seasonId: currentSeason.id,
            username: match.p2Username,
          },
        }),
      ]);
      await this.prismaService.$transaction([
        this.prismaService.match.update({
          where: {
            id,
          },
          data: {
            status: MatchStatus.FINISHED,
            p1Delta: isP1Winner ? deltaP1 : -deltaP1,
            p2Delta: isP1Winner ? -deltaP2 : deltaP2,
          },
        }),
        this.prismaService.userSeason.upsert({
          create: {
            seasonId: currentSeason.id,
            username: match.p1Username,
            rating: isP1Winner ? deltaP1 : -deltaP1,
            wins: isP1Winner ? 1 : 0,
            loses: isP1Winner ? 0 : 1,
          },
          update: {
            rating:
              (p1UserSeason?.rating || 0) + (isP1Winner ? deltaP1 : -deltaP1),
            wins: (p1UserSeason?.wins || 0) + (isP1Winner ? 1 : 0),
            loses: (p1UserSeason?.loses || 0) + (isP1Winner ? 0 : 1),
          },
          where: {
            username_seasonId: {
              username: match.p1Username,
              seasonId: currentSeason.id,
            },
          },
        }),
        this.prismaService.userSeason.upsert({
          create: {
            seasonId: currentSeason.id,
            username: match.p2Username,
            rating: isP1Winner ? -deltaP2 : deltaP2,
            wins: isP1Winner ? 0 : 1,
            loses: isP1Winner ? 1 : 0,
          },
          update: {
            rating:
              (p2UserSeason?.rating || 0) + (isP1Winner ? -deltaP2 : deltaP2),
            wins: (p2UserSeason?.wins || 0) + (isP1Winner ? 0 : 1),
            loses: (p2UserSeason?.loses || 0) + (isP1Winner ? 1 : 0),
          },
          where: {
            username_seasonId: {
              username: match.p2Username,
              seasonId: currentSeason.id,
            },
          },
        }),
      ]);
      return;
    }
    await this.prismaService.match.update({
      where: {
        id,
      },
      data: {
        status: MatchStatus.IN_PROGRESS,
        p1Score: null,
        p2Score: null,
        submittedBy: null,
        resultSubmittedAt: null,
      },
    });
  }
}
