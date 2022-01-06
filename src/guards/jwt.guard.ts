import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { FastifyRequest } from "fastify";
import { JwtService } from "@nestjs/jwt";
import {
  FastifyUserRequest,
  JwtUserPayload,
} from "../types/fastify-user-request";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];
    if (!authHeader || typeof authHeader !== "string") {
      throw new HttpException("TOKEN_NOT_PROVIDED", 401);
    }
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      throw new HttpException("TOKEN_NOT_PROVIDED", 401);
    }
    try {
      const user = this.jwtService.verify<JwtUserPayload>(token);
      if (user) {
        (request as FastifyUserRequest).user = user;
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    throw new HttpException("TOKEN_EXPIRED", 401);
  }
}
