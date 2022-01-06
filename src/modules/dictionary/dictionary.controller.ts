import { Controller, Get } from "@nestjs/common";
import { DictionaryService } from "./dictionary.service";
import { GetCharactersResDto } from "../../dtos/get-characters.dto";

@Controller("dictionary")
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get("characters")
  getCharacters(): Promise<GetCharactersResDto> {
    return this.dictionaryService.getCharacters();
  }
}
