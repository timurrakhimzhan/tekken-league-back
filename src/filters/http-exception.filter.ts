import { BaseExceptionFilter } from "@nestjs/core";
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  //TODO: catch internal errors too
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    //The case in which the exception is string
    if (exception instanceof HttpException) {
      const exceptionResponse = exception?.getResponse();
      if (typeof exceptionResponse === "string") {
        const newException = new HttpException(
          {
            statusCode: exception.getStatus(),
            messages: [exceptionResponse],
          },
          exception.getStatus(),
        );
        return super.catch(newException, host);
      }

      //The case in which the exception is an array or object
      const messages = (exceptionResponse as any).message;
      if (typeof messages === "string") {
        const newException = new HttpException(
          {
            statusCode: exception.getStatus(),
            messages: [messages],
          },
          exception.getStatus(),
        );
        return super.catch(newException, host);
      }
      if (Array.isArray(messages)) {
        const newException = new HttpException(
          {
            statusCode: exception.getStatus(),
            messages,
          },
          exception.getStatus(),
        );
        return super.catch(newException, host);
      }
    }
    const newException = new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        messages: [exception.message],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    return super.catch(newException, host);
  }
}
