import { BaseExceptionFilter } from "@nestjs/core";
import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    //The case in which the exception is string
    const exceptionResponse = exception.getResponse();
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

    return super.catch(exception, host);
  }
}
