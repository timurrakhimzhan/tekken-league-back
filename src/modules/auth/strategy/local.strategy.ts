import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "username", passwordField: "password" });
  }

  async validate(username: string, password: string): Promise<LoginDto> {
    const isCredentialsCorrect = await this.authService.isCredentialsCorrect({
      username,
      password,
    });
    if (!isCredentialsCorrect) {
      throw new HttpException(
        "USERNAME_PASSWORD_INCORRECT",
        HttpStatus.BAD_GATEWAY,
      );
    }
    return { username, password };
  }
}
