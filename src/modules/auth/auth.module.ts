import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "../../config";
import { RedisService } from "../redis/redis.service";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: "5000s",
      },
    }),
  ],
  providers: [AuthService, RedisService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
