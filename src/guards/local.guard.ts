import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { FastifyRequest } from "fastify";
import { AuthService } from "../modules/auth/auth.service";

@Injectable()
export class LocalGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const { username, password } = request.body as any;
    if (!username || !password) {
      return false;
    }
    if (typeof username !== "string" || typeof password !== "string") {
      return false;
    }
    const res = await this.authService.validateUserCredentials({
      username,
      password,
    });
    if (!res) {
      throw new HttpException("USERNAME_PASSWORD_INCORRECT", 401);
    }
    return true;
  }
}
