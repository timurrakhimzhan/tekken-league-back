import { forwardRef, Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [PrismaService, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
