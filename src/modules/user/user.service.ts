import {
  HttpException,
  HttpStatus,
  Injectable,
  Query,
  Request,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterBodyDto } from "../../dtos/register.dto";
import { LoginBodyDto } from "../../dtos/login.dto";
import { GetProfileResDto } from "../../dtos/get-profile.dto";
import {
  GetUsersItemDto,
  GetUsersQueryDto,
  GetUsersResDto,
} from "../../dtos/get-users.dto";
import { Prisma } from "@prisma/client";
import { GetTop10ResDto } from "../../dtos/get-top-10.dto";
import { EditProfileBodyDto } from "../../dtos/edit-profile.dto";
import { ChangePasswordBodyDto } from "../../dtos/change-password.dto";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateCredentials(credentials: LoginBodyDto): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: credentials.username,
      },
      select: {
        username: true,
        password: true,
      },
    });
    if (!user) {
      return false;
    }
    return bcrypt.compare(credentials.password, user.password);
  }

  async checkIfUsernameExists(username: string): Promise<boolean> {
    const usernameCount: number = await this.prismaService.user.count({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    return usernameCount > 0;
  }

  async checkIfEmailExists(email: string): Promise<boolean> {
    const emailCount = await this.prismaService.user.count({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
    return emailCount > 0;
  }

  async createUser(credentials: RegisterBodyDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    return this.prismaService.user.create({
      data: {
        email: credentials.email,
        username: credentials.username,
        character: credentials.character,
        steamUrl: credentials.steamUrl,
        password: await bcrypt.hash(credentials.password, salt),
      },
    });
  }

  async getUserRank(username: string, rating?: number | null): Promise<number> {
    if (rating) {
      const countRatingLess = await this.prismaService.userSeason.count({
        where: {
          Season: {
            isCurrent: true,
          },
          rating: {
            gt: rating,
          },
        },
      });
      const countRatingEqual = await this.prismaService.userSeason.count({
        where: {
          Season: {
            isCurrent: true,
          },
          rating,
          username: {
            lt: username,
          },
        },
      });
      return countRatingLess + countRatingEqual + 1;
    }
    const count = await this.prismaService.user.count({
      where: {
        OR: [
          {
            UserSeasons: {
              some: {
                Season: {
                  isCurrent: true,
                },
              },
            },
          },
          {
            UserSeasons: {
              none: {
                Season: {
                  isCurrent: true,
                },
              },
            },
            username: {
              lt: username,
            },
          },
        ],
      },
    });
    return count + 1;
  }

  async getProfile(username: string): Promise<GetProfileResDto> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      include: {
        UserSeasons: {
          where: {
            Season: {
              isCurrent: true,
            },
          },
        },
      },
    });
    if (!user) {
      throw new HttpException(`USER_NOT_FOUND`, 400);
    }
    const info: Pick<
      GetProfileResDto,
      "username" | "steamUrl" | "otherInfo" | "character" | "rank"
    > = {
      character: user.character,
      username: user.username,
      steamUrl: user.steamUrl,
      otherInfo: user.otherInfo,
      rank: await this.getUserRank(user.username, user.UserSeasons[0]?.rating),
    };
    if (user.UserSeasons[0]) {
      return {
        ...info,
        wins: user.UserSeasons[0].wins,
        loses: user.UserSeasons[0].loses,
        rating: user.UserSeasons[0].rating,
      };
    }
    return {
      ...info,
      wins: 0,
      loses: 0,
      rating: 0,
    };
  }

  async register(credentials: RegisterBodyDto): Promise<void> {
    const [usernameExists, emailExists] = await Promise.all([
      this.checkIfUsernameExists(credentials.username),
      this.checkIfEmailExists(credentials.email),
    ]);
    if (usernameExists) {
      throw new HttpException(
        "USERNAME_ALREADY_REGISTERED",
        HttpStatus.BAD_GATEWAY,
      );
    }
    if (emailExists) {
      throw new HttpException(
        "EMAIL_ALREADY_REGISTERED",
        HttpStatus.BAD_GATEWAY,
      );
    }
    if (credentials.password !== credentials.confirmPassword) {
      throw new HttpException(
        "PASSWORD_CONFIRMATION_INCORRECT",
        HttpStatus.BAD_GATEWAY,
      );
    }
    await this.createUser(credentials);
  }

  async getUsers(query: GetUsersQueryDto): Promise<GetUsersResDto> {
    const filters: Array<Prisma.UserWhereInput> = [];
    const { perPage = 10, page = 1 } = query;
    if (query.username) {
      filters.push({
        username: {
          contains: query.username,
          mode: "insensitive",
        },
      });
    }
    if (query.character) {
      filters.push({
        character: query.character,
      });
    }
    const count = await this.prismaService.user.count({
      where: {
        AND: filters,
      },
    });

    type UserQueryResult = Array<
      Pick<GetUsersItemDto, "username" | "steamUrl" | "character"> & {
        rating: number | null;
      }
    >;
    const users = await this.prismaService.$queryRaw<UserQueryResult>`
      SELECT U.username, U.character, U."steamUrl", COALESCE(US.rating, 0) FROM "User" as U
        LEFT JOIN "UserSeason" US on U.username = US.username
        LEFT JOIN "Season" S on S.id = US."seasonId"
        WHERE (S."isCurrent" = TRUE OR S IS NULL)
        ${
          query.username
            ? Prisma.sql`AND LOWER(U.username) LIKE LOWER(${
                "%" + query.username + "%"
              })`
            : Prisma.empty
        }
        ${
          query.character
            ? Prisma.sql`AND U.character=${query.character}`
            : Prisma.empty
        }
        ORDER BY COALESCE(US.rating, 0) desc NULLS LAST, U.username
        OFFSET ${perPage * (page - 1)} LIMIT ${perPage}
    `;
    const items: Array<GetUsersItemDto> = await Promise.all(
      users.map(async (user) => {
        const info: Pick<
          GetUsersItemDto,
          "username" | "steamUrl" | "character" | "rank"
        > = {
          username: user.username,
          steamUrl: user.steamUrl,
          character: user.character,
          rank: await this.getUserRank(user.username, user.rating),
        };
        return {
          ...info,
          rating: user.rating || 0,
        };
      }),
    );
    return {
      count,
      items,
    };
  }

  async getTop10(): Promise<GetTop10ResDto> {
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

  async editProfile(username: string, info: EditProfileBodyDto) {
    await this.prismaService.user.update({
      where: {
        username,
      },
      data: {
        character: info.character,
        steamUrl: info.steamUrl,
        otherInfo: info.otherInfo,
      },
    });
  }

  async changePassword(username: string, passwordInfo: ChangePasswordBodyDto) {
    const salt = await bcrypt.genSalt(10);
    const oldPasswordMatches = this.validateCredentials({
      username,
      password: passwordInfo.oldPassword,
    });
    if (!oldPasswordMatches) {
      throw new HttpException(
        "OLD_PASSWORD_DOESNT_MATCH",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prismaService.user.update({
      where: {
        username,
      },
      data: {
        password: await bcrypt.hash(passwordInfo.newPassword, salt),
      },
    });
  }
}
