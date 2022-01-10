import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { AuthService } from "../modules/auth/auth.service";
import { FastifyRequest } from "fastify";
import { RedisService } from "../modules/redis/redis.service";
import { RefreshTokenBodyDto } from "../dtos/refresh-token-dto";
import {
  FastifyUserRequest,
  JwtUserPayload,
} from "../types/fastify-user-request";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const { refreshToken } = request.body as any;
    if (!refreshToken) {
      return false;
    }
    if (typeof refreshToken !== "string") {
      return false;
    }
    const isTokenValid = await this.redisService.isTokenValid(refreshToken);
    if (!isTokenValid) {
      throw new HttpException("REFRESH_TOKEN_NOT_VALID", 401);
    }
    try {
      const user = this.jwtService.verify<JwtUserPayload>(refreshToken);
      if (user) {
        (request as FastifyUserRequest).user = user;
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }
}
