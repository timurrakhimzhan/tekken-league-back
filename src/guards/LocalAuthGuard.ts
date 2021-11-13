import { AuthGuard } from "@nestjs/passport";
import { HttpException, HttpStatus } from "@nestjs/common";

export class LocalAuthGuard extends AuthGuard("local") {
  handleRequest(err: any, user: any, info, context, status) {
    try {
      return super.handleRequest(err, user, info, context, status);
    } catch (error) {
      throw new HttpException(
        "USERNAME_PASSWORD_INCORRECT",
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
