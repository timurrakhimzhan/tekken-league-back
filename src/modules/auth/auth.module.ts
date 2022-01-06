import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JWT_SECRET } from "../../config";

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
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
