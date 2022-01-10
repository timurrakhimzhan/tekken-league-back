import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetCharactersResDto } from "../../dtos/get-characters.dto";
import { GetUsernamesResDto } from "../../dtos/get-usernames.dto";

@Injectable()
export class DictionaryService {
  constructor(private prismaService: PrismaService) {}

  async getCharacters(): Promise<GetCharactersResDto> {
    const characters = await this.prismaService.dCharacter.findMany();
    return {
      count: characters.length,
      items: characters,
    };
  }

  async getUsernames(): Promise<GetUsernamesResDto> {
    const users = await this.prismaService.user.findMany({
      select: {
        username: true,
      },
    });
    return {
      count: users.length,
      items: users.map(({ username }) => username),
    };
  }
}
