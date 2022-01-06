import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetCharactersResDto } from "../../dtos/get-characters.dto";

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
}
