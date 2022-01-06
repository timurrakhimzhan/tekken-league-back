import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalGuard } from "../../guards/local.guard";
import { LoginResDto, LoginBodyDto } from "../../dtos/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post("login")
  login(@Body() credentials: LoginBodyDto): Promise<LoginResDto> {
    return this.authService.login(credentials);
  }
}
