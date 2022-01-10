import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { DictionaryModule } from "./modules/dictionary/dictionary.module";
import { MatchModule } from "./modules/match/match.module";
import { ChallengeModule } from "./modules/challenge/challenge.module";
import { RedisService } from "./modules/redis/redis.service";

@Module({
  imports: [
    AuthModule,
    UserModule,
    DictionaryModule,
    MatchModule,
    ChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
