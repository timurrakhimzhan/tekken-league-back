import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { DictionaryModule } from "./modules/dictionary/dictionary.module";
import { LeaderboardModule } from "./modules/leaderboard/leaderboard.module";
import { MatchModule } from "./modules/match/match.module";
import { ChallengeModule } from "./modules/challenge/challenge.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    DictionaryModule,
    LeaderboardModule,
    MatchModule,
    ChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
