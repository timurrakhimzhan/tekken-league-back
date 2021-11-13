import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { LocalAuthGuard } from "../../guards/LocalAuthGuard";

@Controller("auth")
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@Body() credentials: LoginDto, @Req() req) {
    console.log(req);
    return this.authService.login(credentials);
  }

  @Post("/register")
  register(@Body() credentials: RegisterDto) {
    return this.authService.register(credentials);
  }
}
