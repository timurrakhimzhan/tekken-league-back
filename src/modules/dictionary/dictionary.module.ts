import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DictionaryController } from "./dictionary.controller";
import { DictionaryService } from "./dictionary.service";

@Module({
  controllers: [DictionaryController],
  providers: [PrismaService, DictionaryService],
})
export class DictionaryModule {}
