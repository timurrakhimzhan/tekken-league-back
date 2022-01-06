import { ApiProperty } from "@nestjs/swagger";

class GetCharactersItemDto {
  @ApiProperty()
  codename: string;
  labelRu: string;
  labelEn: string;
}

export class GetCharactersResDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true })
  items: Array<GetCharactersItemDto>;
}
