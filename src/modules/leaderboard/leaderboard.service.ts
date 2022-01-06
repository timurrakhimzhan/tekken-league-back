import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LeaderboardService {
  constructor(private prismaService: PrismaService) {}

  async getTop10(): Promise<GetTop10Response> {
    let users: Array<{ username: string; rating?: number }> = [];
    users = await this.prismaService.userSeason.findMany({
      orderBy: [
        {
          rating: "desc",
        },
        {
          User: {
            username: "asc",
          },
        },
      ],
      distinct: "username",
      select: {
        username: true,
        rating: true,
      },
      take: 10,
    });
    if (users.length < 10) {
      const usersNotPlayed = await this.prismaService.user.findMany({
        where: {
          UserSeasons: {
            none: {
              Season: {
                isCurrent: true,
              },
            },
          },
        },
        orderBy: { username: "asc" },
        select: {
          username: true,
        },
        take: 10 - users.length,
      });
      users = [...users, ...usersNotPlayed];
    }

    return {
      count: 10,
      items: users.map(({ username, rating }, i) => ({
        rank: i + 1,
        username,
        rating: rating || 0,
      })),
    };
  }
}
