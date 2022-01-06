import { Injectable } from "@nestjs/common";
import { GetMatchesResDto } from "../../dtos/get-matches.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}
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
      },
    });
    const items: GetMatchesResDto["items"] = matches.map((match) => {
      return {
        id: match.id,
        date: match.updatedAt,
        delta: match.p1Username === username ? match.p1Delta : match.p2Delta,
        p1: {
          username: match.p1Username,
          score: match.p1Score,
        },
        p2: {
          username: match.p2Username,
          score: match.p2Score,
        },
        firstTo: match.Challenge.firstTo,
        status: match.status,
      };
    });
    return {
      count,
      items,
    };
  }
}
