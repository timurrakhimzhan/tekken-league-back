import { Injectable } from "@nestjs/common";
import { LoginBodyDto, LoginResDto } from "../../dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { JwtUserPayload } from "../../types/fastify-user-request";
import { RefreshTokenResDto } from "../../dtos/refresh-token-dto";
import { RedisService } from "../redis/redis.service";
import { FIVE_MINUTES, TWENTY_FOUR_HOURS } from "../../constants";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUserCredentials(credentials: LoginBodyDto) {
    return this.userService.validateCredentials(credentials);
  }

  async login(username: string): Promise<LoginResDto> {
    const payload: Omit<JwtUserPayload, "iat" | "exp"> = {
      username,
    };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: FIVE_MINUTES }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: TWENTY_FOUR_HOURS,
      }),
    };
  }
  async refreshToken(username: string): Promise<RefreshTokenResDto> {
    const payload: Omit<JwtUserPayload, "iat" | "exp"> = {
      username,
    };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: FIVE_MINUTES }),
    };
  }
  async logout(refreshToken: string): Promise<void> {
    await this.redisService.invalidateToken(refreshToken);
  }
}
