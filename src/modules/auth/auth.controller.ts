import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalGuard } from "../../guards/local.guard";
import { LoginResDto, LoginBodyDto } from "../../dtos/login.dto";
import { RefreshTokenBodyDto } from "../../dtos/refresh-token-dto";
import { RefreshGuard } from "../../guards/refresh.guard";
import { FastifyUserRequest } from "../../types/fastify-user-request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post("login")
  login(@Body() credentials: LoginBodyDto): Promise<LoginResDto> {
    return this.authService.login(credentials.username);
  }

  @UseGuards(RefreshGuard)
  @Post("refresh-token")
  async refreshToken(
    @Request() req: FastifyUserRequest,
    @Body() _: RefreshTokenBodyDto,
  ) {
    return this.authService.refreshToken(req.user.username);
  }

  @UseGuards(RefreshGuard)
  @Post("logout")
  async logout(@Body() tokenInfo: RefreshTokenBodyDto) {
    return this.authService.logout(tokenInfo.refreshToken);
  }
}
