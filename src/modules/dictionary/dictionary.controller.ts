import { Controller, Get } from "@nestjs/common";
import { DictionaryService } from "./dictionary.service";
import { GetCharactersResDto } from "../../dtos/get-characters.dto";
import { GetUsernamesResDto } from "../../dtos/get-usernames.dto";

const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
};

@Controller("dictionary")
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get("characters")
  async getCharacters(): Promise<GetCharactersResDto> {
    return this.dictionaryService.getCharacters();
  }

  @Get("usernames")
  async getUsernames(): Promise<GetUsernamesResDto> {
    return this.dictionaryService.getUsernames();
  }
}
