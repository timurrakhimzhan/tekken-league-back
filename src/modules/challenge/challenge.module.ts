import { Module } from "@nestjs/common";
import { ChallengeService } from "./challenge.service";
import { ChallengeController } from "./challenge.controller";
import { PrismaService } from "../prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [ChallengeService, PrismaService],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
