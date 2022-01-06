import { Injectable } from "@nestjs/common";
import { LoginBodyDto } from "../../dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { JwtUserPayload } from "../../types/fastify-user-request";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserCredentials(credentials: LoginBodyDto) {
    return this.userService.validateCredentials(credentials);
  }

  async login(credentials: LoginBodyDto): Promise<LoginResponse> {
    const payload: Omit<JwtUserPayload, "iat" | "exp"> = {
      username: credentials.username,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
