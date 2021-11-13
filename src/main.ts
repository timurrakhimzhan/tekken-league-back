import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { migrate } from "./db/migrate";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

async function bootstrap() {
  await migrate();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix("api/");
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_GATEWAY,
      stopAtFirstError: true,
      enableDebugMessages: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(app.getHttpAdapter()));
  await app.listen(3001, "0.0.0.0");
}
bootstrap();
