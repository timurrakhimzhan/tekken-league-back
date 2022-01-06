import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { FastifyRequest } from "fastify";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import fastJsonStringify from "fast-json-stringify";

@Injectable()
export class FastifySchemaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const schemas = validationMetadatasToSchemas();
    const stringify = fastJsonStringify(
      schemas["DCharactersResDto"] as Record<string, any>,
    );

    return next.handle().pipe(
      map((value) => {
        return stringify(value);
      }),
    );
  }
}
